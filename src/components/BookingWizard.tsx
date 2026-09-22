import React, { useState, useEffect, useMemo } from 'react';
import { SERVICES, ServiceItem } from '../data/catalog';
import { useApp } from '../context/AppContext';
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface BookingWizardProps {
  initialServiceSlug?: string;
  navigate: (path: string) => void;
}

export const BookingWizard: React.FC<BookingWizardProps> = ({
  initialServiceSlug,
  navigate,
}) => {
  const { format, user, openAuthModal, createServiceRequest } = useApp();

  // Wizard Steps: 1: Service, 2: Schedule, 3: Address, 4: Review & Confirm
  const [step, setStep] = useState(1);

  // Selected Service
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(() => {
    if (initialServiceSlug) {
      const match = SERVICES.find((s) => s.slug === initialServiceSlug);
      if (match) return match;
    }
    return SERVICES[0];
  });

  // Calendar State
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    const d = new Date();
    d.setDate(d.getDate() + 2); // default 2 days in future
    return d;
  });
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [timeWindow, setTimeWindow] = useState<'morning' | 'afternoon' | 'fullday'>('morning');

  // Address State
  const [addressLine1, setAddressLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Lagos');
  const [notes, setNotes] = useState('');

  // Confirmation State
  const [createdRequestNumber, setCreatedRequestNumber] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync if initialServiceSlug changes
  useEffect(() => {
    if (initialServiceSlug) {
      const match = SERVICES.find((s) => s.slug === initialServiceSlug);
      if (match) setSelectedService(match);
    }
  }, [initialServiceSlug]);

  // Calendar Helpers
  const daysInMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return new Date(year, month + 1, 0).getDate();
  }, [currentMonth]);

  const firstDayOfMonth = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    return new Date(year, month, 1).getDay();
  }, [currentMonth]);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const isToday = (day: number) => {
    const now = new Date();
    return (
      day === now.getDate() &&
      currentMonth.getMonth() === now.getMonth() &&
      currentMonth.getFullYear() === now.getFullYear()
    );
  };

  const isSelected = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  const isPast = (day: number) => {
    const target = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return target < today;
  };

  const handleSubmitBooking = () => {
    if (!selectedService) return;
    if (!addressLine1.trim() || !city.trim() || !state.trim()) {
      setErrorMsg('Please provide a complete site address.');
      setStep(3);
      return;
    }

    // Build ISO start & end times
    const startHour = timeWindow === 'morning' ? 9 : timeWindow === 'afternoon' ? 13 : 9;
    const endHour = timeWindow === 'morning' ? 13 : timeWindow === 'afternoon' ? 17 : 17;

    const startDate = new Date(selectedDate);
    startDate.setHours(startHour, 0, 0, 0);

    const endDate = new Date(selectedDate);
    endDate.setHours(endHour, 0, 0, 0);

    const req = createServiceRequest({
      serviceId: selectedService.id,
      serviceSlug: selectedService.slug,
      serviceName: selectedService.name,
      basePriceMinor: selectedService.basePriceMinor,
      requestedStartAt: startDate.toISOString(),
      requestedEndAt: endDate.toISOString(),
      siteAddress: {
        addressLine1,
        city,
        state,
      },
      notes: notes.trim() || undefined,
    });

    setCreatedRequestNumber(req.requestNumber);
  };

  if (createdRequestNumber) {
    return (
      <div style={{ maxWidth: '720px', margin: '2rem auto', padding: '1rem' }}>
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
            <CheckCircle size={36} />
          </div>

          <span className="chip chip--success" style={{ fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            Request Submitted
          </span>

          <h1 style={{ margin: '0.5rem 0', fontSize: '1.75rem', fontWeight: 800 }}>
            Booking Request Received
          </h1>

          <p className="muted" style={{ margin: '0 0 1.5rem', fontSize: '0.95rem' }}>
            Your service request reference number is{' '}
            <strong className="mono" style={{ color: 'var(--color-primary)' }}>
              {createdRequestNumber}
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
            <dl className="booking-summary" style={{ margin: 0 }}>
              <dt>Service</dt>
              <dd>{selectedService?.name}</dd>
              <dt>Indicative Quote</dt>
              <dd className="mono">{selectedService ? format(selectedService.basePriceMinor) : '—'}</dd>
              <dt>Scheduled Date</dt>
              <dd>
                {selectedDate.toLocaleDateString('en-NG', {
                  weekday: 'short',
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                ({timeWindow === 'morning' ? '09:00 - 13:00' : timeWindow === 'afternoon' ? '13:00 - 17:00' : 'Full Day 09:00 - 17:00'})
              </dd>
              <dt>Site Location</dt>
              <dd>{addressLine1}, {city}, {state}</dd>
              {notes && (
                <>
                  <dt>Notes</dt>
                  <dd style={{ whiteSpace: 'pre-wrap' }}>{notes}</dd>
                </>
              )}
            </dl>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => {
                setCreatedRequestNumber(null);
                setStep(1);
              }}
            >
              Book another service
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => navigate('/account/service-requests')}
            >
              View in My Requests
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '840px', margin: '1.5rem auto 4rem', padding: '0 1rem' }}>
      {/* Top Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <button
          type="button"
          className="btn btn--ghost btn--sm"
          onClick={() => navigate('/services')}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', paddingLeft: 0 }}
        >
          <ArrowLeft size={16} />
          <span>Back to services list</span>
        </button>

        <span className="muted" style={{ fontSize: '0.82rem' }}>
          Step {step} of 4
        </span>
      </div>

      <div className="surface-card" style={{ padding: '2rem', background: '#ffffff' }}>
        <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.6rem', fontWeight: 800 }}>
          Schedule an Engineering Service
        </h1>
        <p className="muted" style={{ margin: '0 0 1.75rem', fontSize: '0.9rem' }}>
          Select your required scope, pick a preferred schedule window, and provide your site location.
        </p>

        {/* Step Indicator */}
        <div
          style={{
            display: 'flex',
            borderBottom: '1px solid var(--border-subtle)',
            paddingBottom: '1rem',
            marginBottom: '1.75rem',
            gap: '0.5rem',
          }}
        >
          {[
            { num: 1, label: 'Service' },
            { num: 2, label: 'Schedule' },
            { num: 3, label: 'Site Address' },
            { num: 4, label: 'Review' },
          ].map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => setStep(s.num)}
              style={{
                flex: 1,
                border: 'none',
                background: 'transparent',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                cursor: 'pointer',
                opacity: step === s.num ? 1 : step > s.num ? 0.8 : 0.45,
                fontWeight: step === s.num ? 700 : 500,
                fontSize: '0.85rem',
                color: step === s.num ? 'var(--color-primary)' : 'inherit',
              }}
            >
              <span
                style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: step === s.num ? 'var(--color-primary)' : '#e2e8f0',
                  color: step === s.num ? '#ffffff' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.75rem',
                }}
              >
                {s.num}
              </span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>

        {errorMsg && (
          <p className="banner banner--error" role="alert" style={{ marginBottom: '1.25rem' }}>
            {errorMsg}
          </p>
        )}

        {/* STEP 1: SELECT SERVICE */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
              1. Choose a Service Package
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {SERVICES.map((srv) => {
                const isChosen = selectedService?.id === srv.id;
                return (
                  <label
                    key={srv.id}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '1rem',
                      padding: '1.25rem',
                      borderRadius: '0.75rem',
                      border: `2px solid ${isChosen ? '#2563eb' : 'var(--border-subtle)'}`,
                      background: isChosen ? 'rgba(37, 99, 235, 0.03)' : '#ffffff',
                      cursor: 'pointer',
                    }}
                  >
                    <input
                      type="radio"
                      name="service_selection"
                      checked={isChosen}
                      onChange={() => setSelectedService(srv)}
                      style={{ marginTop: '0.25rem', accentColor: '#2563eb' }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '1.05rem' }}>{srv.name}</span>
                        <span className="mono" style={{ fontWeight: 700, color: '#2563eb' }}>
                          From {format(srv.basePriceMinor)}
                        </span>
                      </div>
                      <p style={{ margin: '0.35rem 0 0.5rem', fontSize: '0.88rem', color: '#475569' }}>
                        {srv.description}
                      </p>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <span className="chip" style={{ fontSize: '0.75rem' }}>
                          ~{Math.round(srv.durationMinutes / 60)} hours duration
                        </span>
                      </div>
                    </div>
                  </label>
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setErrorMsg(null);
                  setStep(2);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <span>Continue to Schedule</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: SELECT DATE & TIME WINDOW */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
              2. Select Preferred Date &amp; Time Window
            </h3>

            {/* Calendar */}
            <div
              style={{
                border: '1px solid var(--border-subtle)',
                borderRadius: '0.75rem',
                padding: '1.25rem',
                background: '#fafafa',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <strong style={{ fontSize: '1rem' }}>
                  {currentMonth.toLocaleDateString('en-NG', { month: 'long', year: 'numeric' })}
                </strong>
                <div style={{ display: 'flex', gap: '0.25rem' }}>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={handlePrevMonth}
                    aria-label="Previous month"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    className="icon-btn"
                    onClick={handleNextMonth}
                    aria-label="Next month"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>

              {/* Day header */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', textAlign: 'center', fontWeight: 600, fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                  <div key={d} style={{ padding: '0.25rem 0' }}>{d}</div>
                ))}
              </div>

              {/* Day cells */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const past = isPast(day);
                  const selected = isSelected(day);
                  const today = isToday(day);

                  return (
                    <button
                      key={day}
                      type="button"
                      disabled={past}
                      onClick={() => {
                        const next = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
                        setSelectedDate(next);
                      }}
                      style={{
                        height: '38px',
                        borderRadius: '0.4rem',
                        border: selected ? '2px solid #2563eb' : today ? '1px solid #93c5fd' : '1px solid transparent',
                        background: selected ? '#2563eb' : '#ffffff',
                        color: selected ? '#ffffff' : past ? '#cbd5e1' : 'inherit',
                        cursor: past ? 'not-allowed' : 'pointer',
                        fontWeight: selected || today ? 700 : 500,
                        fontSize: '0.85rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Time window selection */}
            <div>
              <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.6rem' }}>
                Arrival Time Window
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
                {[
                  { id: 'morning', label: 'Morning Window', time: '09:00 - 13:00' },
                  { id: 'afternoon', label: 'Afternoon Window', time: '13:00 - 17:00' },
                  { id: 'fullday', label: 'Full Day Inspection', time: '09:00 - 17:00' },
                ].map((w) => {
                  const isCur = timeWindow === w.id;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setTimeWindow(w.id as any)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '0.5rem',
                        border: `2px solid ${isCur ? '#2563eb' : 'var(--border-subtle)'}`,
                        background: isCur ? 'rgba(37, 99, 235, 0.05)' : '#ffffff',
                        textAlign: 'left',
                        cursor: 'pointer',
                      }}
                    >
                      <strong style={{ display: 'block', fontSize: '0.85rem' }}>{w.label}</strong>
                      <span className="muted" style={{ fontSize: '0.78rem' }}>{w.time}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setStep(1)}
              >
                Back
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  setErrorMsg(null);
                  setStep(3);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <span>Continue to Site Location</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: SITE ADDRESS & SCOPE NOTES */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
              3. Site Location &amp; Scope Requirements
            </h3>

            <div className="field">
              <label htmlFor="addr1">Street Address / Facility Location *</label>
              <input
                id="addr1"
                type="text"
                placeholder="e.g. Plot 14, Commercial Avenue, Ikeja"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="field">
                <label htmlFor="city">City / District *</label>
                <input
                  id="city"
                  type="text"
                  placeholder="e.g. Ikeja, Lekki, Garki"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                />
              </div>

              <div className="field">
                <label htmlFor="state">State *</label>
                <select
                  id="state"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
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
                  <option value="Rivers">Rivers</option>
                  <option value="Ogun">Ogun</option>
                  <option value="Oyo">Oyo</option>
                  <option value="Delta">Delta</option>
                  <option value="Edo">Edo</option>
                  <option value="Anambra">Anambra</option>
                  <option value="Enugu">Enugu</option>
                  <option value="Kaduna">Kaduna</option>
                  <option value="Kano">Kano</option>
                  <option value="Other">Other State</option>
                </select>
              </div>
            </div>

            <div className="field">
              <label htmlFor="notes">Site Notes / Equipment on Site</label>
              <textarea
                id="notes"
                rows={3}
                placeholder="Number of cameras, cable lengths, rack location, access permissions, etc."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.55rem',
                  borderRadius: '0.5rem',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setStep(2)}
              >
                Back
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  if (!addressLine1.trim() || !city.trim()) {
                    setErrorMsg('Please fill in both the street address and city.');
                    return;
                  }
                  setErrorMsg(null);
                  setStep(4);
                }}
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <span>Review &amp; Submit</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* STEP 4: REVIEW & CONFIRM */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
              4. Review Booking Details
            </h3>

            <div
              style={{
                background: '#fafafa',
                border: '1px solid var(--border-subtle)',
                borderRadius: '0.75rem',
                padding: '1.25rem',
              }}
            >
              <dl className="booking-summary" style={{ margin: 0 }}>
                <dt>Service</dt>
                <dd style={{ fontWeight: 600 }}>{selectedService?.name}</dd>

                <dt>Indicative Price</dt>
                <dd className="mono" style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                  {selectedService ? `${format(selectedService.basePriceMinor)} (final quote confirmed by staff)` : '—'}
                </dd>

                <dt>Time Window</dt>
                <dd>
                  {selectedDate.toLocaleDateString('en-NG', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}{' '}
                  ·{' '}
                  {timeWindow === 'morning'
                    ? '09:00 - 13:00'
                    : timeWindow === 'afternoon'
                    ? '13:00 - 17:00'
                    : 'Full Day 09:00 - 17:00'}
                </dd>

                <dt>Site Address</dt>
                <dd>
                  {addressLine1}, {city}, {state}
                </dd>

                {notes && (
                  <>
                    <dt>Site Notes</dt>
                    <dd style={{ whiteSpace: 'pre-wrap' }}>{notes}</dd>
                  </>
                )}
              </dl>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
              <button
                type="button"
                className="btn btn--secondary"
                onClick={() => setStep(3)}
              >
                Back
              </button>
              <button
                type="button"
                className="btn"
                onClick={handleSubmitBooking}
                style={{ padding: '0.75rem 1.5rem', fontWeight: 700 }}
              >
                Confirm &amp; Submit Booking Request
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
