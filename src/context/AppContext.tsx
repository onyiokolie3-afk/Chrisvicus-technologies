import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import {
  CurrencyCode,
  DEFAULT_RATES,
  formatCurrency,
  convertMinor,
  Product,
  ProductAddon,
  ShippingAddress,
  ShippingCalculation,
  calculateShippingQuote,
} from '../data/catalog';

export interface CartLine {
  lineId: string;
  kind: 'product' | 'service_addon';
  productId: string;
  productSlug?: string;
  parentLineId?: string;
  name: string;
  sku?: string;
  quantity: number;
  baseUnitMinor: number;
  baseCurrency: 'NGN';
  shippingClass?: 'standard' | 'bulky';
  isShippable: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface ServiceRequest {
  id: string;
  requestNumber: string;
  serviceId: string;
  serviceSlug: string;
  serviceName: string;
  indicativePriceMinor: number;
  requestedStartAt: string;
  requestedEndAt: string;
  siteAddress: {
    addressLine1: string;
    city: string;
    state: string;
  };
  notes?: string;
  status: 'Submitted' | 'Under Review' | 'Confirmed' | 'Completed' | 'Cancelled';
  createdAt: string;
  userEmail: string;
}

export interface OrderItem {
  lineId: string;
  name: string;
  sku?: string;
  quantity: number;
  unitPriceMinor: number;
  isAddon: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  createdAt: string;
  items: OrderItem[];
  subtotalMinor: number;
  shippingMinor: number;
  totalMinor: number;
  currency: CurrencyCode;
  shippingZone: string;
  address: ShippingAddress;
  paymentMethod: 'Paystack' | 'Card' | 'Bank Transfer';
  status: 'Processing' | 'Dispatched' | 'Delivered';
  userEmail: string;
}

interface AppContextType {
  // Currency
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  rates: Record<CurrencyCode, number>;
  format: (amountMinor: number) => string;
  convert: (amountMinor: number) => number;

