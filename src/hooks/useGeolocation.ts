'use client';

import { useState, useEffect } from 'react';
import { Coords } from '@/util/types';

type GeolocationStatus = 'idle' | 'loading' | 'success' | 'error';

const DEFAULT_COORDINATES = { lat: 37.5665, lng: 126.978 } as const;

export const useGeolocation = (onSuccess?: (coords: Coords) => void) => {
  const [currentMyCoordinates, setCurrentMyCoordinates] = useState<Coords | null>(null);
  const [geoStatus, setGeoStatus] = useState<GeolocationStatus>('idle');

  const getCurPosition = () => {
    setGeoStatus('loading');

    const success = (location: { coords: { latitude: number; longitude: number } }) => {
      const newCoords = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
      setCurrentMyCoordinates(newCoords);
      if (onSuccess) onSuccess(newCoords);
      setGeoStatus('success');
    };

    const error = () => {
      setCurrentMyCoordinates(DEFAULT_COORDINATES);
      setGeoStatus('error');
    };

    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(success, error);
  };

  useEffect(() => {
    getCurPosition();
  }, []);

  return {
    currentMyCoordinates,
    geoStatus,
    getCurPosition,
  };
};
