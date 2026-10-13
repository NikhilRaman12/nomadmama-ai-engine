import React, { useState } from 'react';

export const AgencyPartnerHub = () => {
  const [partnerType, setPartnerType] = useState('agency'); // agency | tourism_board | hotel | mobility
  const [marginPct, setMarginPct] = useState(14);
  const [clientCount, setClientCount] = useState(25);

  const calculateCommission = () => {
    const avgBookingUsd = 2600;
    return (clientCount * avgBookingUsd * (marginPct / 100)).toLocaleString();
  };

  return (
    <section style={{ maxWidth: '1400px', margin: '0 auto', padding: '40px 24px 60px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: '850px', margin: '0 auto 40px' }}>
        <div style={{ display: 'inline-flex', gap: '8px', marginBottom: '12px' }}>
          <span className="badge badge-purple" style={{ background: 'rgba(139, 92, 246, 0.15)', color: '#C4B5FD', border: '1px solid rgba(139, 92, 246, 0.3)' }}>
            B2B Enterprise Portal
          </span>
          <span className="badge badge-coral">Multi-Tenant Engine</span>
        </div>
        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: '800', marginBottom: '16px' }}>
          Empowering Global Travel Agencies, <br />
          <span className="text-grad-mama">Tourism Boards & Luxury Hotel Groups</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', lineHeight: '1.6' }}>
          Plug the NomadMama autonomous multi-agent state machine directly into your travel booking infrastructure,
          whitelabel itinerary engines, and destination marketing campaigns.
        </p>
      </div>

      {/* Partner Tier Selector */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '36px', flexWrap: 'wrap' }}>
        {[
          { id: 'agency', label: 'Travel Agencies & Consortia', icon: '✈️' },
          { id: 'tourism_board', label: 'DMOs & Tourism Boards', icon: '🏛️' },
          { id: 'hotel', label: 'Luxury Hotel Chains & Villas', icon: '🏨' },
          { id: 'mobility', label: 'Private Rail & Traveling Partners', icon: '🚆' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setPartnerType(tab.id)}
            className={partnerType === tab.id ? 'btn-primary' : 'btn-secondary'}
            style={{ borderRadius: 'var(--radius-full)', padding: '10px 22px' }}
          >
            <span>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Partner Tier Showcase Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
        {/* Feature 1 */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(255, 94, 98, 0.12)', border: '1px solid rgba(255, 94, 98, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '18px' }}>
            ⚡
          </div>
          <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px' }}>
            Sub-Second Itinerary Synthesis
          </h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Replace 6 hours of manual travel agent research with deterministic 1.8-second mathematical optimization.
            Flash sub-agents sequence stops to eliminate commute deadhead across all major global metro hubs.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(0, 242, 254, 0.12)', border: '1px solid rgba(0, 242, 254, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '18px' }}>
            🧠
          </div>
          <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px' }}>
            Client Allergy & Health Vault
          </h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Backed by Vertex AI Memory Bank, NomadMama permanently cross-checks every client dietary restriction,
            allergen risk (celiac, peanut, shellfish), and mobility constraint across all culinary waypoints and stays.
          </p>
        </div>

        {/* Feature 3 */}
        <div className="glass-panel" style={{ padding: '28px' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.12)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '18px' }}>
            💰
          </div>
          <h4 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '10px' }}>
            Dynamic Yield & Margin Engine
          </h4>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Set custom corporate commission caps, B2B net rates, and markup spreads.
            Our Budget Planning Scientist strictly polices micro-costs to guarantee clients stay under budget while maximizing agency yield.
          </p>
        </div>
      </div>

      {/* Interactive Agency Commission Calculator */}
      <div className="glass-panel" style={{ padding: '36px', background: 'linear-gradient(135deg, rgba(18, 24, 38, 0.85) 0%, rgba(10, 14, 24, 0.95) 100%)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '36px', alignItems: 'center' }}>
          <div>
            <span className="badge badge-coral" style={{ marginBottom: '12px' }}>Enterprise Revenue Calculator</span>
            <h3 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '14px' }}>
              Project Your Agency Yield with NomadMama AI
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.6', marginBottom: '24px' }}>
              Scale from bespoke 1-on-1 VIP travel design to thousands of automated executive dossiers per month with zero human overhead.
            </p>

            {/* Slider 1: Monthly Clients */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: '700' }}>Active Monthly Travelers / Bookings</label>
                <span className="mono" style={{ fontWeight: '700', color: 'var(--text-highlight)' }}>{clientCount} Travelers</span>
              </div>
              <input
                type="range"
                min="5"
                max="250"
                value={clientCount}
                onChange={(e) => setClientCount(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-coral)' }}
              />
            </div>

            {/* Slider 2: Margin % */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ fontSize: '0.82rem', color: 'var(--text-dim)', fontWeight: '700' }}>Target Agency Margin Split</label>
                <span className="mono" style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}>{marginPct}% Net</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={marginPct}
                onChange={(e) => setMarginPct(Number(e.target.value))}
                style={{ width: '100%', accentColor: 'var(--accent-cyan)' }}
              />
            </div>
          </div>

          {/* Calculator Output Display */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: 'var(--radius-lg)',
            padding: '32px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>
              Projected Monthly Agency Revenue
            </div>
            <div className="mono text-grad-mama" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.8rem)', fontWeight: '800', margin: '14px 0' }}>
              ${calculateCommission()}
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '24px' }}>
              Based on average $2,600 booking value across luxury global nodes.
            </div>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Request Enterprise API Key & SDK Sandbox
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
