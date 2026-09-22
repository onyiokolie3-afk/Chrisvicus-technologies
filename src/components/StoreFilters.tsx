import React, { useState } from 'react';

export interface FilterState {
  category: string;
  usages: string[];
  inStockOnly: boolean;
  brand: string;
  minPrice: string;
  maxPrice: string;
  searchQuery: string;
}

interface StoreFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  totalFiltered: number;
}

const CATEGORIES = [
  { id: '', label: 'All Categories' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'cameras', label: 'Cameras' },
  { id: 'networking', label: 'Networking' },
  { id: 'recorders', label: 'Recorders' },
  { id: 'wireless', label: 'Wireless' },
];

const USAGES = [
  { id: 'cctv', label: 'Cctv' },
  { id: 'core', label: 'Core' },
  { id: 'enterprise', label: 'Enterprise' },
  { id: 'isp', label: 'Isp' },
  { id: 'outdoor', label: 'Outdoor' },
  { id: 'poe', label: 'Poe' },
  { id: 'smb', label: 'Smb' },
  { id: 'storage', label: 'Storage' },
  { id: 'wifi', label: 'Wifi' },
  { id: 'wireless-backhaul', label: 'Wireless Backhaul' },
];

const BRANDS = [
  { id: '', label: 'All Brands' },
  { id: 'Hikvision', label: 'Hikvision' },
  { id: 'Dahua', label: 'Dahua' },
  { id: 'Cisco', label: 'Cisco' },
  { id: 'MikroTik', label: 'MikroTik' },
  { id: 'Ubiquiti', label: 'Ubiquiti' },
  { id: 'Dintek', label: 'Dintek' },
  { id: 'Cambium', label: 'Cambium' },
];

