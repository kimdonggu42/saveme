'use client';

import { useState, useEffect } from 'react';
import { Coords } from '@/util/types';

const DEFAULT_COORDINATES = { lat: 37.5665, lng: 126.978 } as const;

export const useGeolocation = (onSuccess?: (coords: Coords) => void) => {
  const [currentMyCoordinates, setCurrentMyCoordinates] = useState<Coords | null>(null);
  const [isCoordinatesLoading, setIsCoordinatesLoading] = useState<boolean>(false);

  const getCurPosition = () => {
    setIsCoordinatesLoading(true);
    const success = (location: { coords: { latitude: number; longitude: number } }) => {
      const newCoords = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
      setCurrentMyCoordinates(newCoords);
      if (onSuccess) onSuccess(newCoords);
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
