// src/components/HomePage.jsx

import React, { useEffect, useState } from 'react';
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import MainPage from './MainPage';
import LogoutButton from './LogoutButton';
import {
  getCurrentPositionAsync,
  fetchWeatherAsync,
} from '../services/LocationWeatherService';
import { getSuggestedOutfit } from '../services/OutfitService';
import GenerateOutfit from './GenerateOutfit';
import './HomePage.css';
<<<<<<< Updated upstream
=======
import axios from 'axios';


>>>>>>> Stashed changes

export default function HomePage() {
  // Sidebar / view state
  const [selectedSidebar, setSelectedSidebar] = useState('Wardrobe');
  const [view, setView] = useState('wardrobe');
  // Tabs/categories
  const categories = ['T-shirt', 'Jeans', 'Hoodie', 'Jacket'];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  // Clothing
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
<<<<<<< Updated upstream
  // Weather
=======

  // — Weather state
>>>>>>> Stashed changes
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');
  const { user, logout } = useContext(AuthContext);

  // fetch clothing
  useEffect(() => {
    if (!user || !user.email) return;
    fetch(`http://localhost:5000/api/clothing/${user.email}`)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error('Error fetching clothing:', err));
  }, [user]);

  // Filtering by category
  useEffect(() => {
    if (items.length === 0) {
      setFilteredItems([]);
      return;
    }
    setFilteredItems(
      items.filter(
        item =>
          item.type &&
          item.type.toLowerCase().replace('-', '').includes(
            selectedCategory.toLowerCase().replace('-', '')
          )
      )
    );
  }, [selectedCategory, items]);

  // Weather on mount
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

  // Sidebar click
  const handleSidebarClick = (label) => {
    setSelectedSidebar(label);
    if (label === 'Add Clothes') {
      setView('main');
<<<<<<< Updated upstream
    } else if (label === 'Logout') {
      logout();
    } else {
=======
    } else if (label === 'Generate Outfit') {
       setView('generate');
     } else {
>>>>>>> Stashed changes
      setView('wardrobe');
    }
  };

  return (
    <div
      className="app-layout"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/closet-bg.png)`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center center',
      }}
    >
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-title">OOTD</div>
        {['Wardrobe', 'Generate Outfit', 'Add Clothes', 'Logout'].map(label => (
          <button
            key={label}
            className={`sidebar-link${selectedSidebar === label ? ' selected' : ''}`}
            onClick={() => handleSidebarClick(label)}
          >
            {label}
          </button>
        ))}
      </div>

<<<<<<< Updated upstream
      {/* Main Content: header and grid together */}
      <div className="main-content">
        {/* Header */}
        <div className="header-section">
          <div className="header-main">
            <div className="wardrobe-heading">Welcome, {user?.name || 'User'}</div>
            {/* Category Tabs */}
            {view === 'wardrobe' && (
              <div className="category-tabs">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    className={`tab-btn${selectedCategory === cat ? ' active' : ''}`}
                    onClick={() => setSelectedCategory(cat)}
                  >
                    {cat + (cat.endsWith('s') ? '' : 's')}
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* Weather/Suggestion in header */}
          <div className="header-weather">
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
        </div>

        {/* Clothing Grid / Add Clothes Flow */}
        <div className="main-wardrobe-container">
          {view === 'wardrobe' ? (
            <div className="clothing-grid">
              {filteredItems.length === 0 ? (
                <div style={{ marginTop: 40, textAlign: 'center', color: '#c09a5b', fontSize: 20 }}>
                  No items in this category.
                </div>
              ) : (
                filteredItems.map(item => (
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
                ))
              )}
=======
        {view === 'wardrobe' ? (
          // ← YOUR WARDROBE GRID (handles its own fetch+render)
          <div className="clothing-grid">
 {filteredItems.map(item => (
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
        ) : view === 'generate' ? (
  <div>
    <button className="back-to-wardrobe-btn" onClick={() => setView('wardrobe')}>
      Back to Wardrobe
    </button>
        <h2>👕Today's Outfit</h2>
        <GenerateOutfit weather={weather} user={user} />
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
>>>>>>> Stashed changes
            </div>
          ) : (
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
      </div>
    </div>
  );
}
