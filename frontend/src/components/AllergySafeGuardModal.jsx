import React, { useState } from 'react';
import { useNomadMama } from '../context/NomadMamaContext';

export const AllergySafeGuardModal = ({ isOpen, onClose }) => {
  const { allergies, toggleAllergy } = useNomadMama();
  const [newAllergyInput, setNewAllergyInput] = useState('');

  if (!isOpen) return null;

  const standardAllergens = [
    { id: "Peanuts / Tree Nuts", icon: "🥜", desc: "Zero cross-contact in yakitori, satays, and desserts" },
    { id: "Shellfish (Crustaceans)", icon: "🦐", desc: "Excludes lobster, shrimp, crab stocks, and oyster sauces" },
    { id: "Gluten / Celiac", icon: "🌾", desc: "Tamari substitutes; isolated boiling pots" },
    { id: "Dairy / Lactose", icon: "🥛", desc: "Non-dairy emulsion vetting; dedicated pans" },
    { id: "Sesame & Tahini", icon: "🌱", desc: "No toasted sesame oils or seed marinades" },
    { id: "Egg / Albumin", icon: "🥚", desc: "Excludes raw egg dips and wash glazes" },
    { id: "Soy / Legumes", icon: "🫘", desc: "Alternative seasoning bases; coconut aminos" },
    { id: "Mustard & Seeds", icon: "🌭", desc: "Condiment exclusions" }
  ];

  const handleAddCustom = (e) => {
    e.preventDefault();
    if (newAllergyInput.trim() && !allergies.includes(newAllergyInput.trim())) {
      toggleAllergy(newAllergyInput.trim());
      setNewAllergyInput('');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 100,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: '#0D111A',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: 'var(--radius-xl)',
        maxWidth: '650px',
        width: '100%',
        padding: '30px',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.8)',
        maxHeight: '90vh',
        overflowY: 'auto'
      }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '1.4rem' }}>🛡️</span>
              <h2 style={{ fontSize: '1.4rem', fontWeight: '800', letterSpacing: '-0.01em' }}>
                NomadMama Memory Bank Allergy SafeGuard
              </h2>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
              Persistent Vertex AI Agent Engine memory lock. All culinary nodes, tasting menus, and street vendors are vetted by Sub-Agent 1 with zero cross-contact tolerance.
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              color: 'var(--text-muted)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontSize: '1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ✕
          </button>
        </div>

        {/* Active Allergens Pill Summary */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 18px',
          marginBottom: '24px'
        }}>
          <div style={{ fontSize: '0.74rem', color: '#6EE7B7', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
            Active Memory Bank Profile ({allergies.length} Protected Constraints)
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
            {allergies.map((allergy) => (
              <span
                key={allergy}
                style={{
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#A7F3D0',
                  border: '1px solid rgba(16, 185, 129, 0.4)',
                  padding: '4px 10px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '0.78rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <span>✓ {allergy}</span>
                <span 
                  onClick={() => toggleAllergy(allergy)}
                  style={{ cursor: 'pointer', opacity: 0.7, marginLeft: '2px' }}
                >
                  ✕
                </span>
              </span>
            ))}
          </div>
        </div>

        {/* Standard Allergen Check Grid */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '12px' }}>
            Select or Deselect Allergen Flags
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '10px' }}>
            {standardAllergens.map((item) => {
              const isSelected = allergies.includes(item.id);
              return (
                <div
                  key={item.id}
                  onClick={() => toggleAllergy(item.id)}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'rgba(255, 94, 98, 0.12)' : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? '1px solid rgba(255, 94, 98, 0.4)' : '1px solid rgba(255, 255, 255, 0.07)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}
                >
                  <span style={{ fontSize: '1.4rem' }}>{item.icon}</span>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ fontSize: '0.84rem', fontWeight: '600', color: isSelected ? '#FFFFFF' : 'var(--text-muted)' }}>
                      {item.id}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'rgba(255, 255, 255, 0.4)' }}>
                      {item.desc}
                    </div>
                  </div>
                  <div style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '4px',
                    border: isSelected ? 'none' : '1px solid rgba(255, 255, 255, 0.3)',
                    background: isSelected ? 'var(--grad-mama)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.7rem',
                    color: '#FFFFFF'
                  }}>
                    {isSelected ? '✓' : ''}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Add Custom Dietary Constraint */}
        <form onSubmit={handleAddCustom} style={{ marginBottom: '24px', display: 'flex', gap: '8px' }}>
          <input
            type="text"
            value={newAllergyInput}
            onChange={(e) => setNewAllergyInput(e.target.value)}
            placeholder="Add custom dietary constraint (e.g., Fava Beans, Sulfites)..."
            style={{
              flexGrow: 1,
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '10px 14px',
              color: 'var(--text-main)',
              fontSize: '0.82rem',
              outline: 'none'
            }}
          />
          <button
            type="submit"
            className="btn-secondary"
            style={{ padding: '10px 16px', fontSize: '0.82rem' }}
          >
            + Add
          </button>
        </form>

        {/* Footer Actions */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
          <button
            onClick={onClose}
            className="btn-primary"
            style={{ padding: '10px 24px', fontSize: '0.88rem' }}
          >
            Save & Sync to Memory Bank
          </button>
        </div>
      </div>
    </div>
  );
};
