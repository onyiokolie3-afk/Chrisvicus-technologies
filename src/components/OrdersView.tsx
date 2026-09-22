import React from 'react';
import { useApp } from '../context/AppContext';
import { Package, Truck, CheckCircle2, Clock, ArrowLeft } from 'lucide-react';

interface OrdersViewProps {
  navigate: (path: string) => void;
}

export const OrdersView: React.FC<OrdersViewProps> = ({ navigate }) => {
  const { orders, format } = useApp();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <span className="chip chip--success">Delivered</span>;
      case 'Dispatched':
        return <span className="chip" style={{ background: '#e0e7ff', color: '#3730a3' }}>Dispatched</span>;
      case 'Processing':
        return <span className="chip" style={{ background: '#fef3c7', color: '#92400e' }}>Processing</span>;
      default:
        return <span className="chip">{status}</span>;
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '1.5rem auto 4rem', padding: '0 1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
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

      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: '0 0 0.4rem', fontSize: '1.75rem', fontWeight: 800 }}>
          My Hardware Orders
        </h1>
        <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>
          Track dispatch, view logistics status, and review invoices for your equipment orders.
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="surface-card" style={{ padding: '3rem 1.5rem', textAlign: 'center', background: '#ffffff' }}>
          <Package size={48} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
          <p className="muted" style={{ margin: '0 0 1.25rem', fontSize: '1rem' }}>
            You haven't placed any hardware orders yet.
          </p>
          <button
            type="button"
            className="btn"
            onClick={() => navigate('/products')}
          >
            Browse hardware catalog
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {orders.map((order) => (
            <article
              key={order.id}
              className="surface-card"
              style={{ padding: '1.5rem', background: '#ffffff' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                    <strong className="mono" style={{ fontSize: '1.05rem', color: 'var(--color-primary)' }}>
                      {order.orderNumber}
                    </strong>
                    {getStatusBadge(order.status)}
                  </div>
                  <span className="muted" style={{ fontSize: '0.78rem' }}>
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-NG', { dateStyle: 'medium' })} · Paid via {order.paymentMethod}
                  </span>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="muted" style={{ fontSize: '0.75rem', display: 'block' }}>Total Paid</span>
                  <span className="mono" style={{ fontWeight: 800, fontSize: '1.2rem', color: '#16a34a' }}>
                    {format(order.totalMinor)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
                {order.items.map((item) => (
                  <div
                    key={item.lineId}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      fontSize: '0.88rem',
                      paddingLeft: item.isAddon ? '1.25rem' : '0',
                    }}
                  >
                    <div>
                      <span>{item.isAddon ? '↳ ' : ''}{item.name}</span>
                      {item.sku && (
                        <span className="muted mono" style={{ fontSize: '0.75rem', marginLeft: '0.45rem' }}>
                          [{item.sku}]
                        </span>
                      )}
                      <span className="muted" style={{ marginLeft: '0.5rem' }}>
                        × {item.quantity}
                      </span>
                    </div>

                    <strong className="mono" style={{ fontSize: '0.88rem' }}>
                      {format(item.unitPriceMinor * item.quantity)}
                    </strong>
                  </div>
                ))}
              </div>

              {/* Shipping & Delivery Info */}
              <div
                style={{
                  background: '#f8fafc',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.82rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div>
                  <span className="muted" style={{ display: 'block' }}>Delivery destination:</span>
                  <strong>{order.address.fullName}</strong> — {order.address.addressLine1}, {order.address.city}, {order.address.state}
                </div>

                <div>
                  <span className="muted" style={{ display: 'block' }}>Zone freight:</span>
                  <strong>{order.shippingZone}</strong> ({format(order.shippingMinor)})
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
