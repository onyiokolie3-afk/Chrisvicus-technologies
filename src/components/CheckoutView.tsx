import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { calculateShippingQuote, ShippingAddress } from '../data/catalog';
import { ArrowLeft, CheckCircle2, ShieldCheck, CreditCard, Building2, Smartphone, Lock } from 'lucide-react';

interface CheckoutViewProps {
  navigate: (path: string) => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ navigate }) => {
  const {
    cartLines,
    subtotalMinor,
    hasBulkyItem,
    currency,
    format,
    user,
    placeOrder,
  } = useApp();

  const [address, setAddress] = useState<ShippingAddress>({
    fullName: user?.fullName || 'Onyi Okolie',
    email: user?.email || 'onyiokolie3@gmail.com',
    phone: '+234 803 123 4567',
    country: 'NG',
    state: 'Lagos',
    city: 'Ikeja',
    addressLine1: '12 Allen Avenue',
    notes: '',
  });

  const [quoteCalculated, setQuoteCalculated] = useState(true);
  const [isPaystackModalOpen, setIsPaystackModalOpen] = useState(false);
  const [paystackMethod, setPaystackMethod] = useState<'card' | 'bank' | 'ussd'>('card');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [completedOrderNumber, setCompletedOrderNumber] = useState<string | null>(null);

  // Recalculate quote
  const quote = calculateShippingQuote(address, hasBulkyItem);
  const totalMinor = subtotalMinor + quote.shippingFeeMinor;

  const handlePaystackClick = () => {
    setIsPaystackModalOpen(true);
  };

  const handleCompletePayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsPaystackModalOpen(false);
      const newOrder = placeOrder('Paystack');
      setCompletedOrderNumber(newOrder.orderNumber);
    }, 1200);
  };

  if (completedOrderNumber) {
    return (
      <div style={{ maxWidth: '640px', margin: '2rem auto 4rem', padding: '0 1rem' }}>
        <div className="surface-card" style={{ padding: '2.5rem', textAlign: 'center', background: '#ffffff' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: '#dcfce7',
              color: '#16a34a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1.25rem',
            }}
          >
            <CheckCircle2 size={36} />
          </div>

          <span className="paystack-badge" style={{ marginBottom: '0.75rem' }}>
            Paystack Verified Payment
          </span>

          <h1 style={{ margin: '0.5rem 0', fontSize: '1.75rem', fontWeight: 800 }}>
            Order Confirmed!
          </h1>
          <p className="muted" style={{ margin: '0 0 1.5rem', fontSize: '0.95rem' }}>
            Thank you for your order. Your tracking reference is{' '}
            <strong className="mono" style={{ color: 'var(--color-primary)' }}>
              {completedOrderNumber}
            </strong>
          </p>

          <div
            style={{
              background: '#f8fafc',
              border: '1px solid var(--border-subtle)',
              borderRadius: '0.75rem',
              padding: '1.25rem',
              textAlign: 'left',
              marginBottom: '1.75rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className="muted" style={{ fontSize: '0.85rem' }}>Shipping Zone:</span>
              <strong style={{ fontSize: '0.85rem' }}>{quote.zone}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span className="muted" style={{ fontSize: '0.85rem' }}>Delivery to:</span>
              <span style={{ fontSize: '0.85rem', textAlign: 'right' }}>
                {address.addressLine1}, {address.city}, {address.state}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed var(--border-subtle)', paddingTop: '0.75rem' }}>
              <span style={{ fontWeight: 700 }}>Total Paid:</span>
              <strong className="mono" style={{ fontSize: '1.1rem', color: '#16a34a' }}>
                {format(totalMinor)}
              </strong>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => navigate('/products')}
            >
              Continue shopping
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => navigate('/account/orders')}
            >
              View Order History
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (cartLines.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', padding: '0 1rem', textAlign: 'center' }}>
        <div className="surface-card" style={{ padding: '3rem 1.5rem', background: '#ffffff' }}>
          <span style={{ fontSize: '3.5rem', display: 'block', marginBottom: '1rem' }}>🛒</span>
          <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.4rem', fontWeight: 800 }}>Your cart is empty</h2>
          <p className="muted" style={{ margin: '0 0 1.5rem', fontSize: '0.9rem' }}>
            Add equipment from the catalog to configure shipping and checkout.
          </p>
          <button
            type="button"
            className="btn"
            onClick={() => navigate('/products')}
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '1.5rem auto 4rem', padding: '0 1rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => navigate('/')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', paddingLeft: 0 }}
        >
          <ArrowLeft size={16} />
          <span>Continue shopping</span>
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.25fr) minmax(0, 1fr)', gap: '1.75rem' }}>
        {/* Left: Delivery Address Form */}
        <div className="checkout-panel surface-card" style={{ padding: '1.75rem', background: '#ffffff' }}>
          <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.35rem', fontWeight: 800 }}>
            Delivery address
          </h2>
          <p className="muted" style={{ margin: '0 0 1.25rem', fontSize: '0.85rem' }}>
            Shipping fees and delivery estimates are calculated automatically from your location.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); }} style={{ display: 'flex', flexDirection: 'column', gap: '0.9rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="field">
                <label htmlFor="chk_name">Full Name *</label>
                <input
                  id="chk_name"
                  type="text"
                  required
                  value={address.fullName}
                  onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                />
              </div>

              <div className="field">
                <label htmlFor="chk_phone">Phone Number *</label>
                <input
                  id="chk_phone"
                  type="tel"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="chk_email">Email Address *</label>
              <input
                id="chk_email"
                type="email"
                required
                value={address.email}
                onChange={(e) => setAddress({ ...address, email: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
              <div className="field">
                <label htmlFor="chk_country">Country</label>
                <input
                  id="chk_country"
                  type="text"
                  value={address.country}
                  disabled
                  style={{ background: '#f8fafc' }}
                />
              </div>

              <div className="field">
                <label htmlFor="chk_state">State *</label>
                <select
                  id="chk_state"
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '0.55rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border-subtle)',
                    fontSize: '0.9rem',
                    background: 'var(--color-surface)',
                  }}
                >
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja / FCT">Abuja / FCT</option>
                  <option value="Ogun">Ogun</option>
                  <option value="Oyo">Oyo</option>
                  <option value="Rivers">Rivers</option>
                  <option value="Delta">Delta</option>
                  <option value="Edo">Edo</option>
                  <option value="Anambra">Anambra</option>
                  <option value="Enugu">Enugu</option>
                  <option value="Kaduna">Kaduna</option>
                  <option value="Kano">Kano</option>
                  <option value="Other">Other Nigeria</option>
                </select>
              </div>

              <div className="field">
                <label htmlFor="chk_city">City / District *</label>
                <input
                  id="chk_city"
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="chk_line1">Street Address *</label>
              <input
                id="chk_line1"
                type="text"
                required
                placeholder="House / Plot number and street"
                value={address.addressLine1}
                onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
              />
            </div>

            <div className="field">
              <label htmlFor="chk_notes">Delivery Notes (Optional)</label>
              <input
                id="chk_notes"
                type="text"
                placeholder="Gate code, landmark, or delivery hours"
                value={address.notes}
                onChange={(e) => setAddress({ ...address, notes: e.target.value })}
              />
            </div>

            <div style={{ marginTop: '0.25rem' }}>
              <p className="muted" style={{ margin: 0, fontSize: '.83rem' }}>
                Shipping zone: <strong>{quote.zone}</strong>
                {quote.hasBulky && (
                  <span style={{ color: '#d97706', marginLeft: '0.5rem' }}>
                    (Includes bulky freight handling)
                  </span>
                )}
              </p>
            </div>
          </form>
        </div>

        {/* Right: Server Quote & Paystack */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="checkout-panel surface-card" style={{ padding: '1.75rem', background: '#ffffff' }}>
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.15rem', fontWeight: 800 }}>
              Order Breakdown
            </h3>

            {/* Cart preview */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', marginBottom: '1.25rem', maxHeight: '180px', overflowY: 'auto' }}>
              {cartLines.map((line) => (
                <div key={line.lineId} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
                  <span style={{ color: line.kind === 'service_addon' ? 'var(--text-muted)' : 'inherit' }}>
                    {line.kind === 'service_addon' ? '↳ ' : ''}{line.name} × {line.quantity}
                  </span>
                  <span className="mono" style={{ fontWeight: 600 }}>
                    {format(line.baseUnitMinor * line.quantity)}
                  </span>
                </div>
              ))}
            </div>

            <div className="stack" style={{ gap: '.45rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
              <div className="quote-line" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Subtotal</span>
                <span className="mono">{format(subtotalMinor)}</span>
              </div>

              <div className="quote-line" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Shipping ({quote.zone})</span>
                <span className="mono">{format(quote.shippingFeeMinor)}</span>
              </div>

              <div
                className="quote-line"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontWeight: 800,
                  fontSize: '1.15rem',
                  borderTop: '1px solid var(--border-subtle)',
                  paddingTop: '0.65rem',
                  marginTop: '0.35rem',
                }}
              >
                <span>Total</span>
                <span className="mono" style={{ color: 'var(--color-primary)' }}>
                  {format(totalMinor)}
                </span>
              </div>
            </div>

            {/* Paystack Checkout Button */}
            <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <button
                type="button"
                className="btn btn--block"
                onClick={handlePaystackClick}
                style={{ padding: '0.85rem', fontSize: '1rem', fontWeight: 700 }}
              >
                Pay securely with Paystack
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span className="paystack-badge">
                  Paystack inline · amount locked server-side
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Paystack Modal Dialog Simulation */}
      {isPaystackModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(9, 42, 74, 0.65)',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem',
          }}
        >
          <div
            className="surface-card"
            style={{
              width: '100%',
              maxWidth: '440px',
              background: '#ffffff',
              borderRadius: '1rem',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2)',
            }}
          >
            {/* Paystack Header */}
            <div style={{ background: '#092a4a', color: '#ffffff', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <span style={{ fontSize: '0.75rem', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Paystack Checkout
                </span>
                <h4 style={{ margin: '0.2rem 0 0', fontSize: '1.15rem', color: '#ffffff' }}>
                  Chrisviscus Technologies
                </h4>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '0.75rem', opacity: 0.8 }}>Amount</span>
                <strong className="mono" style={{ display: 'block', fontSize: '1.1rem', color: '#4ade80' }}>
                  {format(totalMinor)}
                </strong>
              </div>
            </div>

            {/* Paystack Body */}
            <div style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <button
                  type="button"
                  onClick={() => setPaystackMethod('card')}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: '0.5rem',
                    border: `1px solid ${paystackMethod === 'card' ? '#092a4a' : 'var(--border-subtle)'}`,
                    background: paystackMethod === 'card' ? '#f0f7ff' : '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer',
                  }}
                >
                  <CreditCard size={14} /> Card
                </button>
                <button
                  type="button"
                  onClick={() => setPaystackMethod('bank')}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: '0.5rem',
                    border: `1px solid ${paystackMethod === 'bank' ? '#092a4a' : 'var(--border-subtle)'}`,
                    background: paystackMethod === 'bank' ? '#f0f7ff' : '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer',
                  }}
                >
                  <Building2 size={14} /> Bank
                </button>
                <button
                  type="button"
                  onClick={() => setPaystackMethod('ussd')}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    borderRadius: '0.5rem',
                    border: `1px solid ${paystackMethod === 'ussd' ? '#092a4a' : 'var(--border-subtle)'}`,
                    background: paystackMethod === 'ussd' ? '#f0f7ff' : '#ffffff',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.35rem',
                    cursor: 'pointer',
                  }}
                >
                  <Smartphone size={14} /> USSD
                </button>
              </div>

              {paystackMethod === 'card' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div className="field">
                    <label style={{ fontSize: '0.78rem' }}>Card Number</label>
                    <input
                      type="text"
                      defaultValue="4084 0000 0000 0000"
                      style={{ fontFamily: 'monospace', letterSpacing: '0.05em' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div className="field">
                      <label style={{ fontSize: '0.78rem' }}>Valid Thru</label>
                      <input type="text" defaultValue="08/29" style={{ fontFamily: 'monospace' }} />
                    </div>
                    <div className="field">
                      <label style={{ fontSize: '0.78rem' }}>CVV</label>
                      <input type="password" defaultValue="123" style={{ fontFamily: 'monospace' }} />
                    </div>
                  </div>
                </div>
              )}

              {paystackMethod === 'bank' && (
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.85rem' }}>
                  <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Pay via Bank Transfer</p>
                  <p style={{ margin: '0 0 0.25rem', color: 'var(--text-muted)' }}>Bank: <strong>Wema Bank (Paystack Demo)</strong></p>
                  <p style={{ margin: '0 0 0.25rem', color: 'var(--text-muted)' }}>Account: <strong className="mono">9920194820</strong></p>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>Beneficiary: <strong>Chrisviscus Technologies</strong></p>
                </div>
              )}

              {paystackMethod === 'ussd' && (
                <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '0.5rem', fontSize: '0.85rem' }}>
                  <p style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>Pay via USSD</p>
                  <p style={{ margin: '0 0 0.5rem', color: 'var(--text-muted)' }}>Dial on your registered phone:</p>
                  <p style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, fontFamily: 'monospace', color: '#092a4a' }}>
                    *737*50*0000*124#
                  </p>
                </div>
              )}

              <div style={{ marginTop: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button
                  type="button"
                  className="btn btn--block"
                  disabled={isProcessingPayment}
                  onClick={handleCompletePayment}
                  style={{
                    background: '#092a4a',
                    color: '#ffffff',
                    padding: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  {isProcessingPayment ? 'Securing transaction…' : `Pay ${format(totalMinor)}`}
                </button>
                <button
                  type="button"
                  className="btn btn--ghost btn--sm"
                  onClick={() => setIsPaystackModalOpen(false)}
                >
                  Cancel
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                <Lock size={12} />
                <span>Secured by 256-bit SSL encryption via Paystack</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
