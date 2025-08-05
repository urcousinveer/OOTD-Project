// src/components/HomePage.jsx

import React, { useEffect, useState } from 'react';
import Wardrobe from './Wardrobe';          // ← your Wardrobe.jsx
import MainPage from './MainPage';          // ← your existing Add Clothes flow
import {
  getCurrentPositionAsync,
  fetchWeatherAsync,
} from '../services/LocationWeatherService';
import { getSuggestedOutfit } from '../services/OutfitService';
import './HomePage.css';


export default function HomePage() {
  // — Sidebar / view state
  const [selectedSidebar, setSelectedSidebar] = useState('Wardrobe');
  const [view, setView]               = useState('wardrobe');

  // clothing
  const [items, setItems] = useState([]);
  
  // — Weather state
  const [weather, setWeather] = useState(null);
  const [status,  setStatus]  = useState('loading');
  const [error,   setError]   = useState('');

// fetch cloth
  useEffect(() => {
    fetch('http://localhost:5000/clothing')
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error('Error fetching clothing:', err));
  }, []);

  // On mount: fetch weather
  useEffect(() => {
    setStatus('loading');
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

  // Sidebar click handler
  const handleSidebarClick = (label) => {
    setSelectedSidebar(label);
    if (label === 'Add Clothes') {
      setView('main');
    } else {
      setView('wardrobe');
    }
  };

  return (
    <div
      className="app-layout"
      style={{
        backgroundImage:   `url(${process.env.PUBLIC_URL}/closet-bg.png)`,
        backgroundSize:    'cover',
        backgroundRepeat:  'no-repeat',
        backgroundPosition:'center center',
      }}
    >
      {/* ─── Sidebar ──────────────────────────────────────────────────────────── */}
      <div className="sidebar">
        <div className="sidebar-title">OOTD</div>
        {['Wardrobe', 'About', 'Generate Outfit', 'Add Clothes'].map(label => (
          <button
            key={label}
            className={`sidebar-link${selectedSidebar === label ? ' selected' : ''}`}
            onClick={() => handleSidebarClick(label)}
          >
            {label}
          </button>
        ))}
      </div>

 


      {/* ─── Main Content (Wardrobe or Add Clothes) ───────────────────────────── */}
      <div className="main-wardrobe-container">
        <div className="wardrobe-heading">Welcome,</div>

        {view === 'wardrobe' ? (
          // ← YOUR WARDROBE GRID (handles its own fetch+render)
          <div className="clothing-grid">
  {items.map(item => (
    <div className="clothing-card" key={item._id}>
      {item.imageUrl ? (
        <img src={item.imageUrl} alt={item.type} className="clothing-image" />
      ) : (
        <div className="image-placeholder">{item.type}</div>
      )}
      <div className="clothing-info">
        <div><strong>{item.type}</strong></div>
        <div>Color: {item.color}</div>
        <div>Formality: {item.formality}</div>
        <div>Warmth: {item.warmth}</div>
      </div>
    </div>
  ))}
</div>
          

        ) : (
          // ← YOUR EXISTING ADD-CLOTHES FLOW
          <div>
            <button
              className="back-to-wardrobe-btn"
              onClick={() => setView('wardrobe')}
            >
              Back to Wardrobe
            </button>
            <MainPage clothes={[]} onAddClothing={() => setView('wardrobe')} />
          </div>
        )}
      </div>

      {/* ─── Weather Panel ─────────────────────────────────────────────────────── */}
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
