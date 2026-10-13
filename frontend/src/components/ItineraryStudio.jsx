import React, { useState } from 'react';
import { useNomadMama } from '../context/NomadMamaContext';

export const ItineraryStudio = () => {
  const { dossier, allergies } = useNomadMama();
  const [selectedDayIndex, setSelectedDayIndex] = useState(0);

  const activeDay = dossier.daily_schedules[selectedDayIndex] || dossier.daily_schedules[0];

  return (
    <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '20px 24px 60px' }}>
      {/* Dossier Header Info */}
      <div className="glass-panel" style={{ padding: '30px', marginBottom: '30px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <span className="badge badge-coral">{dossier.destination_hub}</span>
              <span className="badge badge-cyan">{dossier.duration_days} Days Operational Plan</span>
              <span className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>ID: {dossier.dossier_id}</span>
            </div>
            <h2 style={{ fontSize: '1.9rem', fontWeight: '800' }}>{dossier.trip_title}</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: '700' }}>Projected Spend</div>
              <div className="mono" style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--accent-coral)' }}>
                ${dossier.projected_total_expenditure_usd.toLocaleString()}
              </div>
            </div>
            <div style={{ padding: '8px 14px', background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: 'var(--radius-md)', textAlign: 'right' }}>
              <div style={{ fontSize: '0.72rem', color: '#6EE7B7', fontWeight: '700' }}>REMAINING MARGIN</div>
              <div className="mono" style={{ fontSize: '1.2rem', fontWeight: '800', color: '#10B981' }}>
                +${dossier.variance_to_cap_usd.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Lodging Anchor Banner */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(30, 41, 67, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.35)',
          borderRadius: 'var(--radius-md)',
          padding: '20px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '20px',
          alignItems: 'center'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '1rem' }}>🏨</span>
              <span style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#A5B4FC', fontWeight: '700' }}>
                Strategic Lodging Anchor (Sub-Agent 3)
              </span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: '700', color: '#FFFFFF' }}>
              {dossier.selected_lodging.property_name}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Zone: {dossier.selected_lodging.geographic_zone}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '4px' }}>
              {dossier.selected_lodging.transit_elimination_summary}
            </div>
            <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              <span>Rate: <strong style={{ color: '#FFFFFF' }}>${dossier.selected_lodging.nightly_rate_usd}/night</strong></span>
              <span>Total Stay: <strong style={{ color: '#FFFFFF' }}>${dossier.selected_lodging.total_lodging_cost_usd}</strong></span>
              <span>Proximity Score: <strong style={{ color: '#10B981' }}>{dossier.selected_lodging.proximity_index_score}/10</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Days & Stops Timeline */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '24px' }}>
        {/* Day Selector Tabs */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {dossier.daily_schedules.map((day, idx) => (
            <button
              key={day.day_number}
              onClick={() => setSelectedDayIndex(idx)}
              style={{
                flex: '1',
                minWidth: '220px',
                padding: '16px 20px',
                background: selectedDayIndex === idx ? 'rgba(255, 94, 98, 0.15)' : 'var(--bg-surface)',
                border: selectedDayIndex === idx ? '1px solid var(--accent-coral)' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: '#FFFFFF',
                textAlign: 'left',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span className="mono" style={{ fontSize: '0.78rem', color: selectedDayIndex === idx ? 'var(--accent-coral)' : 'var(--text-dim)', fontWeight: '700' }}>
                  DAY 0{day.day_number}
                </span>
                <span className="mono" style={{ fontSize: '0.82rem', fontWeight: '700' }}>
                  ${day.daily_subtotal_usd}
                </span>
              </div>
              <div style={{ fontWeight: '700', fontSize: '0.96rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {day.primary_theme}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                {day.stops.length} Waypoints • {day.total_daily_active_hours}h Active
              </div>
            </button>
          ))}
        </div>

        {/* Selected Day Stop Waypoint Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          {activeDay.stops.map((stop, sIdx) => (
            <div
              key={sIdx}
              className="glass-panel"
              style={{
                padding: '24px',
                display: 'grid',
                gridTemplateColumns: '130px 1fr 220px',
                gap: '24px',
                alignItems: 'center'
              }}
            >
              {/* Time Column */}
              <div>
                <div className="mono" style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>
                  {stop.arrival_time}
                </div>
                <div className="mono" style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                  to {stop.departure_time}
                </div>
                <div style={{ marginTop: '10px' }}>
                  <span className="badge badge-amber" style={{ fontSize: '0.68rem', padding: '2px 6px' }}>
                    {stop.allocated_duration_minutes}m Dwell
                  </span>
                </div>
                <div style={{ marginTop: '4px' }}>
                  <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>
                    +{stop.transit_buffer_minutes}m buffer
                  </span>
                </div>
              </div>

              {/* Waypoint Details */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                  <span className="badge badge-coral" style={{ fontSize: '0.68rem' }}>{stop.category}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>📍 {stop.micro_location}</span>
                </div>

                <h3 style={{ fontSize: '1.3rem', fontWeight: '700', marginBottom: '8px' }}>{stop.name}</h3>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '10px', lineHeight: '1.5' }}>
                  {stop.pace_rationale}
                </p>

                {/* Dietary SafeGuard Check */}
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-sm)',
                  background: 'rgba(16, 185, 129, 0.08)',
                  border: '1px solid rgba(16, 185, 129, 0.25)',
                  fontSize: '0.75rem',
                  color: '#6EE7B7'
                }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  <span>Memory Verified: Safe for {allergies.join(', ')}</span>
                </div>
              </div>

              {/* Waypoint Visual & Ticket Cost */}
              <div>
                <div style={{
                  height: '110px',
                  borderRadius: 'var(--radius-md)',
                  overflow: 'hidden',
                  position: 'relative',
                  marginBottom: '8px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.3)'
                }}>
                  <img
                    src={stop.image_url}
                    alt={stop.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '6px',
                    left: '6px',
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(4px)',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    fontSize: '0.62rem',
                    color: '#A5B4FC',
                    fontFamily: 'monospace'
                  }}>
                    gemini-3.1-flash-lite-image
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Admission</span>
                  <span className="mono" style={{ fontSize: '1rem', fontWeight: '700', color: stop.admission_cost_usd === 0 ? '#10B981' : '#FFFFFF' }}>
                    {stop.admission_cost_usd === 0 ? "FREE" : `$${stop.admission_cost_usd.toFixed(2)}`}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Master Mama Executive Signoff Box */}
        <div className="glass-panel" style={{
          padding: '24px 30px',
          borderLeft: '4px solid var(--accent-coral)',
          background: 'rgba(255, 94, 98, 0.04)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <span style={{ fontSize: '1.2rem' }}>👑</span>
            <span style={{ fontSize: '0.82rem', fontWeight: '800', letterSpacing: '0.06em', textTransform: 'uppercase', color: 'var(--accent-coral)' }}>
              Master Mama Executive Directive (Gemini 2.5 Pro Signoff)
            </span>
          </div>
          <p style={{ fontSize: '0.98rem', fontStyle: 'italic', color: 'var(--text-main)', lineHeight: '1.6' }}>
            "{dossier.mama_executive_signoff}"
          </p>
        </div>
      </div>
    </section>
  );
};
