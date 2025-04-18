import { useState, useEffect } from 'react';

const UseCurrentLocation = () => {
  const [location, setLocation] = useState({
    latitude: null,
    longitude: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    const getLocation = async () => {
      setLocation((prev) => ({ ...prev, loading: true }));

      try {
        const position = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          loading: false,
          error: null,
        });
      } catch (err) {
        setLocation({
          latitude: null,
          longitude: null,
          loading: false,
          error: 'Unable to fetch location. Please enable location services.',
        });
      }
    };

    getLocation();
  }, []);

  return location;
};

export default UseCurrentLocation;
