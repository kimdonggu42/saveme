import { useState, useEffect } from "react";

export const useGeolocation = () => {
  const [currentMyLocation, setCurrentMyLocation] = useState({ lat: 0, lng: 0 });
  const [locationLoading, setLocationLoading] = useState(true);

  const getCurPosition = () => {
    const success = (location: { coords: { latitude: number; longitude: number } }) => {
      setCurrentMyLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      setLocationLoading(false);
    };

    const error = () => {
      setCurrentMyLocation({ lat: 33.450701, lng: 126.570667 });
      setLocationLoading(false);
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  useEffect(() => {
    getCurPosition();
  }, []);

  return {
    currentMyLocation,
    locationLoading,
    getCurPosition,
  };
};
