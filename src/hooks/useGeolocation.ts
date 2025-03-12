'use client';

import { useState, useEffect } from 'react';
import { Coords } from '@/util/types';

type GeolocationStatus = 'idle' | 'loading' | 'success' | 'error';

const defalutCoordinates = { lat: 37.5665, lng: 126.978 } as const;

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
      alert('현재 위치 정보를 가져올 수 없습니다. 브라우저의 위치 접근 권한을 확인해 주세요.');
      setCurrentMyCoordinates(defalutCoordinates);
      setGeoStatus('error');
    };

    if (navigator.geolocation) {
      setGeoStatus('loading');
      navigator.geolocation.getCurrentPosition(success, error, options);
    } else {
      alert('브라우저가 위치 정보를 지원하지 않습니다.');
      setGeoStatus('idle');
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
