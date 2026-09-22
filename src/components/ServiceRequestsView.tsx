import React from 'react';
import { useApp } from '../context/AppContext';
import { Calendar, Clock, MapPin, AlertCircle, PlusCircle, ArrowLeft } from 'lucide-react';

interface ServiceRequestsViewProps {
  navigate: (path: string) => void;
}

export const ServiceRequestsView: React.FC<ServiceRequestsViewProps> = ({ navigate }) => {
  const { serviceRequests, cancelServiceRequest, format } = useApp();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Confirmed':
        return <span className="chip chip--success">Confirmed</span>;
      case 'Submitted':
        return <span className="chip" style={{ background: '#dbeafe', color: '#1e40af' }}>Submitted</span>;
      case 'Under Review':
        return <span className="chip" style={{ background: '#fef3c7', color: '#92400e' }}>Under Review</span>;
      case 'Completed':
        return <span className="chip chip--success">Completed</span>;
      case 'Cancelled':
        return <span className="chip chip--danger">Cancelled</span>;
      default:
        return <span className="chip">{status}</span>;
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '1.5rem auto 4rem', padding: '0 1rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => navigate('/services')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', paddingLeft: 0 }}
        >
          <ArrowLeft size={16} />
          <span>Back to services</span>
        </button>

        <button
          type="button"
          className="btn btn--sm"
          onClick={() => navigate('/booking')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <PlusCircle size={15} />
          <span>New Service Request</span>
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ margin: '0 0 0.4rem', fontSize: '1.75rem', fontWeight: 800 }}>
          My Service Requests
        </h1>
        <p className="muted" style={{ margin: 0, fontSize: '0.9rem' }}>
          Track the status of scheduled engineer site visits, audits, and maintenance dispatches.
        </p>
      </div>

      {serviceRequests.length === 0 ? (
        <div className="surface-card" style={{ padding: '3rem 1.5rem', textAlign: 'center', background: '#ffffff' }}>
          <p className="muted" style={{ margin: '0 0 1.25rem', fontSize: '1rem' }}>
            You haven't submitted any service requests yet.
          </p>
          <button
            type="button"
            className="btn"
            onClick={() => navigate('/booking')}
          >
            Schedule a service visit
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {serviceRequests.map((req) => (
            <article
              key={req.id}
              className="surface-card"
              style={{ padding: '1.5rem', background: '#ffffff' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                    <strong className="mono" style={{ fontSize: '1rem', color: 'var(--color-primary)' }}>
                      {req.requestNumber}
                    </strong>
                    {getStatusBadge(req.status)}
                  </div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700 }}>
                    {req.serviceName}
                  </h3>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <span className="muted" style={{ fontSize: '0.75rem', display: 'block' }}>Indicative quote</span>
                  <span className="mono" style={{ fontWeight: 700, fontSize: '1.05rem' }}>
                    {format(req.indicativePriceMinor)}
                  </span>
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                  gap: '0.75rem',
                  padding: '0.75rem 0',
                  borderTop: '1px solid var(--border-subtle)',
                  borderBottom: '1px solid var(--border-subtle)',
                  margin: '0.75rem 0',
                  fontSize: '0.85rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                  <Calendar size={16} color="var(--text-muted)" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                  <div>
                    <span className="muted" style={{ display: 'block', fontSize: '0.75rem' }}>Time window</span>
                    <span>
                      {new Date(req.requestedStartAt).toLocaleDateString('en-NG', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}{' '}
                      ({new Date(req.requestedStartAt).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })} - {new Date(req.requestedEndAt).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' })})
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem' }}>
                  <MapPin size={16} color="var(--text-muted)" style={{ marginTop: '0.15rem', flexShrink: 0 }} />
                  <div>
                    <span className="muted" style={{ display: 'block', fontSize: '0.75rem' }}>Site location</span>
                    <span>{req.siteAddress.addressLine1}, {req.siteAddress.city}, {req.siteAddress.state}</span>
                  </div>
                </div>
              </div>

              {req.notes && (
                <p style={{ margin: '0.5rem 0 0.75rem', fontSize: '0.83rem', color: '#475569', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '0.4rem' }}>
                  <strong>Scope Notes:</strong> {req.notes}
                </p>
              )}

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
                <span className="muted" style={{ fontSize: '0.75rem' }}>
                  Submitted on {new Date(req.createdAt).toLocaleDateString('en-NG', { dateStyle: 'medium' })}
                </span>

                {req.status === 'Submitted' && (
                  <button
                    type="button"
                    className="btn btn--ghost btn--sm"
                    style={{ color: 'var(--color-warning)' }}
                    onClick={() => cancelServiceRequest(req.id)}
                  >
                    Cancel request
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};
