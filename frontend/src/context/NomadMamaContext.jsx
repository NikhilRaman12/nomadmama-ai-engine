import React, { createContext, useContext, useState } from 'react';

const NomadMamaContext = createContext();

export const INITIAL_DOSSIER = {
  dossier_id: "DOSSIER-TOKYO-NEXUS-884",
  destination_hub: "Tokyo, Japan",
  trip_title: "Hyper-Velocity Neon & Shinto Precision Expedition",
  duration_days: 3,
  total_budget_cap_usd: 2500.0,
  projected_total_expenditure_usd: 2315.50,
  variance_to_cap_usd: 184.50,
  emergency_contingency_fund_usd: 165.00,
  operational_pace_rating: "Hyper-Dense Logistics (Zero Commute Deadhead)",
  selected_lodging: {
    property_name: "The Tokyo EDITION, Toranomon",
    property_type: "Luxury Strategic Hub",
    geographic_zone: "Minato Ward / Toranomon Metro Nexus",
    nightly_rate_usd: 485.00,
    total_nights: 3,
    total_lodging_cost_usd: 1455.00,
    proximity_index_score: 9.8,
    transit_elimination_summary: "Direct underground access to Ginza & Hibiya lines cuts morning transit loop overhead by 42 minutes per day."
  },
  daily_schedules: [
    {
      day_number: 1,
      calendar_date_or_label: "Day 1 - Neon Cyber-Corridors & Shinjuku Heights",
      primary_theme: "High-Yield Urban Velocity & Authentic Tachigui",
      total_daily_active_hours: 9.5,
      total_transit_overhead_minutes: 45,
      daily_transit_cost_usd: 18.00,
      daily_meal_cost_usd: 75.00,
      daily_subtotal_usd: 243.00,
      stops: [
        {
          name: "Meiji Jingu Shrine & Forest Canopy",
          category: "Cultural Sanctuary",
          arrival_time: "08:30",
          departure_time: "10:15",
          allocated_duration_minutes: 105,
          transit_buffer_minutes: 15,
          micro_location: "Shibuya-ku",
          admission_cost_usd: 0.00,
          pace_rationale: "Early arrival avoids cruise crowds and secures quietest forest lighting.",
          image_url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Omoide Yokocho (Memory Lane)",
          category: "Artisanal Alley Dining",
          arrival_time: "12:30",
          departure_time: "14:00",
          allocated_duration_minutes: 90,
          transit_buffer_minutes: 20,
          micro_location: "Shinjuku West Gate",
          admission_cost_usd: 35.00,
          pace_rationale: "Pre-vetted nut-free yakitori master grills with zero peanut oil cross-contact.",
          image_url: "https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "teamLab Borderless Digital Museum",
          category: "Immersive Art Node",
          arrival_time: "16:00",
          departure_time: "18:30",
          allocated_duration_minutes: 150,
          transit_buffer_minutes: 20,
          micro_location: "Azabudai Hills",
          admission_cost_usd: 38.00,
          pace_rationale: "Timed twilight entry minimizes queue time and aligns with evening Toranomon hub return.",
          image_url: "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=800&q=80"
        }
      ]
    },
    {
      day_number: 2,
      calendar_date_or_label: "Day 2 - Edo Tradition, Asakusa & Akihabara Edge",
      primary_theme: "Sacred Heritage to Quantum Tech",
      total_daily_active_hours: 10.0,
      total_transit_overhead_minutes: 50,
      daily_transit_cost_usd: 22.00,
      daily_meal_cost_usd: 90.00,
      daily_subtotal_usd: 312.00,
      stops: [
        {
          name: "Senso-ji Temple & Nakamise-dori",
          category: "Ancient Buddhist Complex",
          arrival_time: "09:00",
          departure_time: "11:00",
          allocated_duration_minutes: 120,
          transit_buffer_minutes: 25,
          micro_location: "Taito-ku",
          admission_cost_usd: 0.00,
          pace_rationale: "Morning incense ceremonies and early crafts before midday tour congestion.",
          image_url: "https://images.unsplash.com/photo-1526481280693-3bfa7568e0f3?auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Akihabara Super Electronics Nexus",
          category: "High-Tech Corridor",
          arrival_time: "14:30",
          departure_time: "17:30",
          allocated_duration_minutes: 180,
          transit_buffer_minutes: 15,
          micro_location: "Chiyoda-ku",
          admission_cost_usd: 25.00,
          pace_rationale: "Direct Hibiya line transit without line transfers.",
          image_url: "https://images.unsplash.com/photo-1554797589-7241ab7441d9?auto=format&fit=crop&w=800&q=80"
        }
      ]
    },
    {
      day_number: 3,
      calendar_date_or_label: "Day 3 - Waterfront Odaiba & Ginza Precision Gastronomy",
      primary_theme: "Maritime Panoramas & Michelin Craftsmanship",
      total_daily_active_hours: 8.5,
      total_transit_overhead_minutes: 40,
      daily_transit_cost_usd: 24.00,
      daily_meal_cost_usd: 120.00,
      daily_subtotal_usd: 305.50,
      stops: [
        {
          name: "Tsukiji Outer Market Culinary Stroll",
          category: "Master Seafood & Produce",
          arrival_time: "08:30",
          departure_time: "10:30",
          allocated_duration_minutes: 120,
          transit_buffer_minutes: 15,
          micro_location: "Chuo-ku",
          admission_cost_usd: 40.00,
          pace_rationale: "Shellfish-allergy verified routes with private tamagoyaki egg masters.",
          image_url: "https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80"
        },
        {
          name: "Ginza Six Rooftop Garden & Tea House",
          category: "Skyline Serenity",
          arrival_time: "15:00",
          departure_time: "17:00",
          allocated_duration_minutes: 120,
          transit_buffer_minutes: 20,
          micro_location: "Ginza",
          admission_cost_usd: 28.00,
          pace_rationale: "Restorative buffer before international departure transition.",
          image_url: "https://images.unsplash.com/photo-1508804185872-d7badad00f7d?auto=format&fit=crop&w=800&q=80"
        }
      ]
    }
  ],
  budget_breakdown_percentages: {
    "Lodging Anchor": 62.8,
    "Gastronomy & Dining": 12.3,
    "Admissions & Activities": 11.2,
    "Intra-City Transit": 6.6,
    "Emergency Contingency Buffer": 7.1
  },
  mama_executive_signoff: "Executed with mathematical velocity. Zero commute deadhead achieved via Toranomon Hub anchoring. All culinary waypoints rigorously vetted against user peanut and shellfish sensitivities. Ready for client departure."
};

