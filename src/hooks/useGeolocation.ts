'use client';

import { useState, useEffect } from 'react';

const DEFAULT_COORDINATES = { lat: 33.450701, lng: 126.570667 } as const;

export const useGeolocation = (onSuccess?: () => void) => {
  const [currentMyCoordinates, setCurrentMyCoordinates] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isCoordinatesLoading, setIsCoordinatesLoading] = useState<boolean>(false);

  const getCurPosition = () => {
    setIsCoordinatesLoading(true);
    const success = (location: { coords: { latitude: number; longitude: number } }) => {
      setCurrentMyCoordinates({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      if (onSuccess) onSuccess();
      setIsCoordinatesLoading(false);
    };

    const error = () => {
      setCurrentMyCoordinates(DEFAULT_COORDINATES);
      setIsCoordinatesLoading(false);
    };

    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(success, error);
  };

  useEffect(() => {
    getCurPosition();
  }, []);

  return {
    currentMyCoordinates,
    isCoordinatesLoading,
    getCurPosition,
  };
};
