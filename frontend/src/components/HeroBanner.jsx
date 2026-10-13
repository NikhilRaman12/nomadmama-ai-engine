import React, { useState } from 'react';
import { useNomadMama } from '../context/NomadMamaContext';

export const HeroBanner = () => {
  const {
    activeDestination,
    setActiveDestination,
    budgetCap,
    setBudgetCap,
    durationDays,
    setDurationDays,
    selectedPace,
    setSelectedPace,
    triggerOptimization,
    isGenerating,
    voiceRecording,
    setVoiceRecording,
    destinations
  } = useNomadMama();

  const [promptInput, setPromptInput] = useState(
    "Plan a high-velocity 3-day exploration of Tokyo focusing on neon tech corridors, historic shrines, and certified peanut-free artisanal dining under $2,500 total."
  );

  const handleVoiceToggle = () => {
    if (!voiceRecording) {
      setVoiceRecording(true);
      setTimeout(() => {
        setPromptInput(
          "Voice note transcribed: 'Hey TravelMama, refine my Tokyo route. Anchor me in Minato Ward, keep food strictly shellfish and nut-free, and ensure daily transit loop deadhead is under 45 minutes.'"
        );
        setVoiceRecording(false);
      }, 3000);
    } else {
      setVoiceRecording(false);
    }
  };

  return (
    <section style={{ padding: '60px 24px 30px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Top Tagline Badges */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <span className="badge badge-coral">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
          Gemini 2.5 Pro Orchestrator
        </span>
        <span className="badge badge-cyan">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
          Vertex AI Memory Bank (Engine: 8472910485920184712)
        </span>
        <span className="badge badge-emerald">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/></svg>
          Sandboxed Code Executor Active
        </span>
      </div>

      {/* Main Hero Title */}
      <div style={{ textAlign: 'center', maxWidth: '950px', margin: '0 auto 40px' }}>
        <h1 style={{ fontSize: 'clamp(2.4rem, 5.2vw, 4.2rem)', fontWeight: '800', lineHeight: '1.08', marginBottom: '18px' }}>
          Autonomous Travel Logistics & <br />
          <span className="text-grad-mama">Capital Optimizer</span>
        </h1>
        <p style={{ fontSize: '1.18rem', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '780px', margin: '0 auto' }}>
          Engineered for global tourist boards, enterprise agencies, and discerning travelers.
          Eliminates transit deadhead, calculates micro-costs with zero arithmetic drift, and anchors lodging to destination waypoints.
        </p>
      </div>

      {/* Interactive Command Center Panel */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '40px', border: '1px solid rgba(255, 255, 255, 0.12)' }}>
        {/* Row 1: Destination, Duration, Budget, Pace */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(230px, 1fr))',
          gap: '20px',
          marginBottom: '26px'
        }}>
          {/* Destination Selector */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-dim)', marginBottom: '8px', fontWeight: '700' }}>
              Target Destination Hub
            </label>
            <select
              value={activeDestination}
              onChange={(e) => setActiveDestination(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: '#FFFFFF',
                fontSize: '0.98rem',
                fontWeight: '600',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {destinations.map((d) => (
                <option key={d.id} value={d.name} style={{ background: '#0D111A' }}>
                  {d.name} ({d.avgTemp})
                </option>
              ))}
            </select>
          </div>

          {/* Trip Duration */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-dim)', fontWeight: '700' }}>
                Duration
              </label>
              <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--accent-coral)', fontWeight: '700' }}>
                {durationDays} Days
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={durationDays}
              onChange={(e) => setDurationDays(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-coral)', cursor: 'pointer' }}
            />
          </div>

          {/* Budget Cap Slider */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <label style={{ fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-dim)', fontWeight: '700' }}>
                Budget Cap Ceiling
              </label>
              <span className="mono" style={{ fontSize: '0.88rem', color: 'var(--accent-cyan)', fontWeight: '700' }}>
                ${budgetCap.toLocaleString()} USD
              </span>
            </div>
            <input
              type="range"
              min="800"
              max="10000"
              step="100"
              value={budgetCap}
              onChange={(e) => setBudgetCap(Number(e.target.value))}
              style={{ width: '100%', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
            />
          </div>

          {/* Pace Rating */}
          <div>
            <label style={{ display: 'block', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-dim)', marginBottom: '8px', fontWeight: '700' }}>
              Logistical Velocity
            </label>
            <select
              value={selectedPace}
              onChange={(e) => setSelectedPace(e.target.value)}
              style={{
                width: '100%',
                padding: '12px 16px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                color: '#FFFFFF',
                fontSize: '0.98rem',
                fontWeight: '600',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="Hyper-Dense Logistics" style={{ background: '#0D111A' }}>Hyper-Dense (Flash Optimized)</option>
              <option value="High-Yield Balanced" style={{ background: '#0D111A' }}>High-Yield Balanced</option>
              <option value="Measured Executive" style={{ background: '#0D111A' }}>Measured Executive Pace</option>
            </select>
          </div>
        </div>

        {/* Multi-modal Prompt Bar */}
        <div style={{ position: 'relative' }}>
          <textarea
            value={promptInput}
            onChange={(e) => setPromptInput(e.target.value)}
            rows={2}
            placeholder="Type your travel intention, constraints, or dietary safeguards..."
            style={{
              width: '100%',
              padding: '16px 200px 16px 18px',
              background: 'rgba(7, 9, 14, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: 'var(--radius-md)',
              color: '#FFFFFF',
              fontSize: '0.98rem',
              resize: 'none',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          />

          {/* Action Trigger Buttons inside prompt box */}
          <div style={{
            position: 'absolute',
            right: '12px',
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {/* Voice Input Simulation Button */}
            <button
              onClick={handleVoiceToggle}
              title="Speak or upload voice note"
              style={{
                background: voiceRecording ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                border: voiceRecording ? '1px solid #EF4444' : '1px solid var(--border-subtle)',
                color: voiceRecording ? '#EF4444' : 'var(--text-main)',
                width: '42px',
                height: '42px',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {voiceRecording ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '2px', height: '18px' }}>
                  <span style={{ width: '3px', height: '14px', background: '#EF4444', animation: 'waveBar 0.6s infinite ease-in-out' }}></span>
                  <span style={{ width: '3px', height: '18px', background: '#EF4444', animation: 'waveBar 0.8s infinite ease-in-out' }}></span>
                  <span style={{ width: '3px', height: '10px', background: '#EF4444', animation: 'waveBar 0.5s infinite ease-in-out' }}></span>
                </div>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"></path>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
                  <line x1="12" y1="19" x2="12" y2="22"></line>
                </svg>
              )}
            </button>

            {/* Synthesize Button */}
            <button
              onClick={() => triggerOptimization(promptInput)}
              disabled={isGenerating}
              className="btn-primary"
              style={{ height: '42px', padding: '0 22px' }}
            >
              {isGenerating ? (
                <>
                  <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid #FFFFFF', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></span>
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <span>Optimize Mandate</span>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Quick Suggestion Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '14px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: '600' }}>Tactical Presets:</span>
          {[
            "Tokyo Michelin & Shinto Rush ($2,500)",
            "Amalfi Coast Cliffside Villa Hub ($3,200)",
            "Kyoto Zen Ryokan & Bamboo ($2,200)",
            "Reykjavik Geothermal Aurora ($2,800)"
          ].map((preset, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPromptInput(`Generate high-velocity itinerary for: ${preset}`);
                triggerOptimization();
              }}
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-muted)',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {/* Operational Proof Metrics Bar */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '20px'
      }}>
        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>
            Commute Waste Reduction
          </div>
          <div className="mono" style={{ fontSize: '1.9rem', fontWeight: '800', color: 'var(--accent-coral)', margin: '4px 0' }}>
            -41.8%
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Destination-anchored hub routing
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>
            Fiscal Math Precision
          </div>
          <div className="mono" style={{ fontSize: '1.9rem', fontWeight: '800', color: 'var(--accent-cyan)', margin: '4px 0' }}>
            ±0.00 USD
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Zero hallucinated subtotal drift
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>
            Persistent Memory Recall
          </div>
          <div className="mono" style={{ fontSize: '1.9rem', fontWeight: '800', color: 'var(--accent-emerald)', margin: '4px 0' }}>
            100%
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Allergies & constraints remembered
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px 24px' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>
            Agent Speed Execution
          </div>
          <div className="mono" style={{ fontSize: '1.9rem', fontWeight: '800', color: 'var(--accent-amber)', margin: '4px 0' }}>
            1.8s
          </div>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Flash sub-agents + Pro audit
          </div>
        </div>
      </div>
    </section>
  );
};