export const StoreFilters: React.FC<StoreFiltersProps> = ({
  filters,
  setFilters,
  mobileOpen,
  onCloseMobile,
  totalFiltered,
}) => {
  // Accordion collapsed states (all open by default)
  const [openSections, setOpenSections] = useState({
    category: true,
    usage: true,
    availability: true,
    brand: true,
    price: true,
  });

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleCategoryChange = (cat: string) => {
    setFilters((prev) => ({ ...prev, category: cat }));
  };

  const handleUsageToggle = (usageId: string) => {
    setFilters((prev) => {
      const exists = prev.usages.includes(usageId);
      return {
        ...prev,
        usages: exists
          ? prev.usages.filter((u) => u !== usageId)
          : [...prev.usages, usageId],
      };
    });
  };

  const handleBrandChange = (brand: string) => {
    setFilters((prev) => ({ ...prev, brand }));
  };

  const handleClearAll = () => {
    setFilters({
      category: '',
      usages: [],
      inStockOnly: false,
      brand: '',
      minPrice: '',
      maxPrice: '',
      searchQuery: '',
    });
  };

  return (
    <>
      {/* Mobile Scrim */}
      <div
        className="filter-sheet__scrim"
        data-open={mobileOpen}
        aria-hidden={!mobileOpen}
        onClick={onCloseMobile}
        style={{ display: mobileOpen ? 'block' : 'none' }}
      />

      <aside
        className="sidebar surface-card sidebar__panel"
        id="store-filters"
        data-open={mobileOpen}
        aria-label="Store filters"
      >
        <div className="filter-sheet__bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.15rem' }}>Filter</h2>
            <span className="chip" style={{ fontSize: '0.75rem' }}>
              {totalFiltered} results
            </span>
          </div>
          <button
            type="button"
            className="icon-btn"
            aria-label="Close filters"
            onClick={onCloseMobile}
          >
            <span aria-hidden="true">✕</span>
          </button>
        </div>

        <div className="filter-sheet__body" id="filter-sheet-body">
          {/* Search Input */}
          <div style={{ padding: '0.25rem 0 0.75rem' }}>
            <input
              type="text"
              placeholder="Search equipment or SKU…"
              value={filters.searchQuery}
              onChange={(e) => setFilters((prev) => ({ ...prev, searchQuery: e.target.value }))}
              style={{
                width: '100%',
                padding: '0.45rem 0.65rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-subtle)',
                fontSize: '0.85rem',
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
              }}
            />
          </div>

          {/* Category Filter */}
          <section className="filter-card">
            <h3>
              <button
                type="button"
                id="filter-category-button"
                aria-expanded={openSections.category}
                onClick={() => toggleSection('category')}
              >
                <span className="filter-card__title">Category</span>
                <span
                  aria-hidden="true"
                  className={`sidebar__glyph ${openSections.category ? 'sidebar__glyph--open' : ''}`}
                >
                  ›
                </span>
              </button>
            </h3>
            {openSections.category && (
              <div id="filter-category-panel" className="filter-card__panel">
                <div className="sidebar__filters">
                  {CATEGORIES.map((cat) => (
                    <label key={cat.id || 'all'}>
                      <input
                        type="radio"
                        name="category"
                        checked={filters.category === cat.id}
                        onChange={() => handleCategoryChange(cat.id)}
                      />
                      <span>{cat.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Product Usage Filter */}
          <section className="filter-card">
            <h3>
              <button
                type="button"
                id="filter-usage-button"
                aria-expanded={openSections.usage}
                onClick={() => toggleSection('usage')}
              >
                <span className="filter-card__title">Product Usage</span>
                <span
                  aria-hidden="true"
                  className={`sidebar__glyph ${openSections.usage ? 'sidebar__glyph--open' : ''}`}
                >
                  ›
                </span>
              </button>
            </h3>
            {openSections.usage && (
              <div id="filter-usage-panel" className="filter-card__panel">
                <div className="sidebar__filters">
                  {USAGES.map((usage) => (
                    <label key={usage.id}>
                      <input
                        type="checkbox"
                        name={`usage-${usage.id}`}
                        checked={filters.usages.includes(usage.id)}
                        onChange={() => handleUsageToggle(usage.id)}
                      />
                      <span>{usage.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Availability Filter */}
          <section className="filter-card">
            <h3>
              <button
                type="button"
                id="filter-availability-button"
                aria-expanded={openSections.availability}
                onClick={() => toggleSection('availability')}
              >
                <span className="filter-card__title">Availability</span>
                <span
                  aria-hidden="true"
                  className={`sidebar__glyph ${openSections.availability ? 'sidebar__glyph--open' : ''}`}
                >
                  ›
                </span>
              </button>
            </h3>
            {openSections.availability && (
              <div id="filter-availability-panel" className="filter-card__panel">
                <div className="sidebar__filters">
                  <label>
                    <input
                      type="checkbox"
                      checked={filters.inStockOnly}
                      onChange={(e) =>
                        setFilters((prev) => ({ ...prev, inStockOnly: e.target.checked }))
                      }
                    />
                    <span>In stock only</span>
                  </label>
                </div>
              </div>
            )}
          </section>

          {/* Supported Brands Filter */}
          <section className="filter-card">
            <h3>
              <button
                type="button"
                id="filter-brands-button"
                aria-expanded={openSections.brand}
                onClick={() => toggleSection('brand')}
              >
                <span className="filter-card__title">Supported Brands</span>
                <span
                  aria-hidden="true"
                  className={`sidebar__glyph ${openSections.brand ? 'sidebar__glyph--open' : ''}`}
                >
                  ›
                </span>
              </button>
            </h3>
            {openSections.brand && (
              <div id="filter-brands-panel" className="filter-card__panel">
                <div className="sidebar__filters">
                  {BRANDS.map((b) => (
                    <label key={b.id || 'all'}>
                      <input
                        type="radio"
                        name="brand"
                        checked={filters.brand === b.id}
                        onChange={() => handleBrandChange(b.id)}
                      />
                      <span>{b.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* Price Range Filter */}
          <section className="filter-card">
            <h3>
              <button
                type="button"
                id="filter-price-button"
                aria-expanded={openSections.price}
                onClick={() => toggleSection('price')}
              >
                <span className="filter-card__title">Price Range (NGN)</span>
                <span
                  aria-hidden="true"
                  className={`sidebar__glyph ${openSections.price ? 'sidebar__glyph--open' : ''}`}
                >
                  ›
                </span>
              </button>
            </h3>
            {openSections.price && (
              <div id="filter-price-panel" className="filter-card__panel">
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginTop: '0.35rem' }}>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                      Min (₦)
                    </label>
                    <input
                      type="number"
                      placeholder="0"
                      value={filters.minPrice}
                      onChange={(e) => setFilters((prev) => ({ ...prev, minPrice: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.35rem 0.5rem',
                        borderRadius: '0.4rem',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.8rem',
                        background: 'var(--color-surface)',
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '0.2rem' }}>
                      Max (₦)
                    </label>
                    <input
                      type="number"
                      placeholder="5,000,000"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters((prev) => ({ ...prev, maxPrice: e.target.value }))}
                      style={{
                        width: '100%',
                        padding: '0.35rem 0.5rem',
                        borderRadius: '0.4rem',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.8rem',
                        background: 'var(--color-surface)',
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </section>

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              className="btn btn--secondary btn--sm"
              style={{ flex: 1 }}
              onClick={handleClearAll}
            >
              Clear all
            </button>
            <button
              type="button"
              className="btn btn--sm"
              style={{ flex: 1 }}
              onClick={onCloseMobile}
            >
              Apply
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
