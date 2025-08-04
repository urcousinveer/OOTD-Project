// src/components/HomePage.jsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import WardrobeNavBar from './WardrobeNavBar';
import CategorySection from './CategorySection';
import MainPage from './MainPage';
import {
  getCurrentPositionAsync,
  fetchWeatherAsync,
} from '../services/LocationWeatherService';
import { getSuggestedOutfit } from '../services/OutfitService';
import './HomePage.css';


export default function HomePage() {
  // Weather state
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState('loading');
  const [error, setError] = useState('');

  // Wardrobe state
  const [selectedSidebar, setSelectedSidebar] = useState('Home');
  const [selectedCategory, setSelectedCategory] = useState('T-Shirts');
  const [view, setView] = useState('wardrobe');
  const [clothes, setClothes] = useState({
    'T-Shirts': [], Jeans: [], Jackets: [], Hoodies: []
  });

  // Handlers
  const handleSidebarClick = ({ label }) => {
    setSelectedSidebar(label);
    setView(label === 'Add Clothes' ? 'main' : 'wardrobe');
  };
  const handleAddClothing = (cat, item) => {
    setClothes(prev => ({ ...prev, [cat]: [...prev[cat], item] }));
    setSelectedCategory(cat);
    setView('wardrobe');
  };

  // Fetch weather
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

  // Fetch wardrobe items
  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/clothing/${encodeURIComponent('ajay@gmail.com')}`)
      .then(res => {
        const grouped = { 'T-Shirts': [], Jeans: [], Jackets: [], Hoodies: [] };
        res.data.forEach(item => {
          const key = {
            't-shirt': 'T-Shirts',
            shirt:    'T-Shirts',
            jeans:    'Jeans',
            jacket:   'Jackets',
            hoodie:   'Hoodies',
          }[item.type.toLowerCase()] || 'T-Shirts';
          grouped[key].push(item);
        });
        setClothes(grouped);
      })
      .catch(console.error);
  }, []);

  return (
    <div
      className="app-layout"
      style={{
        /* IMPORTANT: load from public/ at runtime */
        backgroundImage: `url(${process.env.PUBLIC_URL}/closet-bg.png)`,
        backgroundSize:   'cover',
        backgroundPosition:'center center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-title">OOTD</div>
        {['Wardrobe','About','Generate Outfit','Add Clothes'].map(label => (
          <button
            key={label}
            className={`sidebar-link${selectedSidebar===label?' selected':''}`}
            onClick={()=>handleSidebarClick({label})}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Main wardrobe / Add page */}
      <div className="main-wardrobe-container">
        <div className="wardrobe-heading">Welcome, </div>
        {view === 'wardrobe' ? (
          <>
            <WardrobeNavBar
              selected={selectedCategory}
              onCategorySelect={setSelectedCategory}
            />
            <div style={{ marginTop: 36, marginBottom: 40 }}>
              <CategorySection items={clothes[selectedCategory]} />
            </div>
          </>
        ) : (
          <div>
            <button
              className="back-to-wardrobe-btn"
              onClick={()=>setView('wardrobe')}
            >
              Back to Wardrobe
            </button>
            <MainPage clothes={clothes} onAddClothing={handleAddClothing}/>
          </div>
        )}
      </div>

      {/* Weather Panel */}
      <div className="weather-panel">
        {status==='loading' && <div>Loading weather...</div>}
        {status==='error' && (
          <div style={{ color:'crimson', fontWeight:500 }}>
            {error}
            <br/>
            <span style={{ fontWeight:400, fontSize:14 }}>
              Try allowing location access.
            </span>
          </div>
        )}
        {status==='ready' && weather && (
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