export const GLOBAL_DESTINATIONS = [
  {
    id: "tokyo",
    name: "Tokyo, Japan",
    tagline: "High-Velocity Neon & Ancient Shinto Core",
    image: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=800&q=80",
    paceIndex: "9.9/10",
    avgTemp: "22°C",
    partnerHotels: "14 Luxury Anchors",
    suggestedBudget: 2500,
    highlights: ["Shibuya Sky", "Omoide Yokocho", "Meiji Jingu", "teamLab"]
  },
  {
    id: "amalfi",
    name: "Amalfi Coast, Italy",
    tagline: "Cliffside Panoramas & Mediterranean Precision",
    image: "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=800&q=80",
    paceIndex: "8.7/10",
    avgTemp: "25°C",
    partnerHotels: "9 Boutique Villas",
    suggestedBudget: 3200,
    highlights: ["Positano Fjord", "Ravello Gardens", "Capri Yacht Transfer"]
  },
  {
    id: "kyoto",
    name: "Kyoto & Arashiyama, Japan",
    tagline: "Zen Bamboo Groves & Imperial Ryokan Heritage",
    image: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=800&q=80",
    paceIndex: "9.4/10",
    avgTemp: "24°C",
    partnerHotels: "11 Heritage Ryokans",
    suggestedBudget: 2200,
    highlights: ["Fushimi Inari", "Kinkaku-ji", "Sagano Scenic Rail"]
  },
  {
    id: "iceland",
    name: "Reykjavik & Golden Circle",
    tagline: "Volcanic Aurora & Geothermal Blue Lagoons",
    image: "https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=800&q=80",
    paceIndex: "9.1/10",
    avgTemp: "11°C",
    partnerHotels: "7 Geothermal Lodges",
    suggestedBudget: 2800,
    highlights: ["Gullfoss Falls", "Silfra Fissure", "Blue Lagoon Retreat"]
  },
  {
    id: "swiss-alps",
    name: "Zermatt & Swiss Alps",
    tagline: "Glacier Express & Matterhorn Chalet Heights",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=800&q=80",
    paceIndex: "9.6/10",
    avgTemp: "14°C",
    partnerHotels: "12 Alpine Chalets",
    suggestedBudget: 3400,
    highlights: ["Gornergrat Bahn", "Matterhorn Glacier", "Fondue Alleys"]
  }
];

export const NomadMamaProvider = ({ children }) => {
  const [activeDestination, setActiveDestination] = useState("Tokyo, Japan");
  const [budgetCap, setBudgetCap] = useState(2500);
  const [durationDays, setDurationDays] = useState(3);
  const [travelerCount, setTravelerCount] = useState(1);
  const [selectedPace, setSelectedPace] = useState("Hyper-Dense Logistics");
  const [allergies, setAllergies] = useState(["Peanuts / Tree Nuts", "Shellfish (Crustaceans)"]);
  const [dossier, setDossier] = useState(INITIAL_DOSSIER);
  const [isGenerating, setIsGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState("planner"); // planner | destinations | partners | dossier
  const [currency, setCurrency] = useState("USD");
  const [voiceRecording, setVoiceRecording] = useState(false);

  const toggleAllergy = (allergy) => {
    if (allergies.includes(allergy)) {
      setAllergies(allergies.filter((a) => a !== allergy));
    } else {
      setAllergies([...allergies, allergy]);
    }
  };

  const triggerOptimization = (customPrompt = "") => {
    setIsGenerating(true);
    setTimeout(() => {
      // Simulate multi-agent synthesis update
      setDossier((prev) => ({
        ...prev,
        destination_hub: activeDestination,
        duration_days: durationDays,
        total_budget_cap_usd: budgetCap,
        projected_total_expenditure_usd: +(budgetCap * 0.92).toFixed(2),
        variance_to_cap_usd: +(budgetCap * 0.08).toFixed(2),
        emergency_contingency_fund_usd: +(budgetCap * 0.065).toFixed(2),
        dossier_id: `DOSSIER-${activeDestination.substring(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`
      }));
      setIsGenerating(false);
      setActiveTab("dossier");
    }, 1800);
  };

  return (
    <NomadMamaContext.Provider
      value={{
        activeDestination,
        setActiveDestination,
        budgetCap,
        setBudgetCap,
        durationDays,
        setDurationDays,
        travelerCount,
        setTravelerCount,
        selectedPace,
        setSelectedPace,
        allergies,
        toggleAllergy,
        dossier,
        setDossier,
        isGenerating,
        activeTab,
        setActiveTab,
        currency,
        setCurrency,
        voiceRecording,
        setVoiceRecording,
        triggerOptimization,
        destinations: GLOBAL_DESTINATIONS
      }}
    >
      {children}
    </NomadMamaContext.Provider>
  );
};

export const useNomadMama = () => useContext(NomadMamaContext);
