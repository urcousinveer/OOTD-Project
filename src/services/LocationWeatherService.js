// src/services/LocationWeatherService.js

const OPENWEATHER_API_KEY = '93d42de33df144236981522e7613bfc0'; // ← your key here

/**
 * Ask browser for location and resolve with { latitude, longitude }.
 */
export function getCurrentPositionAsync() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error('Geolocation not supported by this browser.'));
    }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        resolve({
          latitude: coords.latitude,
          longitude: coords.longitude,
        });
      },
      (err) => {
        // err.code 1 = permission denied, 2 = position unavailable, 3 = timeout
        reject(new Error(err.message || 'Failed to get position'));
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  });
}

/**
 * Fetch weather for given coords from OpenWeatherMap.
 */
export async function fetchWeatherAsync({ latitude, longitude }) {
  const url =
    `https://api.openweathermap.org/data/2.5/weather` +
    `?lat=${latitude}&lon=${longitude}` +
    `&units=metric&appid=${OPENWEATHER_API_KEY}`;

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Weather API error: ' + res.statusText);
  }
  return await res.json();
}
