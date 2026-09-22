import React from 'react';
import { SERVICES } from '../data/catalog';
import { useApp } from '../context/AppContext';
import { SERVICE_IMAGE_MAP } from '../data/productImages';
import { Clock, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

interface ServicesViewProps {
  navigate: (path: string) => void;
}

export const ServicesView: React.FC<ServicesViewProps> = ({ navigate }) => {
  const { format } = useApp();

  return (
    <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1.5rem 1rem 4rem' }}>
      {/* Services Nav Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            type="button"
            className="btn btn--sm"
            style={{ borderRadius: '999px' }}
          >
            All services
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            style={{ borderRadius: '999px' }}
            onClick={() => navigate('/booking')}
          >
            Start a booking
          </button>
          <button
            type="button"
            className="btn btn--ghost btn--sm"
            style={{ borderRadius: '999px' }}
            onClick={() => navigate('/account/service-requests')}
          >
            My requests
          </button>
        </div>
      </div>

      {/* Services Hero */}
      <section className="service-hero surface-card" style={{ padding: '2.5rem 2rem', marginBottom: '2rem', background: '#ffffff' }}>
        <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.75rem', fontWeight: 800 }}>
          Installation, configuration, support &amp; maintenance
        </h1>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '780px', lineHeight: 1.6 }}>
          Certified CCTV engineers, enterprise network architects, and ISP riggers ready for
          scheduled site installations, diagnostic health checks, and preventive maintenance retainers.
        </p>
      </section>

      {/* Services Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '1.5rem',
        }}
      >
        {SERVICES.map((srv) => {
          const srvImage = SERVICE_IMAGE_MAP[srv.slug];

          return (
            <article
              key={srv.id}
              className="service-card surface-card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: '#ffffff',
                transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                overflow: 'hidden',
              }}
            >
              {srvImage && (
                <div
                  style={{
                    height: '140px',
                    width: '100%',
                    background: '#f1f5f9',
                    overflow: 'hidden',
                    position: 'relative',
                    borderBottom: '1px solid var(--border-subtle)',
                  }}
                >
                  <img
                    src={srvImage}
                    alt={srv.name}
                    referrerPolicy="no-referrer"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      right: 0,
                      height: '40px',
                      background: 'linear-gradient(to top, rgba(0,0,0,0.4), transparent)',
                    }}
                  />
                </div>
              )}

              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.75rem' }}>
                    <span className="chip chip--success" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Calendar size={12} /> Scheduled service
                    </span>
                    <span className="chip" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Clock size={12} /> ~{Math.round(srv.durationMinutes / 60)} h
                    </span>
                  </div>

                  <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 700 }}>
                    {srv.name}
                  </h2>
                  <p style={{ margin: 0, fontSize: '0.9rem', color: '#475569', lineHeight: 1.55 }}>
                    {srv.description}
                  </p>
                </div>

            {/* Deliverables list */}
            {srv.deliverables && (
              <div style={{ marginTop: '0.5rem', marginBottom: '1.5rem', flex: 1 }}>
                <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
                  Included Scope &amp; Deliverables
                </h4>
                <ul style={{ margin: 0, paddingLeft: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                  {srv.deliverables.map((del, i) => (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.82rem', color: '#334155' }}>
                      <CheckCircle2 size={14} color="#16a34a" style={{ marginTop: '0.2rem', flexShrink: 0 }} />
                      <span>{del}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div
              style={{
                marginTop: 'auto',
                borderTop: '1px solid var(--border-subtle)',
                paddingTop: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span className="muted" style={{ fontSize: '0.75rem', display: 'block' }}>Indicative pricing</span>
                <span className="product-card__price mono" style={{ fontSize: '1.25rem', fontWeight: 700 }}>
                  From {format(srv.basePriceMinor)}
                </span>
              </div>

              <button
                type="button"
                className="btn btn--sm"
                onClick={() => navigate(`/booking?service=${srv.slug}`)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}
              >
                <span>Request booking</span>
                <ArrowRight size={14} />
              </button>
            </div>
            </div>
          </article>
        );
      })}
      </div>
    </div>
  );
};
