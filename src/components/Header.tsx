import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CurrencyCode } from '../data/catalog';
import { ShoppingCart, Menu, X, User, LogOut, Package, CalendarCheck, ShieldCheck } from 'lucide-react';

interface HeaderProps {
  currentPath: string;
  navigate: (path: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentPath, navigate }) => {
  const {
    currency,
    setCurrency,
    totalCartItems,
    openCart,
    user,
    logout,
    openAuthModal,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const isStoreActive = currentPath === '/' || currentPath.startsWith('/products');
  const isServicesActive =
    currentPath.startsWith('/services') ||
    currentPath.startsWith('/booking') ||
    currentPath.startsWith('/account/service-requests');

  const handleModeChange = (mode: 'store' | 'services') => {
    if (mode === 'store') {
      navigate('/');
    } else {
      navigate('/services');
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="site-header">
      <div className="site-header__inner">
        {/* Brand Logo */}
        <a
          className="brand-logo"
          aria-label="Chrisviscus Technologies — home"
          href="/"
          onClick={(e) => {
            e.preventDefault();
            navigate('/');
          }}
        >
          <img
            alt="Chrisviscus Technologies"
            width="1106"
            height="167"
            src="/logo-header.png"
            style={{ color: 'transparent', height: '36px', width: 'auto' }}
          />
        </a>

        {/* Store / Service Mode Switch */}
        <span className="site-header__modeswitch">
          <div className="mode-switch" role="group" aria-label="Application mode">
            <button
              type="button"
              aria-pressed={isStoreActive}
              onClick={() => handleModeChange('store')}
            >
              Store
            </button>
            <button
              type="button"
              aria-pressed={isServicesActive}
              onClick={() => handleModeChange('services')}
            >
              Book a service
            </button>
          </div>
        </span>

        <span className="site-header__spacer" />

        {/* Desktop Controls */}
        <div className="site-header__desktop">
          {/* Currency Selector */}
          <label className="row" style={{ gap: '.35rem', alignItems: 'center' }}>
            <span className="visually-hidden">Display currency</span>
            <select
              aria-label="Display currency"
              value={currency}
              onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
              style={{
                border: '1px solid var(--border-subtle)',
                borderRadius: '.5rem',
                padding: '.35rem .6rem',
                font: 'inherit',
                fontSize: '.85rem',
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                cursor: 'pointer',
              }}
            >
              <option value="NGN">NGN (₦)</option>
              <option value="USD">USD ($)</option>
              <option value="GBP">GBP (£)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </label>

          {/* Cart Trigger */}
          <button
            type="button"
            className="btn btn--secondary btn--sm cart-trigger"
            aria-label={`Open cart — ${totalCartItems} items`}
            onClick={openCart}
            style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.45rem' }}
          >
            <span aria-hidden="true">🛒</span>
            <span>Cart</span>
            {totalCartItems > 0 && (
              <span className="cart-badge-count">{totalCartItems}</span>
            )}
          </button>

          {/* User Profile / Auth */}
          {user ? (
            <div style={{ position: 'relative' }}>
              <button
                type="button"
                className="usermenu-pill"
                onClick={() => setUserDropdownOpen((v) => !v)}
                aria-expanded={userDropdownOpen}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.35rem 0.75rem',
                  borderRadius: '999px',
                  border: '1px solid var(--border-subtle)',
                  background: 'var(--color-surface)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                }}
              >
                <span
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: '#2563eb',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                  }}
                >
                  {user.fullName.charAt(0).toUpperCase()}
                </span>
                <span style={{ maxWidth: '110px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {user.fullName}
                </span>
              </button>

              {userDropdownOpen && (
                <>
                  <div
                    style={{ position: 'fixed', inset: 0, zIndex: 45 }}
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div
                    className="surface-card"
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      width: '220px',
                      background: 'var(--color-surface)',
                      boxShadow: 'var(--shadow-card)',
                      padding: '0.5rem',
                      zIndex: 50,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem',
                    }}
                  >
                    <div style={{ padding: '0.5rem', borderBottom: '1px solid var(--border-subtle)', marginBottom: '0.25rem' }}>
                      <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem' }}>{user.fullName}</p>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</p>
                    </div>

                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      style={{ justifyContent: 'flex-start', gap: '0.5rem', width: '100%' }}
                      onClick={() => {
                        navigate('/account/orders');
                        setUserDropdownOpen(false);
                      }}
                    >
                      <Package size={15} />
                      <span>My Orders</span>
                    </button>

                    <button
                      type="button"
                      className="btn btn--ghost btn--sm"
                      style={{ justifyContent: 'flex-start', gap: '0.5rem', width: '100%' }}
                      onClick={() => {
                        navigate('/account/service-requests');
                        setUserDropdownOpen(false);
                      }}
                    >
                      <CalendarCheck size={15} />
                      <span>My Service Requests</span>
                    </button>

                    <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '0.25rem', paddingTop: '0.25rem' }}>
                      <button
                        type="button"
                        className="btn btn--ghost btn--sm"
                        style={{ justifyContent: 'flex-start', gap: '0.5rem', width: '100%', color: 'var(--color-warning)' }}
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                      >
                        <LogOut size={15} />
                        <span>Sign out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <button
                type="button"
                className="btn btn--ghost btn--sm"
                onClick={openAuthModal}
              >
                Sign in
              </button>
              <button
                type="button"
                className="btn btn--sm"
                onClick={openAuthModal}
              >
                Create account
              </button>
            </div>
          )}
        </div>

        {/* Mobile Actions */}
        <span className="site-header__mobile-actions">
          <button
            type="button"
            className="icon-btn cart-trigger"
            aria-label={`Open cart — ${totalCartItems} items`}
            onClick={openCart}
            style={{ position: 'relative' }}
          >
            <span aria-hidden="true">🛒</span>
            {totalCartItems > 0 && (
              <span className="cart-badge-count">{totalCartItems}</span>
            )}
          </button>

          <button
            type="button"
            className="icon-btn site-header__burger"
            aria-label="Toggle navigation menu"
            onClick={() => setMobileMenuOpen((v) => !v)}
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </span>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <>
            <div
              style={{ position: 'fixed', inset: 0, top: 'var(--header-height)', background: 'rgba(0,0,0,0.4)', zIndex: 35 }}
              onClick={() => setMobileMenuOpen(false)}
            />
            <nav className="mobile-nav" id="mobile-nav-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.25rem' }}>
              <div className="mode-switch" style={{ width: '100%' }}>
                <button
                  type="button"
                  aria-pressed={isStoreActive}
                  onClick={() => handleModeChange('store')}
                  style={{ flex: 1 }}
                >
                  Store
                </button>
                <button
                  type="button"
                  aria-pressed={isServicesActive}
                  onClick={() => handleModeChange('services')}
                  style={{ flex: 1 }}
                >
                  Book a service
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>Currency</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
                  style={{
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '.5rem',
                    padding: '.3rem .6rem',
                    font: 'inherit',
                    fontSize: '.85rem',
                    background: 'var(--color-surface)',
                  }}
                >
                  <option value="NGN">NGN (₦)</option>
                  <option value="USD">USD ($)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="EUR">EUR (€)</option>
                </select>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  style={{ justifyContent: 'flex-start' }}
                  onClick={() => {
                    navigate('/account/orders');
                    setMobileMenuOpen(false);
                  }}
                >
                  <Package size={16} />
                  <span>My Orders</span>
                </button>
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  style={{ justifyContent: 'flex-start' }}
                  onClick={() => {
                    navigate('/account/service-requests');
                    setMobileMenuOpen(false);
                  }}
                >
                  <CalendarCheck size={16} />
                  <span>My Service Requests</span>
                </button>
                <button
                  type="button"
                  className="btn btn--secondary btn--sm"
                  style={{ justifyContent: 'flex-start' }}
                  onClick={() => {
                    navigate('/booking');
                    setMobileMenuOpen(false);
                  }}
                >
                  <ShieldCheck size={16} />
                  <span>Book an Engineer</span>
                </button>
              </div>

              {user ? (
                <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem' }}>{user.fullName}</p>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</p>
                  </div>
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign out
                  </button>
                </div>
              ) : (
                <div style={{ marginTop: 'auto', display: 'flex', gap: '0.5rem' }}>
                  <button
                    type="button"
                    className="btn btn--secondary btn--sm"
                    style={{ flex: 1 }}
                    onClick={() => {
                      openAuthModal();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Sign in
                  </button>
                  <button
                    type="button"
                    className="btn btn--sm"
                    style={{ flex: 1 }}
                    onClick={() => {
                      openAuthModal();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Create account
                  </button>
                </div>
              )}
            </nav>
          </>
        )}
      </div>
    </header>
  );
};