  // Cart
  cartLines: CartLine[];
  addToCart: (product: Product, quantity?: number, selectedAddonIds?: string[]) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeLine: (lineId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  subtotalMinor: number;
  totalCartItems: number;
  hasBulkyItem: boolean;

  // Shipping quote in checkout
  currentAddress: Partial<ShippingAddress> | null;
  setCurrentAddress: (addr: Partial<ShippingAddress> | null) => void;
  shippingQuote: ShippingCalculation | null;

  // Auth
  user: UserProfile | null;
  login: (email: string, fullName?: string) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;

  // Service Requests
  serviceRequests: ServiceRequest[];
  createServiceRequest: (draft: {
    serviceId: string;
    serviceSlug: string;
    serviceName: string;
    basePriceMinor: number;
    requestedStartAt: string;
    requestedEndAt: string;
    siteAddress: { addressLine1: string; city: string; state: string };
    notes?: string;
  }) => ServiceRequest;
  cancelServiceRequest: (requestId: string) => void;

  // Orders
  orders: Order[];
  placeOrder: (paymentMethod: 'Paystack' | 'Card' | 'Bank Transfer') => Order;
}

const AppContext = createContext<AppContextType | null>(null);

const CART_STORAGE_KEY = 'cv_cart_v1';
const USER_STORAGE_KEY = 'cv_user_v1';
const REQUESTS_STORAGE_KEY = 'cv_requests_v1';
const ORDERS_STORAGE_KEY = 'cv_orders_v1';
const CURRENCY_STORAGE_KEY = 'cv_currency_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Currency State
  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    try {
      const saved = localStorage.getItem(CURRENCY_STORAGE_KEY);
      if (saved && ['NGN', 'USD', 'GBP', 'EUR'].includes(saved)) {
        return saved as CurrencyCode;
      }
    } catch {}
    return 'NGN';
  });

  const [rates] = useState<Record<CurrencyCode, number>>(DEFAULT_RATES);

  const setCurrency = (c: CurrencyCode) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(CURRENCY_STORAGE_KEY, c);
    } catch {}
  };

  const format = useCallback(
    (amountMinor: number) => {
      const converted = convertMinor(amountMinor, currency, rates);
      return formatCurrency(converted, currency);
    },
    [currency, rates]
  );

  const convert = useCallback(
    (amountMinor: number) => {
      return convertMinor(amountMinor, currency, rates);
    },
    [currency, rates]
  );

  // Cart State
  const [cartLines, setCartLines] = useState<CartLine[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartLines));
    } catch {}
  }, [cartLines]);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  const toggleCart = () => setIsCartOpen((prev) => !prev);

  const addToCart = (product: Product, quantity = 1, selectedAddonIds: string[] = []) => {
    const parentLineId = 'ln_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    const newLines: CartLine[] = [];

    // Main product line
    newLines.push({
      lineId: parentLineId,
      kind: 'product',
      productId: product.id,
      productSlug: product.slug,
      name: product.name,
      sku: product.sku,
      quantity: Math.max(1, Math.min(99, quantity)),
      baseUnitMinor: product.unitPriceMinor,
      baseCurrency: 'NGN',
      shippingClass: product.shippingClass,
      isShippable: true,
    });

    // Attached Addons
    if (selectedAddonIds.length > 0) {
      selectedAddonIds.forEach((addonId) => {
        const addon = product.addons.find((a) => a.id === addonId);
        if (addon) {
          const addonLineId = 'ln_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
          newLines.push({
            lineId: addonLineId,
            kind: 'service_addon',
            productId: product.id,
            parentLineId,
            name: addon.name,
            quantity: 1,
            baseUnitMinor: addon.basePriceMinor,
            baseCurrency: 'NGN',
            isShippable: false,
          });
        }
      });
    }

    setCartLines((prev) => [...prev, ...newLines]);
    openCart();
  };

  const updateQuantity = (lineId: string, quantity: number) => {
    if (quantity <= 0) {
      removeLine(lineId);
      return;
    }
    const clamped = Math.max(1, Math.min(99, quantity));
    setCartLines((prev) =>
      prev.map((line) => (line.lineId === lineId ? { ...line, quantity: clamped } : line))
    );
  };

  const removeLine = (lineId: string) => {
    setCartLines((prev) => {
      // Find all IDs to remove: this line and any children attached to it
      const toRemove = new Set<string>([lineId]);
      prev.forEach((l) => {
        if (l.parentLineId === lineId) {
          toRemove.add(l.lineId);
        }
      });
      return prev.filter((l) => !toRemove.has(l.lineId));
    });
  };

  const clearCart = () => setCartLines([]);

  const subtotalMinor = useMemo(() => {
    return cartLines.reduce((acc, line) => acc + line.baseUnitMinor * line.quantity, 0);
  }, [cartLines]);

  const totalCartItems = useMemo(() => {
    return cartLines.filter((l) => l.kind === 'product').reduce((acc, l) => acc + l.quantity, 0);
  }, [cartLines]);

  const hasBulkyItem = useMemo(() => {
    return cartLines.some((l) => l.shippingClass === 'bulky');
  }, [cartLines]);

  // Shipping Quote
  const [currentAddress, setCurrentAddress] = useState<Partial<ShippingAddress> | null>(null);

  const shippingQuote = useMemo(() => {
    if (!currentAddress || !currentAddress.state) return null;
    return calculateShippingQuote(currentAddress, hasBulkyItem);
  }, [currentAddress, hasBulkyItem]);

  // User Auth State
  const [user, setUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem(USER_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    // Default demo user so the app is immediately operable
    return {
      id: 'usr_demo_101',
      email: 'onyiokolie3@gmail.com',
      fullName: 'Onyi Okolie',
      role: 'customer',
      createdAt: '2026-01-15T10:00:00Z',
    };
  });

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const login = (email: string, fullName?: string) => {
    const newUser: UserProfile = {
      id: 'usr_' + Math.random().toString(36).substring(2, 9),
      email: email.trim().toLowerCase(),
      fullName: fullName?.trim() || email.split('@')[0],
      role: 'customer',
      createdAt: new Date().toISOString(),
    };
    setUser(newUser);
    try {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(newUser));
    } catch {}
    closeAuthModal();
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch {}
  };

  // Service Requests State
  const [serviceRequests, setServiceRequests] = useState<ServiceRequest[]>(() => {
    try {
      const saved = localStorage.getItem(REQUESTS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    // Initial sample service request so list is not empty on first inspection
    return [
      {
        id: 'req_init_1',
        requestNumber: 'CV-SRV-89412',
        serviceId: '854fe306-cd5f-44e4-a505-4faac067c9ef',
        serviceSlug: 'install-full-cctv-site',
        serviceName: 'Full CCTV Site Installation',
        indicativePriceMinor: 25000000,
        requestedStartAt: new Date(Date.now() + 86400000 * 2).toISOString(),
        requestedEndAt: new Date(Date.now() + 86400000 * 2 + 3600000 * 8).toISOString(),
        siteAddress: {
          addressLine1: 'Plot 14 Victoria Island Industrial Estate',
          city: 'Victoria Island',
          state: 'Lagos',
        },
        notes: '16-camera installation with AcuSense domes, PoE switches, and rack cabinet.',
        status: 'Confirmed',
        createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        userEmail: 'onyiokolie3@gmail.com',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(REQUESTS_STORAGE_KEY, JSON.stringify(serviceRequests));
    } catch {}
  }, [serviceRequests]);

  const createServiceRequest = (draft: {
    serviceId: string;
    serviceSlug: string;
    serviceName: string;
    basePriceMinor: number;
    requestedStartAt: string;
    requestedEndAt: string;
    siteAddress: { addressLine1: string; city: string; state: string };
    notes?: string;
  }): ServiceRequest => {
    const randomCode = Math.floor(10000 + Math.random() * 90000);
    const newReq: ServiceRequest = {
      id: 'req_' + Math.random().toString(36).substring(2, 9),
      requestNumber: `CV-SRV-${randomCode}`,
      serviceId: draft.serviceId,
      serviceSlug: draft.serviceSlug,
      serviceName: draft.serviceName,
      indicativePriceMinor: draft.basePriceMinor,
      requestedStartAt: draft.requestedStartAt,
      requestedEndAt: draft.requestedEndAt,
      siteAddress: draft.siteAddress,
      notes: draft.notes,
      status: 'Submitted',
      createdAt: new Date().toISOString(),
      userEmail: user?.email || 'guest@chrisviscustech.com',
    };

    setServiceRequests((prev) => [newReq, ...prev]);
    return newReq;
  };

  const cancelServiceRequest = (requestId: string) => {
    setServiceRequests((prev) =>
      prev.map((r) => (r.id === requestId ? { ...r, status: 'Cancelled' } : r))
    );
  };

  // Orders State
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem(ORDERS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [
      {
        id: 'ord_demo_1',
        orderNumber: 'CV-ORD-48209',
        createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
        items: [
          {
            lineId: 'l1',
            name: 'Hikvision DS-2CD2143G2-IU AcuSense 4MP Dome',
            sku: 'HK-IPC-T124',
            quantity: 2,
            unitPriceMinor: 18500000,
            isAddon: false,
          },
          {
            lineId: 'l2',
            name: 'CCTV Commissioning & Network Tuning',
            quantity: 1,
            unitPriceMinor: 4500000,
            isAddon: true,
          },
        ],
        subtotalMinor: 41500000,
        shippingMinor: 350000,
        totalMinor: 41850000,
        currency: 'NGN',
        shippingZone: 'Lagos Mainland',
        address: {
          fullName: 'Onyi Okolie',
          email: 'onyiokolie3@gmail.com',
          phone: '+234 803 123 4567',
          country: 'NG',
          state: 'Lagos',
          city: 'Ikeja',
          addressLine1: '12 Allen Avenue, Ikeja',
        },
        paymentMethod: 'Paystack',
        status: 'Dispatched',
        userEmail: 'onyiokolie3@gmail.com',
      },
    ];
  });

  useEffect(() => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch {}
  }, [orders]);

  const placeOrder = (paymentMethod: 'Paystack' | 'Card' | 'Bank Transfer'): Order => {
    const shipping = shippingQuote ? shippingQuote.shippingFeeMinor : 350000;
    const total = subtotalMinor + shipping;
    const randomCode = Math.floor(10000 + Math.random() * 90000);

    const items: OrderItem[] = cartLines.map((line) => ({
      lineId: line.lineId,
      name: line.name,
      sku: line.sku,
      quantity: line.quantity,
      unitPriceMinor: line.baseUnitMinor,
      isAddon: line.kind === 'service_addon',
    }));

    const newOrder: Order = {
      id: 'ord_' + Math.random().toString(36).substring(2, 9),
      orderNumber: `CV-ORD-${randomCode}`,
      createdAt: new Date().toISOString(),
      items,
      subtotalMinor,
      shippingMinor: shipping,
      totalMinor: total,
      currency,
      shippingZone: shippingQuote?.zone || 'Lagos Mainland',
      address: {
        fullName: currentAddress?.fullName || user?.fullName || 'Customer',
        email: currentAddress?.email || user?.email || 'customer@example.com',
        phone: currentAddress?.phone || '+234 800 000 0000',
        country: currentAddress?.country || 'NG',
        state: currentAddress?.state || 'Lagos',
        city: currentAddress?.city || 'Ikeja',
        addressLine1: currentAddress?.addressLine1 || 'Sample Street Address',
        notes: currentAddress?.notes,
      },
      paymentMethod,
      status: 'Processing',
      userEmail: user?.email || currentAddress?.email || 'guest@chrisviscustech.com',
    };

    setOrders((prev) => [newOrder, ...prev]);
    clearCart();
    return newOrder;
  };

  return (
    <AppContext.Provider
      value={{
        currency,
        setCurrency,
        rates,
        format,
        convert,
        cartLines,
        addToCart,
        updateQuantity,
        removeLine,
        clearCart,
        isCartOpen,
        openCart,
        closeCart,
        toggleCart,
        subtotalMinor,
        totalCartItems,
        hasBulkyItem,
        currentAddress,
        setCurrentAddress,
        shippingQuote,
        user,
        login,
        logout,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        serviceRequests,
        createServiceRequest,
        cancelServiceRequest,
        orders,
        placeOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within an AppProvider');
  return ctx;
}
