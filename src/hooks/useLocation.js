import { useEffect, useState } from 'react';
import * as Location from 'expo-location';

export default function useLocation() {
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission denied');
        return;
      }
      const { coords } = await Location.getCurrentPositionAsync({});
      setCoords({ lat: coords.latitude, lon: coords.longitude });
    })();
  }, []);

  return { coords, error };
}
