import React, { useState } from 'react';
import { NomadMamaProvider, useNomadMama } from './context/NomadMamaContext';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { ItineraryStudio } from './components/ItineraryStudio';
import { CapitalOptimizer } from './components/CapitalOptimizer';
import { AgencyPartnerHub } from './components/AgencyPartnerHub';
import { DestinationExplorer } from './components/DestinationExplorer';
import { AllergySafeGuardModal } from './components/AllergySafeGuardModal';

const MainContent = () => {
  const { activeTab, setActiveTab, dossier, isGenerating } = useNomadMama();
  const [isAllergyModalOpen, setIsAllergyModalOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar onOpenAllergyModal={() => setIsAllergyModalOpen(true)} />

      {/* Main Content Area based on Active Tab */}
      <main style={{ flexGrow: 1, paddingBottom: '60px' }}>
        {activeTab === 'planner' && (
          <div>
            <HeroBanner />
            {/* Quick preview of the active itinerary underneath planner */}
            <div style={{ maxWidth: '1400px', margin: '40px auto 0', padding: '0 24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '20px'
              }}>
                <div>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
                    Live Itinerary Pipeline Preview
                  </h2>
                  <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                    Autonomous multi-agent synthesis: Sub-Agent 1 (Itinerary & Pacing) + Sub-Agent 2 (Capital Optimization)
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('dossier')}
                  className="btn-secondary"
                  style={{ fontSize: '0.82rem', padding: '8px 16px' }}
                >
                  View Full Dossier ({dossier.daily_schedules.length} Days) →
                </button>
              </div>
              <ItineraryStudio />
              <div style={{ marginTop: '30px' }}>
                <CapitalOptimizer />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'destinations' && (
          <DestinationExplorer />
        )}

        {activeTab === 'partners' && (
          <AgencyPartnerHub />
        )}

        {activeTab === 'dossier' && (
          <div style={{ maxWidth: '1400px', margin: '30px auto', padding: '0 24px' }}>
            <div style={{ marginBottom: '28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div className="badge badge-coral" style={{ marginBottom: '8px' }}>
                  SYNTHESIZED TRAVEL DOSSIER #{dossier.dossier_id}
                </div>
                <h1 style={{ fontSize: '2.2rem', fontWeight: '800', letterSpacing: '-0.02em' }}>
                  {dossier.trip_title}
                </h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  Anchored at {dossier.destination_hub} • {dossier.duration_days} Days High-Yield Routing
                </p>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button 
                  onClick={() => window.print()}
                  className="btn-secondary"
                  style={{ padding: '10px 18px', fontSize: '0.84rem' }}
                >
                  📄 Export Client PDF
                </button>
                <button 
                  onClick={() => setActiveTab('planner')}
                  className="btn-primary"
                  style={{ padding: '10px 20px', fontSize: '0.84rem' }}
                >
                  ⚡ Re-Tune Logistics
                </button>
              </div>
            </div>

            <ItineraryStudio />
            <div style={{ marginTop: '36px' }}>
              <CapitalOptimizer />
            </div>
          </div>
        )}
      </main>

      {/* Allergy Safeguard Modal */}
      <AllergySafeGuardModal
        isOpen={isAllergyModalOpen}
        onClose={() => setIsAllergyModalOpen(false)}
      />

      {/* Enterprise Platform Footer */}
      <footer style={{
        background: 'rgba(7, 9, 14, 0.95)',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        padding: '36px 24px 28px',
        color: 'var(--text-muted)',
        fontSize: '0.82rem'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '24px'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '1rem' }}>NomadMama AI Engine</span>
              <span className="badge badge-coral" style={{ fontSize: '0.65rem' }}>PRO ARCHITECT</span>
            </div>
            <p style={{ maxWidth: '500px', lineHeight: '1.5' }}>
              Powered by Google Gen AI SDK (`google-genai`), Gemini 2.5 Pro multi-agent state orchestration, Vertex AI Agent Engine Memory Bank, and Cloud Storage multimodal image synthesis.
            </p>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px', fontSize: '0.8rem' }}>
            <div>
              <div style={{ color: 'var(--text-main)', fontWeight: '700', marginBottom: '6px' }}>CORE ENGINE</div>
              <div>Gemini 2.5 Pro (Orchestrator)</div>
              <div>Gemini 2.5 Flash (Sub-Agents)</div>
              <div>Gemini 3.1 Flash Lite Image</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-main)', fontWeight: '700', marginBottom: '6px' }}>INTEGRATIONS</div>
              <div>Google Places & Geocoding</div>
              <div>Open-Meteo Weather API</div>
              <div>Agent Engine Sandbox</div>
            </div>
            <div>
              <div style={{ color: 'var(--text-main)', fontWeight: '700', marginBottom: '6px' }}>STATUS</div>
              <div style={{ color: '#10B981', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10B981' }}></span>
                Daemon Online (:8080)
              </div>
              <div>Memory Bank: Connected</div>
            </div>
          </div>
        </div>

        <div style={{
          maxWidth: '1400px',
          margin: '24px auto 0',
          paddingTop: '16px',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '0.74rem'
        }}>
          <div>© 2026 NomadMama Systems. Crafted for global wanderers, travel consortia & elite lodging partners.</div>
          <div>Allergy Safeguard: Zero Cross-Contact Guarantee</div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <NomadMamaProvider>
      <MainContent />
    </NomadMamaProvider>
  );
}
