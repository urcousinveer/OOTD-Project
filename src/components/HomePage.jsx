// src/components/HomePage.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';           // ← import axios
import WardrobeNavBar from './WardrobeNavBar';
import CategorySection from './CategorySection';
import MainPage from './MainPage';
import { getCurrentPositionAsync, fetchWeatherAsync } from '../services/LocationWeatherService';
import { getSuggestedOutfit } from '../services/OutfitService';

export default function HomePage() {
  // Weather state (unchanged)…
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  // Wardrobe state
  const [selectedSidebar, setSelectedSidebar] = useState("Home");
  const [selectedCategory, setSelectedCategory] = useState("T-Shirts");
  const [view, setView] = useState("wardrobe");
  const [clothes, setClothes] = useState({
    "T-Shirts": [],
    "Jeans": [],
    "Jackets": [],
    "Hoodies": [],
  });

  // Sidebar click handler (unchanged)…
  const handleSidebarClick = (option) => {
    setSelectedSidebar(option.label);
    if (option.label === "Add More Clothes") setView("main");
    else setView("wardrobe");
  };

  // Add clothing handler (unchanged)…
  const handleAddClothing = (category, item) => {
    setClothes((prev) => ({
      ...prev,
      [category]: [...prev[category], item],
    }));
    setSelectedCategory(category);
    setView("wardrobe");
  };

  // Weather fetching (unchanged)…
  useEffect(() => {
    setStatus('loading');
    setError('');
    getCurrentPositionAsync()
      .then(coords => fetchWeatherAsync(coords))
      .then(data => {
        setWeather({
          city: data.name,
          temp: Math.round(data.main.temp),
          desc: data.weather[0].description,
        });
        setStatus('ready');
      })
      .catch(err => {
        setError(err.message || 'Failed to fetch weather');
        setStatus('error');
      });
  }, []);

  // 🛠️ NEW: Fetch your wardrobe from the backend on mount
  useEffect(() => {
    const email = 'ajay@gmail.com'; // ← hard‑coded until you wire up auth
    axios.get(`http://localhost:5000/api/clothing/${encodeURIComponent(email)}`)
      .then(res => {
        const items = res.data;
        // Group items by your categories
        const grouped = { "T-Shirts": [], "Jeans": [], "Jackets": [], "Hoodies": [] };
        items.forEach(item => {
          // Normalize the incoming type to your keys:
          // e.g. API returns "t-shirt", "jeans", "jacket", "hoodie"
          const typeKey = {
            't-shirt': 'T-Shirts',
            'shirt': 'T-Shirts',
            'jeans': 'Jeans',
            'jacket': 'Jackets',
            'hoodie': 'Hoodies'
          }[item.type.toLowerCase()] || 'T-Shirts';

          grouped[typeKey].push(item);
        });
        setClothes(grouped);
      })
      .catch(err => {
        console.error('❌ Error fetching wardrobe:', err);
      });
  }, []);

  return (
    <div className="app-layout">
      {/* Sidebar (unchanged) */}
      <div className="sidebar">
        <div className="sidebar-title">Outfit</div>
        {["Home", "About", "Generate Outfit for Today", "Add More Clothes"].map(label => (
          <button
            key={label}
            className={`sidebar-link${selectedSidebar === label ? " selected" : ""}`}
            onClick={() => handleSidebarClick({ label })}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Main Wardrobe / Add page */}
      <div className="main-wardrobe-container">
        <div className="wardrobe-heading">My Wardrobe</div>
        {view === "wardrobe" && (
          <>
            <WardrobeNavBar
              selected={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
            <div style={{ marginTop: 36, marginBottom: 40 }}>
              {/* Now this will render your fetched items */}
              <CategorySection items={clothes[selectedCategory]} />
              <button
                className="add-more-clothes-btn"
                onClick={() => setView("main")}
              >
                Add More Clothes
              </button>
            </div>
          </>
        )}
        {view === "main" && (
          <div>
            <button
              className="back-to-wardrobe-btn"
              onClick={() => setView("wardrobe")}
            >
              Back to Wardrobe
            </button>
            <MainPage clothes={clothes} onAddClothing={handleAddClothing} />
          </div>
        )}
      </div>

      {/* Weather Panel (unchanged) */}
      <div className="weather-panel">
        {status === 'loading' && <div>Loading weather...</div>}
        {status === 'error' && (
          <div style={{ color: 'crimson', fontWeight: 500 }}>
            {error}
            <br />
            <span style={{ fontWeight: 400, fontSize: 14 }}>Try allowing location access.</span>
          </div>
        )}
        {status === 'ready' && weather && (
          <>
            <div className="weather-location">
              <span role="img" aria-label="pin">📍</span> Current Weather in {weather.city}
            </div>
            <div className="weather-temp">{weather.temp}°C</div>
            <div className="weather-desc">{weather.desc}</div>
            <div className="weather-suggestion-title">Suggested Outfit</div>
            <div className="weather-suggestion">
              {getSuggestedOutfit(weather.temp, weather.desc)}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
