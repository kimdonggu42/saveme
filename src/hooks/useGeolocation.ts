'use client';

import { useState, useEffect } from 'react';
import { Coords } from '@/util/types';

type GeolocationStatus = 'idle' | 'loading' | 'success' | 'error';

export const defalutCoordinates = { lat: 37.5665, lng: 126.978 } as const;

const options = {
  enableHighAccuracy: false,
  maximumAge: 30000,
  timeout: 27000,
} as const;

export const useGeolocation = () => {
  const [currentMyCoordinates, setCurrentMyCoordinates] = useState<Coords | null>(null);
  const [geoStatus, setGeoStatus] = useState<GeolocationStatus>('idle');

  const getCurPosition = () => {
    const success = (location: { coords: { latitude: number; longitude: number } }) => {
      const newCoords = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };
      setCurrentMyCoordinates(newCoords);
      setGeoStatus('success');
    };

    const error = () => {
      setCurrentMyCoordinates(defalutCoordinates);
      setGeoStatus('error');
    };

    if (navigator.geolocation) {
      setGeoStatus('loading');
      navigator.geolocation.getCurrentPosition(success, error, options);
    }
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
