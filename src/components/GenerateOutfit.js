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

        console.log('Suggested Outfit:', response.data);
        setSuggestion(response.data); 
        setSuggestedOutfit(response.data.suggestions); // You need a state for this
      } catch (error) {
        console.error('Error generating outfit:', error.message);
      }
      finally {
  setLoading(false);
}

    };
    console.log('User:', user?.email);
console.log('Weather:', weather);

    fetchOutfit();
  }
}, [user, weather]);


  if (loading) return <p>Loading outfit suggestion...</p>;

  return (
    <div style={{ padding: '2rem' }}>
      {suggestion ? (
        <>
          <p><strong>Weather:</strong> {suggestion.weather.temp}°C - {suggestion.weather.weatherMain}</p>
          <p><strong>Suggested Tags:</strong> {suggestion.tagsNeeded.join(', ')}</p>
          <ul>
            {suggestion.suggestions.map(item => (
              <li key={item._id}>{item.name}</li>
            ))}
          </ul>
          <h2>Generated Outfit Items:</h2>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
          {suggestedOutfit.map(item => (
            <div
              key={item._id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '1rem',
                width: '150px',
                textAlign: 'center',
                backgroundColor: '#f9f9f9'
              }}
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.type}
                  style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px' }}
                />
              ) : (
                <div style={{ height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {item.name || item.type || 'No Image'}
                </div>
              )}
              <div><strong>{item.type}</strong></div>
              <div>Color: {item.color}</div>
              <div>Formality: {item.formality}</div>
              <div>Warmth: {item.warmth}</div>
            </div>
          ))}
        </div>
        </>
      ) : (
        <p>No suggestion found.</p>
      )}
    </div>
  );
}

export default GenerateOutfit;