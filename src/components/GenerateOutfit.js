// src/components/GenerateOutfit.jsx
import React, { useEffect, useState, useContext } from 'react';
import { fetchOutfitSuggestions } from '../services/OutfitSuggestionService';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

function GenerateOutfit({ weather }) {
  const [suggestion, setSuggestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const [suggestedOutfit, setSuggestedOutfit] = useState([]);

  useEffect(() => {
    if (user?.email && weather?.temp && weather?.desc) {
      const fetchOutfit = async () => {
        try {
          const response = await axios.post(
            'http://localhost:5000/api/suggest-outfit',
            {
              email: user.email,
              temp: weather.temp,
              weatherMain: weather.desc,
            },
            { withCredentials: true }
          );
          setSuggestion(response.data);
          setSuggestedOutfit(response.data.suggestions);
        } catch (error) {
          console.error('Error generating outfit:', error.message);
        } finally {
          setLoading(false);
        }
      };
      fetchOutfit();
    }
  }, [user, weather]);

  if (loading) return <p style={{ fontSize: '1.1rem', color: '#a67c37' }}>Loading outfit suggestion...</p>;

  return (
    <div className="generate-outfit-root">
      <style>
        {`
          .generate-outfit-root {
            max-width: 720px;
            margin: 32px auto;
            background: rgba(255,255,255,0.78);
            border-radius: 32px;
            box-shadow: 0 4px 24px 0 rgba(166,124,55,0.07);
            padding: 2.5rem 2rem;
            font-family: 'Segoe UI', 'Roboto', Arial, sans-serif;
          }
          .outfit-header {
            display: flex;
            align-items: center;
            font-size: 2rem;
            font-weight: 600;
            color: #7a5219;
            margin-bottom: 18px;
            gap: 0.5em;
          }
          .weather-details, .tag-details {
            font-size: 1.08rem;
            color: #64400c;
            margin-bottom: 0.8rem;
            letter-spacing: 0.01em;
          }
          .divider {
            border-top: 1.5px solid #ead6b7;
            margin: 1.4em 0 1.2em 0;
            border-radius: 6px;
          }
          .generated-items-header {
            font-size: 1.35rem;
            color: #815f2e;
            font-weight: 700;
            margin-bottom: 0.8em;
            letter-spacing: 0.02em;
          }
          .outfit-items-list {
            display: flex;
            flex-wrap: wrap;
            gap: 1.2rem;
            justify-content: flex-start;
            margin-top: 0.5em;
          }
          .outfit-item-card {
            background: #fffdfa;
            border-radius: 18px;
            box-shadow: 0 2px 10px 0 rgba(178,148,84,0.11);
            padding: 1.2rem 1rem 1rem 1rem;
            width: 165px;
            min-height: 230px;
            text-align: center;
            border: 1.5px solid #f2e1c0;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            transition: transform 0.12s;
          }
          .outfit-item-card:hover {
            transform: translateY(-2px) scale(1.03);
            box-shadow: 0 6px 22px 0 rgba(178,148,84,0.16);
          }
          .outfit-item-img {
            width: 100%;
            height: 105px;
            object-fit: cover;
            border-radius: 7px;
            margin-bottom: 0.8em;
            background: #fcf4e6;
          }
          .outfit-item-placeholder {
            height: 105px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #b59d7a;
            font-size: 1.05em;
            background: #fcf4e6;
            border-radius: 7px;
            margin-bottom: 0.8em;
          }
          .outfit-item-label {
            font-weight: 600;
            font-size: 1.12em;
            margin-bottom: 0.18em;
            color: #7a5219;
          }
          .outfit-item-detail {
            font-size: 0.98em;
            color: #83694b;
            margin-bottom: 0.2em;
          }
        `}
      </style>
      {suggestion ? (
        <>
          <div className="outfit-header">
            <span role="img" aria-label="shirt"></span>Today’s Outfit
          </div>
          <div className="weather-details">
            <span style={{ fontWeight: 600 }}>Weather:</span> {suggestion.weather.temp}°C — {suggestion.weather.weatherMain}
          </div>
          <div className="tag-details">
            <span style={{ fontWeight: 600 }}>Suggested Tags:</span> {suggestion.tagsNeeded.join(', ')}
          </div>
          <div className="divider"></div>
          <div className="generated-items-header">
            <span role="img" aria-label="sparkles">✨</span>Generated Outfit Items
          </div>
          <div className="outfit-items-list">
            {suggestedOutfit.map(item => (
              <div className="outfit-item-card" key={item._id}>
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.type}
                    className="outfit-item-img"
                  />
                ) : (
                  <div className="outfit-item-placeholder">
                    {item.name || item.type || 'No Image'}
                  </div>
                )}
                <div className="outfit-item-label">{item.type}</div>
                <div className="outfit-item-detail">Color: {item.color}</div>
                <div className="outfit-item-detail">Formality: {item.formality}</div>
                <div className="outfit-item-detail">Warmth: {item.warmth}</div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <p style={{ fontSize: '1.13rem', color: '#b1722f', padding: '1.4em 0' }}>No suggestion found.</p>
      )}
    </div>
  );
}

export default GenerateOutfit;
