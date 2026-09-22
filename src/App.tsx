import React, { useState, useEffect, useMemo } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { StoreFilters, FilterState } from './components/StoreFilters';
import { ProductCard } from './components/ProductCard';
import { ProductDetail } from './components/ProductDetail';
import { CartDrawer } from './components/CartDrawer';
import { ServicesView } from './components/ServicesView';
import { BookingWizard } from './components/BookingWizard';
import { ServiceRequestsView } from './components/ServiceRequestsView';
import { OrdersView } from './components/OrdersView';
import { CheckoutView } from './components/CheckoutView';
import { AuthModal } from './components/AuthModal';
import { PRODUCTS, Product } from './data/catalog';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

function AppContent() {
  // Navigation & URL state
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [currentSearch, setCurrentSearch] = useState<string>(() => window.location.search || '');

  const navigate = (path: string) => {
    const [pathname, search] = path.split('?');
    window.history.pushState({}, '', path);
    setCurrentPath(pathname);
    setCurrentSearch(search ? `?${search}` : '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname || '/');
      setCurrentSearch(window.location.search || '');
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Filter state for catalog
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    usages: [],
    inStockOnly: false,
    brand: '',
    minPrice: '',
    maxPrice: '',
    searchQuery: '',
  });

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Filter products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      // Category
      if (filters.category && p.category !== filters.category) {
        return false;
      }
      // Usages
      if (filters.usages.length > 0) {
        const matchesAny = filters.usages.some((u) => p.usage.includes(u as any));
        if (!matchesAny) return false;
      }
      // In stock
      if (filters.inStockOnly && p.stock <= 0) {
        return false;
      }
      // Brand
      if (filters.brand && p.brand !== filters.brand) {
        return false;
      }
      // Min price
      if (filters.minPrice) {
        const minMinor = parseFloat(filters.minPrice) * 100;
        if (!isNaN(minMinor) && p.unitPriceMinor < minMinor) return false;
      }
      // Max price
      if (filters.maxPrice) {
        const maxMinor = parseFloat(filters.maxPrice) * 100;
        if (!isNaN(maxMinor) && p.unitPriceMinor > maxMinor) return false;
      }
      // Search
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matches =
          p.name.toLowerCase().includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.unitPriceMinor - b.unitPriceMinor;
      if (sortBy === 'price-desc') return b.unitPriceMinor - a.unitPriceMinor;
      return 0;
    });
  }, [filters, sortBy]);

  // Route matching:
  // 1. /products/:slug
  const productDetailMatch = currentPath.match(/^\/products\/([a-zA-Z0-9_-]+)/);
  const activeProduct = productDetailMatch
    ? PRODUCTS.find((p) => p.slug === productDetailMatch[1])
    : null;

  // 2. /booking?service=...
  const searchParams = new URLSearchParams(currentSearch);
  const requestedServiceSlug = searchParams.get('service') || undefined;

  return (
    <div className="app-shell">
      <Header currentPath={currentPath} navigate={navigate} />

      <main id="main-content">
        {/* ROUTE: /products/:slug */}
        {activeProduct ? (
          <ProductDetail product={activeProduct} navigate={navigate} />
        ) : currentPath.startsWith('/services') ? (
          /* ROUTE: /services */
          <ServicesView navigate={navigate} />
        ) : currentPath.startsWith('/booking') ? (
          /* ROUTE: /booking */
          <BookingWizard initialServiceSlug={requestedServiceSlug} navigate={navigate} />
        ) : currentPath.startsWith('/account/service-requests') ? (
          /* ROUTE: /account/service-requests */
          <ServiceRequestsView navigate={navigate} />
        ) : currentPath.startsWith('/account/orders') ? (
          /* ROUTE: /account/orders */
          <OrdersView navigate={navigate} />
        ) : currentPath.startsWith('/checkout') ? (
          /* ROUTE: /checkout */
          <CheckoutView navigate={navigate} />
        ) : (
          /* ROUTE: / or /products (Storefront) */
          <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.25rem 1rem 4rem' }}>
            {currentPath === '/' && (
              <div style={{ marginBottom: '2rem' }}>
                <Hero navigate={navigate} />
              </div>
            )}

            <div id="catalog-grid" className="storefront-grid">
              {/* Filter Sidebar */}
              <StoreFilters
                filters={filters}
                setFilters={setFilters}
                mobileOpen={mobileFilterOpen}
                onCloseMobile={() => setMobileFilterOpen(false)}
                totalFiltered={filteredProducts.length}
              />

              {/* Products Main Column */}
              <div>
                {/* Store Top Bar */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    marginBottom: '1.25rem',
                    background: '#ffffff',
                    padding: '0.85rem 1.25rem',
                    borderRadius: 'var(--radius-card)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <button
                      type="button"
                      className="btn btn--secondary btn--sm md:hidden"
                      onClick={() => setMobileFilterOpen(true)}
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                    >
                      <SlidersHorizontal size={15} />
                      <span>Filters</span>
                      {(filters.category || filters.usages.length > 0 || filters.brand || filters.inStockOnly) && (
                        <span className="chip chip--success" style={{ padding: '0.1rem 0.4rem', fontSize: '0.7rem' }}>
                          Active
                        </span>
                      )}
                    </button>

                    <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                      Showing <strong>{filteredProducts.length}</strong> of {PRODUCTS.length} products
                    </span>
                  </div>

                  {/* Sort Dropdown */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <label htmlFor="sort_by" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Sort by:
                    </label>
                    <select
                      id="sort_by"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      style={{
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '.5rem',
                        padding: '.3rem .6rem',
                        font: 'inherit',
                        fontSize: '.85rem',
                        background: 'var(--color-surface)',
                        cursor: 'pointer',
                      }}
                    >
                      <option value="featured">Featured Catalog</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                  </div>
                </div>

                {/* Active Filter Badges */}
                {(filters.category || filters.brand || filters.usages.length > 0 || filters.inStockOnly || filters.searchQuery) && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Filters:</span>
                    {filters.category && (
                      <span className="chip" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        Category: {filters.category}
                        <button
                          type="button"
                          onClick={() => setFilters((f) => ({ ...f, category: '' }))}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    {filters.brand && (
                      <span className="chip" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        Brand: {filters.brand}
                        <button
                          type="button"
                          onClick={() => setFilters((f) => ({ ...f, brand: '' }))}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    {filters.usages.map((u) => (
                      <span key={u} className="chip" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        {u}
                        <button
                          type="button"
                          onClick={() => setFilters((f) => ({ ...f, usages: f.usages.filter((x) => x !== u) }))}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                    {filters.inStockOnly && (
                      <span className="chip chip--success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        In stock only
                        <button
                          type="button"
                          onClick={() => setFilters((f) => ({ ...f, inStockOnly: false }))}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    {filters.searchQuery && (
                      <span className="chip" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                        "{filters.searchQuery}"
                        <button
                          type="button"
                          onClick={() => setFilters((f) => ({ ...f, searchQuery: '' }))}
                          style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 0 }}
                        >
                          ✕
                        </button>
                      </span>
                    )}
                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      style={{ fontSize: '0.78rem', padding: '0.15rem 0.5rem' }}
                      onClick={() =>
                        setFilters({
                          category: '',
                          usages: [],
                          inStockOnly: false,
                          brand: '',
                          minPrice: '',
                          maxPrice: '',
                          searchQuery: '',
                        })
                      }
                    >
                      Clear all
                    </button>
                  </div>
                )}

                {/* Products Grid */}
                {filteredProducts.length === 0 ? (
                  <div className="surface-card" style={{ padding: '3.5rem 2rem', textAlign: 'center', background: '#ffffff' }}>
                    <p style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontWeight: 600 }}>
                      No equipment matches your current filters.
                    </p>
                    <button
                      type="button"
                      className="btn btn--secondary"
                      onClick={() =>
                        setFilters({
                          category: '',
                          usages: [],
                          inStockOnly: false,
                          brand: '',
                          minPrice: '',
                          maxPrice: '',
                          searchQuery: '',
                        })
                      }
                    >
                      Reset filters
                    </button>
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                      gap: '1.25rem',
                    }}
                  >
                    {filteredProducts.map((p) => (
                      <ProductCard key={p.id} product={p} navigate={navigate} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
      <CartDrawer navigate={navigate} />
      <AuthModal />
    </div>
  );
}

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
