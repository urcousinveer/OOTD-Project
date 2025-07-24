import React, { useEffect, useState } from 'react';
import WardrobeNavBar from './WardrobeNavBar';
import CategorySection from './CategorySection';
import MainPage from './MainPage';
import { getCurrentPositionAsync, fetchWeatherAsync } from '../services/LocationWeatherService';
import { getSuggestedOutfit } from '../services/OutfitService';

export default function HomePage() {
  // Weather state
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

  // Sidebar click handler
  const handleSidebarClick = (option) => {
    setSelectedSidebar(option.label);
    if (option.label === "Add More Clothes") setView("main");
    else setView("wardrobe");
  };

  // Add clothing handler
  const handleAddClothing = (category, item) => {
    setClothes((prev) => ({
      ...prev,
      [category]: [...prev[category], item],
    }));
    setSelectedCategory(category);
    setView("wardrobe");
  };

  // Weather fetching on mount
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

  return (
    <div className="app-layout">
      {/* Sidebar */}
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

      {/* Wardrobe/Main content */}
      <div className="main-wardrobe-container">
        <div className="wardrobe-heading">My Wardrobe</div>
        {view === "wardrobe" && (
          <>
            <WardrobeNavBar
              selected={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
            <div style={{ marginTop: 36, marginBottom: 40 }}>
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

      {/* Weather Panel */}
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
      <div className="weather-temp">
        {weather.temp}°C
      </div>
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
