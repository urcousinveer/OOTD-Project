// src/services/OutfitSuggestionService.js
import { getCurrentPositionAsync, fetchWeatherAsync } from './LocationWeatherService';
import axios from 'axios';

/**
 * Combines location, weather, and outfit suggestion logic.
 */
export async function fetchOutfitSuggestions(email) {
  try {
    const coords = await getCurrentPositionAsync();
    const weather = await fetchWeatherAsync(coords);

    const response = await axios.post('http://localhost:5000/api/outfitsuggest', {
      email,
      coords,
      weatherMain: weather.weather[0].main,
      temp: weather.main.temp
    });

    return response.data;
  } catch (err) {
    console.error('Error fetching outfit suggestions:', err);
    throw err;
  }
}