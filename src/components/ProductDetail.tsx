import React, { useState } from 'react';
import { Product, COMMON_ADDONS } from '../data/catalog';
import { useApp } from '../context/AppContext';
import { getProductImage } from '../data/productImages';
import { ArrowLeft, Check, Shield, Wrench, Clock, Box, Eye, CheckCircle2 } from 'lucide-react';

interface ProductDetailProps {
  product: Product;
  navigate: (path: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ product, navigate }) => {
  const { format, addToCart } = useApp();
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [imageError, setImageError] = useState(false);
  const imageUrl = getProductImage(product.slug, product.category);

  const toggleAddon = (addonId: string) => {
    setSelectedAddonIds((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const addonsTotalMinor = selectedAddonIds.reduce((acc, id) => {
    const addon = COMMON_ADDONS.find((a) => a.id === id);
    return acc + (addon ? addon.basePriceMinor : 0);
  }, 0);

  const totalCalculatedMinor = product.unitPriceMinor * quantity + addonsTotalMinor;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedAddonIds);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const getBrandBadgeColor = (brand: string) => {
    switch (brand) {
      case 'Hikvision':
        return '#dc2626';
      case 'Dahua':
        return '#0284c7';
      case 'Cisco':
        return '#0284c7';
      case 'MikroTik':
        return '#d97706';
      case 'Ubiquiti':
        return '#2563eb';
      case 'Dintek':
        return '#059669';
      case 'Cambium':
        return '#7c3aed';
      default:
        return '#475569';
    }
  };

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1rem 3rem' }}>
      {/* Back button */}
      <div style={{ marginBottom: '1.5rem' }}>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => navigate('/products')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', paddingLeft: 0 }}
        >
          <ArrowLeft size={16} />
          <span>Back to catalog</span>
        </button>
      </div>

      <div className="detail-grid">
        {/* Left: Product Media Card */}
        <div className="detail-media surface-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#ffffff', minHeight: '400px' }}>
          <div
            style={{
              width: '100%',
              maxWidth: '380px',
              aspectRatio: '1',
              borderRadius: '1rem',
              background: '#f8fafc',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
              position: 'relative',
              overflow: 'hidden',
              boxShadow: 'inset 0 2px 6px rgba(0,0,0,0.02)',
            }}
          >
            <span
              style={{
                position: 'absolute',
                top: '1rem',
                left: '1rem',
                background: getBrandBadgeColor(product.brand),
                color: '#ffffff',
                padding: '0.25rem 0.75rem',
                borderRadius: '4px',
                fontSize: '0.8rem',
                fontWeight: 700,
                zIndex: 2,
                boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
              }}
            >
              {product.brand}
            </span>

            <span
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                fontFamily: 'monospace',
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                background: 'rgba(255,255,255,0.85)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                zIndex: 2,
              }}
            >
              {product.sku}
            </span>

            {/* High definition product picture */}
            {!imageError ? (
              <img
                src={imageUrl}
                alt={product.name}
                referrerPolicy="no-referrer"
                loading="eager"
                onError={() => setImageError(true)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              />
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', textAlign: 'center' }}>
                <Box size={48} color="#2563eb" strokeWidth={1.5} />
                <p style={{ margin: '0.5rem 0 0', fontWeight: 600, fontSize: '0.9rem', color: '#1e293b' }}>
                  {product.name}
                </p>
              </div>
            )}

            <div
              style={{
                position: 'absolute',
                bottom: '0.75rem',
                display: 'flex',
                gap: '0.4rem',
                zIndex: 2,
              }}
            >
              <span className="chip" style={{ fontSize: '0.72rem', background: 'rgba(255,255,255,0.92)' }}>
                Shipping: {product.shippingClass === 'bulky' ? 'Bulky freight' : 'Standard courier'}
              </span>
            </div>
          </div>

          {/* Technical Specifications */}
          {product.specs && (
            <div style={{ width: '100%', marginTop: '2rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
              <h4 style={{ margin: '0 0 0.75rem', fontSize: '0.95rem', fontWeight: 700 }}>
                Technical Specifications
              </h4>
              <dl style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.5rem', margin: 0 }}>
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.35rem 0', borderBottom: '1px dashed #edf2f7', fontSize: '0.85rem' }}>
                    <dt style={{ color: 'var(--text-muted)' }}>{key}</dt>
                    <dd style={{ margin: 0, fontWeight: 500, textAlign: 'right' }}>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>

        {/* Right: Buy Card */}
        <div className="detail-buy surface-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.25rem', background: '#ffffff' }}>
          <div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.5rem' }}>
              <span className="chip">{product.brand}</span>
              <span className="chip">{product.category}</span>
              {product.usage.map((u) => (
                <span key={u} className="chip">{u}</span>
              ))}
            </div>

            <h1 className="detail-title" style={{ margin: '0 0 0.5rem', fontSize: '1.6rem', fontWeight: 800, lineHeight: 1.25 }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <span className="chip" style={{ fontFamily: 'monospace' }}>
                SKU: {product.sku}
              </span>
              <span className="chip chip--success">
                {product.stock} in stock · Ready to ship
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem' }}>
              <span className="product-card__price mono" style={{ fontSize: '1.85rem', fontWeight: 800 }}>
                {format(product.unitPriceMinor)}
              </span>
              <span className="muted" style={{ fontSize: '0.85rem' }}>
                Base unit price
              </span>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <p style={{ margin: 0, fontSize: '0.95rem', lineHeight: 1.6, color: '#334155' }}>
              {product.description}
            </p>
          </div>

          {/* Add-on Services Picker */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
            <h3 style={{ margin: '0 0 0.35rem', fontSize: '1rem', fontWeight: 700 }}>
              Optional Commissioning &amp; Protection Add-ons
            </h3>
            <p className="muted" style={{ margin: '0 0 0.75rem', fontSize: '0.82rem' }}>
              Attach installation tuning or warranty extensions directly to this unit.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {COMMON_ADDONS.map((addon) => {
                const isSelected = selectedAddonIds.includes(addon.id);
                return (
                  <label
                    key={addon.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.75rem',
                      padding: '0.75rem',
                      borderRadius: '0.65rem',
                      border: `1px solid ${isSelected ? '#2563eb' : 'var(--border-subtle)'}`,
                      background: isSelected ? 'rgba(37, 99, 235, 0.04)' : 'var(--color-surface)',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleAddon(addon.id)}
                      style={{ marginTop: '0.2rem', accentColor: '#2563eb' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.88rem' }}>{addon.name}</span>
                        <strong className="mono" style={{ fontSize: '0.88rem', color: '#2563eb' }}>
                          +{format(addon.basePriceMinor)}
                        </strong>
                      </div>
                      {addon.durationMinutes && (
                        <span className="muted" style={{ fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.15rem' }}>
                          <Clock size={12} /> Approx {addon.durationMinutes} min technician configuration
                        </span>
                      )}
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 600 }}>Quantity</span>
              <span className="qty-stepper">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </span>
              <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                <span className="muted" style={{ fontSize: '0.78rem', display: 'block' }}>Line Total</span>
                <strong className="mono" style={{ fontSize: '1.15rem' }}>
                  {format(totalCalculatedMinor)}
                </strong>
              </div>
            </div>

            <button
              type="button"
              className="btn btn--block atc__cta"
              onClick={handleAddToCart}
              style={{
                padding: '0.85rem 1.5rem',
                fontSize: '1rem',
                fontWeight: 700,
                background: addedAnimation ? '#16a34a' : 'var(--color-primary)',
              }}
            >
              {addedAnimation ? '✓ Added to Cart!' : `Add to Cart — ${format(totalCalculatedMinor)}`}
            </button>

            <p className="muted" style={{ margin: '0.85rem 0 0', fontSize: '0.78rem', lineHeight: 1.5 }}>
              Add-on services attach to the product line in your cart. Shipping (standard/bulky class)
              is quoted server-side after you enter an address. Need an engineer instead?{' '}
              <a
                href="/services"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/services');
                }}
                style={{ textDecoration: 'underline' }}
              >
                Book a service
              </a>{' '}
              — bookings stay separate from orders.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
