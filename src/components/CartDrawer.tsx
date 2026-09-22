import React, { useEffect, useMemo } from 'react';
import { useApp, CartLine } from '../context/AppContext';
import { getProductImage } from '../data/productImages';

interface CartDrawerProps {
  navigate: (path: string) => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ navigate }) => {
  const {
    cartLines,
    updateQuantity,
    removeLine,
    clearCart,
    isCartOpen,
    closeCart,
    subtotalMinor,
    totalCartItems,
    shippingQuote,
    format,
  } = useApp();

  // Close on Escape key
  useEffect(() => {
    if (!isCartOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isCartOpen, closeCart]);

  // Prevent background scroll when cart is open
  useEffect(() => {
    if (!isCartOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isCartOpen]);

  // Group lines so add-ons appear indented directly below their parent product
  const organizedLines = useMemo(() => {
    const parentMap = new Map<string | undefined, CartLine[]>();

    cartLines.forEach((line) => {
      const parentKey = line.kind === 'product' ? undefined : line.parentLineId;
      const list = parentMap.get(parentKey) || [];
      list.push(line);
      parentMap.set(parentKey, list);
    });

    const result: CartLine[] = [];
    const roots = parentMap.get(undefined) || [];

    roots.forEach((root) => {
      result.push(root);
      const children = parentMap.get(root.lineId) || [];
      children.forEach((child) => result.push(child));
    });

    // Add orphaned add-ons if any
    parentMap.forEach((children, parentId) => {
      if (parentId !== undefined && !cartLines.some((l) => l.lineId === parentId)) {
        result.push(...children);
      }
    });

    return result;
  }, [cartLines]);

  const shippingFormatted = shippingQuote
    ? format(shippingQuote.shippingFeeMinor)
    : 'Calculate after address';

  const totalCalculatedMinor = shippingQuote
    ? subtotalMinor + shippingQuote.shippingFeeMinor
    : subtotalMinor;

  return (
    <>
      {isCartOpen && (
        <button
          type="button"
          className="cart-scrim"
          aria-label="Close cart"
          onClick={closeCart}
        />
      )}

      <aside
        className="cart-drawer"
        data-open={isCartOpen}
        aria-label="Shopping cart"
        aria-hidden={!isCartOpen}
      >
        {/* Cart Drawer Header */}
        <div className="cart-drawer__head">
          <div className="cart-drawer__head-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <strong>Your cart</strong>
            {totalCartItems > 0 && (
              <span className="chip">
                {totalCartItems} {totalCartItems === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <div className="cart-drawer__head-actions">
            <button
              type="button"
              className="btn btn--ghost btn--sm"
              aria-label="Close cart"
              onClick={closeCart}
            >
              Close ✕
            </button>
          </div>
        </div>

        {/* Cart Drawer Body */}
        <div className="cart-drawer__body" style={{ overflowY: 'auto', flex: 1, padding: '1rem' }}>
          {organizedLines.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <span style={{ fontSize: '3rem', display: 'block', marginBottom: '1rem' }}>🛒</span>
              <p className="muted" style={{ margin: 0, fontSize: '0.95rem' }}>
                Nothing in the cart yet.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {organizedLines.map((line) => {
                const isAddon = line.kind === 'service_addon';
                const thumbUrl = line.productSlug ? getProductImage(line.productSlug) : null;

                return (
                  <div
                    key={line.lineId}
                    className={`cart-line ${isAddon ? 'cart-line--child' : ''}`}
                    style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}
                  >
                    {!isAddon && thumbUrl && (
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          flexShrink: 0,
                          borderRadius: '6px',
                          border: '1px solid var(--border-subtle)',
                          background: '#f8fafc',
                          overflow: 'hidden',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '2px',
                        }}
                      >
                        <img
                          src={thumbUrl}
                          alt={line.name}
                          referrerPolicy="no-referrer"
                          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                        />
                      </div>
                    )}

                    <div className="cart-line__main" style={{ flex: 1, minWidth: 0 }}>
                      <p className="cart-line__name">
                        {isAddon ? '↳ ' : ''}
                        {line.name}
                      </p>
                      <p className="cart-line__price mono">
                        {format(line.baseUnitMinor)}{' '}
                        {line.sku ? `· ${line.sku}` : ''}
                      </p>

                      <div className="row" style={{ gap: '.35rem', marginTop: '0.25rem' }}>
                        {!isAddon && (
                          <span className="qty-stepper">
                            <button
                              type="button"
                              aria-label={`Decrease quantity of ${line.name}`}
                              onClick={() => updateQuantity(line.lineId, line.quantity - 1)}
                            >
                              −
                            </button>
                            <span aria-live="polite">{line.quantity}</span>
                            <button
                              type="button"
                              aria-label={`Increase quantity of ${line.name}`}
                              onClick={() => updateQuantity(line.lineId, line.quantity + 1)}
                            >
                              +
                            </button>
                          </span>
                        )}

                        <button
                          type="button"
                          className="btn btn--ghost btn--sm"
                          onClick={() => removeLine(line.lineId)}
                          aria-label={`Remove ${line.name}${isAddon ? '' : ' and its attached add-ons'}`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>

                    <strong className="mono" style={{ fontSize: '0.9rem', alignSelf: 'flex-start' }}>
                      {format(line.baseUnitMinor * line.quantity)}
                    </strong>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Cart Drawer Foot */}
        <div className="cart-drawer__foot">
          {organizedLines.length > 0 ? (
            <div className="cart-totals" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
              <div className="row" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span className="mono" style={{ fontWeight: 600 }}>{format(subtotalMinor)}</span>
              </div>

              <div className="row" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                <span className="muted">Shipping</span>
                <span className="muted">{shippingFormatted}</span>
              </div>

              {!shippingQuote && (
                <p className="muted" style={{ margin: 0, fontSize: '.78rem' }}>
                  Shipping and currency conversion are confirmed on checkout.
                </p>
              )}

              <div
                className="row"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '0.5rem',
                  marginTop: '0.25rem',
                }}
              >
                <span>Estimated Total</span>
                <span className="mono">{format(totalCalculatedMinor)}</span>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={clearCart}
                  style={{ flex: 1 }}
                >
                  Clear cart
                </button>
                <button
                  type="button"
                  className="btn cart-drawer__checkout"
                  onClick={() => {
                    closeCart();
                    navigate('/checkout');
                  }}
                  style={{ flex: 2, textAlign: 'center' }}
                >
                  Go to checkout
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="btn btn--secondary btn--block"
              onClick={closeCart}
            >
              Continue shopping
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
