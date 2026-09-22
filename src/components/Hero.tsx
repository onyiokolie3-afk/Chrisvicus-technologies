import React from 'react';

interface HeroProps {
  navigate: (path: string) => void;
}

export const Hero: React.FC<HeroProps> = ({ navigate }) => {
  return (
    <section className="hero surface-card">
      <div className="hero__copy">
        <h1>Security &amp; networking hardware, installed right.</h1>
        <p>
          Hikvision, Dahua, Cisco, MikroTik, Ubiquiti, Dintek, and Cambium equipment for homes, SMEs,
          and ISPs across Nigeria — with optional commissioning add-ons at checkout and full installation
          services you can book separately.
        </p>
        <div className="row hero__cta" style={{ gap: '0.75rem', marginTop: '1.25rem' }}>
          <button
            type="button"
            className="btn"
            onClick={() => {
              const el = document.getElementById('catalog-grid');
              if (el) {
                el.scrollIntoView({ behavior: 'smooth' });
              } else {
                navigate('/products');
              }
            }}
          >
            Shop the catalog
          </button>
          <button
            type="button"
            className="btn btn--secondary"
            onClick={() => navigate('/services')}
          >
            Book an engineer
          </button>
        </div>
      </div>
      <div className="hero__logo" style={{ flex: '0 1 340px' }}>
        <img
          alt="Chrisviscus Technologies"
          width="1309"
          height="800"
          style={{ color: 'transparent', maxWidth: '100%', height: 'auto', display: 'block' }}
          src="/logo.png"
        />
      </div>
    </section>
  );
};
