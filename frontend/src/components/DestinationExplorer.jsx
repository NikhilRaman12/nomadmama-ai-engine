import React, { useState } from 'react';
import { useNomadMama } from '../context/NomadMamaContext';

export const DestinationExplorer = () => {
  const { destinations, setActiveDestination, setBudgetCap, triggerOptimization, setActiveTab } = useNomadMama();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filterCategories = [
    { id: 'all', label: 'All Global Hubs' },
    { id: 'urban', label: '⚡ Hyper-Urban' },
    { id: 'coastal', label: '🌊 Coastal Panoramas' },
    { id: 'alpine', label: '🏔️ Alpine & Glacial' },
    { id: 'heritage', label: '⛩️ Sacred Heritage' }
  ];

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch = dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          dest.tagline.toLowerCase().includes(searchTerm.toLowerCase());
    if (!matchesSearch) return false;
    if (filter === 'urban') return dest.id === 'tokyo';
    if (filter === 'coastal') return dest.id === 'amalfi';
    if (filter === 'alpine') return dest.id === 'swiss-alps' || dest.id === 'iceland';
    if (filter === 'heritage') return dest.id === 'kyoto';
    return true;
  });

  const handleLaunch = (dest) => {
    setActiveDestination(dest.name);
    setBudgetCap(dest.suggestedBudget);
    triggerOptimization(`Autonomous expedition for ${dest.name} with luxury hotel anchor.`);
  };

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '32px 24px' }}>
      {/* Header section */}
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <div className="badge badge-coral" style={{ marginBottom: '12px' }}>
          GLOBAL DESTINATION ATLAS & HOTEL NODES
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '12px', letterSpacing: '-0.02em' }}>
          Vetted Global Hubs & Luxury Lodging Anchors
        </h1>
        <p style={{ color: 'var(--text-muted)', maxWidth: '720px', margin: '0 auto', fontSize: '1rem', lineHeight: '1.6' }}>
          Every destination is pre-analyzed with micro-transit buffers, geocoded waypoints, Open-Meteo live atmospheric forecasting, and pre-negotiated B2B agency commissions.
        </p>
      </div>

      {/* Search and Filters */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '16px',
        marginBottom: '36px',
        padding: '16px 20px',
        background: 'var(--bg-glass)',
        backdropFilter: 'blur(16px)',
        borderRadius: 'var(--radius-lg)',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Category Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {filterCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              style={{
                background: filter === cat.id ? 'var(--grad-mama)' : 'rgba(255, 255, 255, 0.05)',
                color: filter === cat.id ? '#FFFFFF' : 'var(--text-muted)',
                border: filter === cat.id ? 'none' : '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                padding: '8px 18px',
                fontSize: '0.84rem',
                fontWeight: filter === cat.id ? '600' : '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: filter === cat.id ? '0 4px 14px rgba(255, 94, 98, 0.25)' : 'none'
              }}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div style={{ position: 'relative', minWidth: '280px' }}>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search destination, country or vibe..."
            style={{
              width: '100%',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              padding: '10px 18px 10px 40px',
              color: 'var(--text-main)',
              fontSize: '0.88rem',
              outline: 'none'
            }}
          />
          <span style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
            🔍
          </span>
        </div>
      </div>

      {/* Destinations Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
        gap: '28px'
      }}>
        {filteredDestinations.map((dest) => (
          <div
            key={dest.id}
            className="glass-card"
            style={{
              borderRadius: 'var(--radius-lg)',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
              border: '1px solid var(--border-subtle)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-6px)';
              e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {/* Image Header with Badges */}
            <div style={{ position: 'relative', height: '230px', overflow: 'hidden' }}>
              <img
                src={dest.image}
                alt={dest.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'transform 0.5s ease'
                }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to top, rgba(7, 9, 14, 0.95) 0%, rgba(7, 9, 14, 0.2) 60%, transparent 100%)'
              }} />

              {/* Floating Metrics */}
              <div style={{ position: 'absolute', top: '14px', left: '14px', display: 'flex', gap: '8px' }}>
                <span className="badge badge-emerald">
                  ⚡ Pace Index {dest.paceIndex}
                </span>
                <span className="badge badge-indigo">
                  🌤️ {dest.avgTemp}
                </span>
              </div>

              <div style={{ position: 'absolute', top: '14px', right: '14px' }}>
                <span className="badge badge-coral">
                  {dest.partnerHotels}
                </span>
              </div>

              {/* Destination Title & Tagline */}
              <div style={{ position: 'absolute', bottom: '16px', left: '18px', right: '18px' }}>
                <h3 style={{ fontSize: '1.45rem', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.01em' }}>
                  {dest.name}
                </h3>
                <p style={{ fontSize: '0.82rem', color: 'rgba(255, 255, 255, 0.75)' }}>
                  {dest.tagline}
                </p>
              </div>
            </div>

            {/* Content Body */}
            <div style={{ padding: '20px 22px', display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
              <div style={{ marginBottom: '16px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px', fontWeight: '700' }}>
                  Curated Waypoint Nodes
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {dest.highlights.map((h, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.75rem',
                        padding: '4px 10px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 'var(--radius-full)',
                        color: 'var(--text-main)'
                      }}
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '12px 14px',
                background: 'rgba(255, 255, 255, 0.03)',
                borderRadius: 'var(--radius-md)',
                marginBottom: '18px',
                border: '1px solid rgba(255, 255, 255, 0.05)'
              }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Target Budget Cap</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--coral-500)' }}>
                    ${dest.suggestedBudget.toLocaleString()} USD
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Commission Yield</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#10B981' }}>
                    14% Enterprise
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <div style={{ marginTop: 'auto' }}>
                <button
                  onClick={() => handleLaunch(dest)}
                  className="btn-primary"
                  style={{ width: '100%', padding: '12px 16px', fontSize: '0.88rem' }}
                >
                  <span>Launch Expedition Studio</span>
                  <span>→</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
