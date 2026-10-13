import React from 'react';
import { useNomadMama } from '../context/NomadMamaContext';

export const CapitalOptimizer = () => {
  const { dossier } = useNomadMama();
  const breakdown = dossier.budget_breakdown_percentages;

  return (
    <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px 60px' }}>
      <div className="glass-panel" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span className="badge badge-cyan">Sub-Agent 2: Capital Scientist</span>
              <span className="badge badge-emerald">Deterministic Audit</span>
            </div>
            <h3 style={{ fontSize: '1.6rem', fontWeight: '800' }}>Capital Allocation & Fiscal Architecture</h3>
          </div>

          <div style={{ display: 'flex', gap: '14px' }}>
            <div style={{ padding: '10px 16px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Contingency Buffer</div>
              <div className="mono" style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--accent-amber)' }}>
                ${dossier.emergency_contingency_fund_usd.toFixed(2)}
              </div>
            </div>

            <div style={{ padding: '10px 16px', background: 'rgba(255, 255, 255, 0.04)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Variance Under Cap</div>
              <div className="mono" style={{ fontSize: '1.25rem', fontWeight: '800', color: '#10B981' }}>
                +${dossier.variance_to_cap_usd.toFixed(2)}
              </div>
            </div>
          </div>
        </div>

        {/* Multi-Segment Percentage Bar */}
        <div style={{
          height: '14px',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden',
          display: 'flex',
          marginBottom: '28px',
          boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5)',
          background: 'rgba(255,255,255,0.05)'
        }}>
          <div style={{ width: `${breakdown['Lodging Anchor']}%`, background: 'var(--accent-coral)' }} title={`Lodging: ${breakdown['Lodging Anchor']}%`}></div>
          <div style={{ width: `${breakdown['Gastronomy & Dining']}%`, background: 'var(--accent-peach)' }} title={`Dining: ${breakdown['Gastronomy & Dining']}%`}></div>
          <div style={{ width: `${breakdown['Admissions & Activities']}%`, background: 'var(--accent-cyan)' }} title={`Activities: ${breakdown['Admissions & Activities']}%`}></div>
          <div style={{ width: `${breakdown['Intra-City Transit']}%`, background: 'var(--accent-purple)' }} title={`Transit: ${breakdown['Intra-City Transit']}%`}></div>
          <div style={{ width: `${breakdown['Emergency Contingency Buffer']}%`, background: 'var(--accent-amber)' }} title={`Contingency: ${breakdown['Emergency Contingency Buffer']}%`}></div>
        </div>

        {/* Breakdown Category Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {[
            { label: "Lodging Anchor", pct: breakdown['Lodging Anchor'], color: 'var(--accent-coral)', icon: '🏨' },
            { label: "Gastronomy & Dining", pct: breakdown['Gastronomy & Dining'], color: 'var(--accent-peach)', icon: '🍜' },
            { label: "Admissions & Stops", pct: breakdown['Admissions & Activities'], color: 'var(--accent-cyan)', icon: '🎟️' },
            { label: "Intra-City Transit", pct: breakdown['Intra-City Transit'], color: 'var(--accent-purple)', icon: '🚆' },
            { label: "Contingency Fund", pct: breakdown['Emergency Contingency Buffer'], color: 'var(--accent-amber)', icon: '🛡️' }
          ].map((cat, idx) => (
            <div
              key={idx}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '16px',
                borderTop: `3px solid ${cat.color}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '1.2rem' }}>{cat.icon}</span>
                <span className="mono" style={{ fontSize: '1.15rem', fontWeight: '800', color: cat.color }}>
                  {cat.pct}%
                </span>
              </div>
              <div style={{ fontSize: '0.82rem', fontWeight: '600', color: 'var(--text-main)' }}>
                {cat.label}
              </div>
              <div className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                ${((dossier.projected_total_expenditure_usd * cat.pct) / 100).toFixed(2)} USD
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
