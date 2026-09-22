import React, { useState } from 'react';
import { Product } from '../data/catalog';
import { useApp } from '../context/AppContext';
import { getProductImage } from '../data/productImages';

interface ProductCardProps {
  product: Product;
  navigate: (path: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, navigate }) => {
  const { format, addToCart } = useApp();
  const [imageError, setImageError] = useState(false);
  const imageUrl = getProductImage(product.slug, product.category);

  const handleCardClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(`/products/${product.slug}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart(product, 1);
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
    <article className="product-card surface-card">
      <a
        className="product-card__thumb"
        aria-label={`View ${product.name}`}
        href={`/products/${product.slug}`}
        onClick={handleCardClick}
        style={{ position: 'relative', overflow: 'hidden', background: '#f8fafc' }}
      >
        <span
          style={{
            position: 'absolute',
            top: '0.6rem',
            left: '0.6rem',
            background: getBrandBadgeColor(product.brand),
            color: '#ffffff',
            padding: '0.2rem 0.55rem',
            borderRadius: '4px',
            fontSize: '0.72rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            zIndex: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
          }}
        >
          {product.brand}
        </span>

        {!imageError ? (
          <img
            src={imageUrl}
            alt={product.name}
            className="product-card__img"
            referrerPolicy="no-referrer"
            loading="lazy"
            onError={() => setImageError(true)}
            style={{
              transition: 'transform 0.25s ease',
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: '0.5rem',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
            }}
          />
        ) : (
          <div className="product-card__thumb-graphic" aria-hidden="true">
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
              {product.sku}
            </span>
          </div>
        )}
      </a>

      <div className="product-card__body">
        <h3 className="product-card__name">
          <a
            href={`/products/${product.slug}`}
            onClick={handleCardClick}
          >
            {product.name}
          </a>
        </h3>

        <div className="product-card__meta">
          <span className="chip">{product.brand}</span>
          <span className="chip">{product.category}</span>
          <span className="chip chip--success">In stock</span>
        </div>

        <div className="product-card__foot">
          <span className="product-card__price mono">
            {format(product.unitPriceMinor)}
          </span>

          <span className="stack atc atc--floating" style={{ gap: '.45rem', width: '100%' }}>
            <button
              type="button"
              className="btn btn--sm"
              onClick={handleAddToCart}
            >
              Add to cart
            </button>
          </span>
        </div>
      </div>
    </article>
  );
};

