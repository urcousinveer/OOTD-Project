// web/src/components/HomePage.jsx

import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import {
  getCurrentPositionAsync,
  fetchWeatherAsync,
} from '../services/LocationWeatherService';
import { getSuggestedOutfit } from '../services/OutfitService';

const Container = styled.div`
  text-align: center;
  margin-top: 40px;
`;

const Message = styled.p`
  text-align: center;
  margin-top: 40px;
  font-size: 16px;
`;

const City = styled.h2`
  margin-bottom: 8px;
`;

const Temperature = styled.p`
  font-size: 48px;
  margin: 4px 0;
`;

const Description = styled.p`
  text-transform: capitalize;
  margin: 4px 0 24px;
`;

const OutfitContainer = styled.div`
  margin-top: 24px;
`;

const OutfitTitle = styled.h3`
  margin-bottom: 8px;
`;

const OutfitText = styled.p`
  font-size: 18px;
  margin: 0;
`;

export default function HomePage() {
  const [weather, setWeather] = useState(null);
  const [status, setStatus] = useState('loading'); // 'loading' | 'error' | 'ready'
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const coords = await getCurrentPositionAsync();
        const data = await fetchWeatherAsync(coords);
        setWeather({
          city: data.name,
          temp: Math.round(data.main.temp),
          desc: data.weather[0].description,
        });
        setStatus('ready');
      } catch (e) {
        setError(e.message);
        setStatus('error');
      }
    })();
  }, []);

  if (status === 'loading') {
    return <Message>Loading weather…</Message>;
  }

  if (status === 'error') {
    return <Message>Could not load weather: {error}</Message>;
  }

  // weather is ready
  const outfit = getSuggestedOutfit(weather.temp, weather.desc);

  return (
    <Container>
      <City>Current Weather in {weather.city}</City>
      <Temperature>{weather.temp}°C</Temperature>
      <Description>{weather.desc}</Description>

      <OutfitContainer>
        <OutfitTitle>Suggested Outfit</OutfitTitle>
        <OutfitText>{outfit}</OutfitText>
      </OutfitContainer>
    </Container>
  );
}
