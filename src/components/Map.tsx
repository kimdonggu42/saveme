'use client';

import { IoMdLocate } from 'react-icons/io';
import { IoSearch } from 'react-icons/io5';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { IoIosClose } from 'react-icons/io';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { flushSync } from 'react-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRoot } from 'react-dom/client';
import Spinner from '@/components/Spinner';
import { useGeolocation } from '@/hooks/useGeolocation';
import { distanceCalculation } from '@/util/helpers/distanceCalculation';
import normalMap from '../../public/normal-map.png';
import terrainMap from '../../public/terrain-map.png';
import satelliteMap from '../../public/satellite-map.png';
import {
  MarkerInfoWindow,
  GeoCoderInfowindow,
  ClusterMarker10,
  ClusterMarker100,
  ClusterMarker200,
  ClusterMarker500,
  ClusterMarker1000,
} from '@/components/Markers';

declare const MarkerClustering: any;

type MapType = 'NORMAL' | 'TERRAIN' | 'SATELLITE' | 'HYBRID';

interface MapProps {
  toilets: Toilet[];
}

interface Toilet {
  POI_ID: string;
  ANAME: string;
  CENTER_X1: number;
  CENTER_Y1: number;
  CNAME: string;
  FNAME: string;
  INSERTDATE: string;
  UPDATEDATE: string;
  X_WGS84: number;
  Y_WGS84: number;
  DISTANCE: number;
}

const mapTypeButtonList = [
  {
    type: 'NORMAL',
    img: normalMap,
    label: '일반지도',
  },
  {
    type: 'TERRAIN',
    img: terrainMap,
    label: '지형도',
  },
  {
    type: 'HYBRID',
    img: satelliteMap,
    label: '위성지도',
  },
] as const;

export default function Map({ toilets }: MapProps) {
  const [selectedMapType, setSelectedMapType] = useState<MapType>('NORMAL');
  const [selectedPanoCoord, setSelectedPanoCoord] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const mapRef = useRef<naver.maps.Map | null>(null);
  const panoramaRef = useRef<HTMLDivElement | null>(null);
  const addressInputRef = useRef<HTMLInputElement | null>(null);

  const { currentMyCoordinates, isCoordinatesLoading, getCurPosition } = useGeolocation(() => {
    if (mapRef.current && currentMyCoordinates)
      mapRef.current.panTo(
        new naver.maps.LatLng(currentMyCoordinates.lat, currentMyCoordinates.lng),
      );
  });

  // 지도 초기화 + 마커 렌더링 + 클러스터링
  useEffect(() => {
    if (!currentMyCoordinates) return;

    if (!mapRef.current)
      mapRef.current = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(currentMyCoordinates.lat, currentMyCoordinates.lng),
        zoom: 18,
        minZoom: 12,
        mapDataControl: false,
      });

    new naver.maps.Marker({
      position: new naver.maps.LatLng(currentMyCoordinates.lat, currentMyCoordinates.lng),
      map: mapRef.current,
      icon: {
        url: '/current-location-marker.png',
        size: new naver.maps.Size(43, 43),
        scaledSize: new naver.maps.Size(43, 43),
      },
    });

    const toiletMarkers: naver.maps.Marker[] = [];
    // 가장 가까운 화장실 찾기
    const [closestToilet] = toilets
      .map((item) => ({
        ...item,
        DISTANCE: distanceCalculation(
          currentMyCoordinates.lat,
          currentMyCoordinates.lng,
          item.Y_WGS84,
          item.X_WGS84,
          'K',
        ),
      }))
      .sort((a, b) => a.DISTANCE - b.DISTANCE);

    // 마커와 정보창 생성
    toilets.forEach((toilet) => {
      const { Y_WGS84, X_WGS84, POI_ID, FNAME, ANAME } = toilet;

      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(Y_WGS84, X_WGS84),
        icon: {
          url: POI_ID === closestToilet.POI_ID ? '/closetToilet.png' : '/aroundToilet.png',
          size: new naver.maps.Size(35, 35),
          scaledSize: new naver.maps.Size(35, 35),
        },
      });
      toiletMarkers.push(marker);

      const infowindowNode = document.createElement('div');
      const root = createRoot(infowindowNode);

      const infoWindow = new naver.maps.InfoWindow({
        content: infowindowNode,
        anchorSize: {
          width: 12,
          height: 14,
        },
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      });

      naver.maps.Event.addListener(marker, 'click', () => {
        if (infoWindow.getMap()) {
          infoWindow.close();
        } else {
          const coords = new naver.maps.LatLng(Y_WGS84, X_WGS84);
          naver.maps.Service.reverseGeocode(
            {
              coords,
            },
            (status, response) => {
              if (status === naver.maps.Service.Status.OK && mapRef.current) {
                const { jibunAddress, roadAddress } = response.v2.address;
                flushSync(() => {
                  root.render(
                    <MarkerInfoWindow
                      FNAME={FNAME}
                      ANAME={ANAME}
                      jibunAddress={jibunAddress}
                      roadAddress={roadAddress}
                      onClickPanorama={() => {
                        handleOpenPanorama(Y_WGS84, X_WGS84);
                        if (mapRef.current) mapRef.current.panTo(coords);
                      }}
                    />,
                  );
                });

                infoWindow.open(mapRef.current, marker);
              }
            },
          );
        }
      });
    });

    // 마커 클러스터링에 사용할 아이콘(HTML 마커)들을 정의
    const htmlMarker1 = {
      content: renderToStaticMarkup(<ClusterMarker10 />),
      size: new naver.maps.Size(40, 40),
      anchor: new naver.maps.Point(20, 20),
    };
    const htmlMarker2 = {
      content: renderToStaticMarkup(<ClusterMarker100 />),
      size: new naver.maps.Size(40, 40),
      anchor: new naver.maps.Point(20, 20),
    };
    const htmlMarker3 = {
      content: renderToStaticMarkup(<ClusterMarker200 />),
      size: new naver.maps.Size(40, 40),
      anchor: new naver.maps.Point(20, 20),
    };
    const htmlMarker4 = {
      content: renderToStaticMarkup(<ClusterMarker500 />),
      size: new naver.maps.Size(40, 40),
      anchor: new naver.maps.Point(20, 20),
    };
    const htmlMarker5 = {
      content: renderToStaticMarkup(<ClusterMarker1000 />),
      size: new naver.maps.Size(40, 40),
      anchor: new naver.maps.Point(20, 20),
    };

    // 마커 클러스터링
    new MarkerClustering({
      map: mapRef.current,
      markers: toiletMarkers,
      disableClickZoom: false,
      minClusterSize: 5,
      maxZoom: 20,
      gridSize: 150,
      icons: [htmlMarker1, htmlMarker2, htmlMarker3, htmlMarker4, htmlMarker5],
      indexGenerator: [10, 100, 200, 500, 1000],
      averageCenter: false,
      stylingFunction: (clusterMarker: any, count: any) => {
        const el = clusterMarker.getElement().firstChild as HTMLElement | null;
        if (el) el.textContent = String(count);
      },
    });
  }, [currentMyCoordinates, toilets]);

  // 파노라마
  useEffect(() => {
    if (panoramaRef.current && selectedPanoCoord)
      new naver.maps.Panorama(panoramaRef.current, {
        position: new naver.maps.LatLng(selectedPanoCoord.lat, selectedPanoCoord.lng),
        pov: {
          pan: -135,
          tilt: 29,
          fov: 100,
        },
        flightSpot: false,
      });
  }, [selectedPanoCoord]);

  const handleOpenPanorama = (lat: number, lng: number) => setSelectedPanoCoord({ lat, lng });

  const handleClosePanorama = () => setSelectedPanoCoord(null);

  // 주소 -> 좌표 검색
  const searchAddressToCoordinate = (searchAddress: string) => {
    if (!searchAddress) return;

    naver.maps.Service.geocode({ query: searchAddress }, (status, response) => {
      if (!mapRef.current) return;

      if (status === naver.maps.Service.Status.ERROR) {
        alert('주소 검색 중 문제가 발생했습니다.');
        return;
      }

      if (response.v2.meta.totalCount === 0) {
        alert('검색 결과가 없습니다.');
        return;
      }

      const [addresses] = response.v2.addresses;
      const { roadAddress, jibunAddress, englishAddress, x, y } = addresses;
      const searchAddressCoordinate = new naver.maps.LatLng(Number(y), Number(x));

      const geoCoderInfowindow = new naver.maps.InfoWindow({
        content: renderToStaticMarkup(
          <GeoCoderInfowindow
            searchAddress={searchAddress}
            roadAddress={roadAddress}
            jibunAddress={jibunAddress}
            englishAddress={englishAddress}
          />,
        ),
        anchorSize: {
          width: 12,
          height: 14,
        },
        backgroundColor: 'transparent',
        borderColor: 'transparent',
      });

      // 지도 중심 이동 및 InfoWindow 오픈
      mapRef.current.panTo(searchAddressCoordinate);
      geoCoderInfowindow.open(mapRef.current, searchAddressCoordinate);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') searchAddressToCoordinate(addressInputRef.current?.value || '');
  };

  const handleSearchClick = () => searchAddressToCoordinate(addressInputRef.current?.value || '');

  const handleMapTypeChange = (mapType: MapType) => {
    if (mapRef.current && selectedMapType !== mapType) {
      mapRef.current.setMapTypeId(naver.maps.MapTypeId[mapType]);
      setSelectedMapType(mapType);
    }
  };

  const handleZoomIn = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      mapRef.current.setZoom(currentZoom + 1, true);
    }
  };

  const handleZoomOut = () => {
    if (mapRef.current) {
      const currentZoom = mapRef.current.getZoom();
      mapRef.current.setZoom(currentZoom - 1, true);
    }
  };

  return (
    <>
      {isCoordinatesLoading && <Spinner isLoading={isCoordinatesLoading} />}

      <div id='map' className='relative h-screen w-full p-3 focus:outline-none'>
        <div className='absolute z-10 flex h-11 w-full items-center'>
          <div className='z-10 hidden h-11 min-w-[100px] items-center justify-center rounded-bl-md rounded-tl-md bg-[#2e87ec] text-xl text-white shadow-md outline-none sm:flex'>
            save <span className='font-semibold'>me</span>
          </div>
          <div className='relative w-[calc(100%-24px)]'>
            <button className='absolute left-2 top-1/2 -translate-y-1/2 transform'>
              <IoSearch className='h-7 w-7 text-[#2e87ec]' onClick={handleSearchClick} />
            </button>
            <input
              className='h-11 w-full rounded-md pl-10 font-medium shadow-md focus:outline-none sm:w-[370px] sm:rounded-l-none sm:rounded-br-md sm:rounded-tr-md'
              ref={addressInputRef}
              type='text'
              placeholder='주소 검색'
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        <div className='absolute right-3 top-20 z-10 flex flex-col gap-y-2 md:top-3 md:flex-row md:gap-x-2'>
          {mapTypeButtonList.map((mapTypeButton) => (
            <button
              key={mapTypeButton.type}
              className={`w-16 rounded-md border bg-white shadow-md sm:w-20 ${
                selectedMapType === mapTypeButton.type ? 'border-[#2e87ec]' : 'border-gray-300'
              }`}
              onClick={() => handleMapTypeChange(mapTypeButton.type)}
            >
              <Image
                className='rounded-tl-md rounded-tr-md'
                src={mapTypeButton.img}
                alt='map img'
              />
              <div
                className={`py-1 text-[10px] font-semibold sm:text-xs ${
                  selectedMapType === mapTypeButton.type ? 'text-[#2e87ec]' : 'text-gray-700'
                }`}
              >
                {mapTypeButton.label}
              </div>
            </button>
          ))}
        </div>

        <div className='absolute right-3 top-80 z-10 sm:top-[350px] md:top-32'>
          <button
            className='group mb-3 flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white shadow-md outline-white'
            onClick={getCurPosition}
          >
            <IoMdLocate className='locateIcon text-gray-700' size={21} />
            <span className='absolute left-[-65px] top-[18px] hidden w-[60px] -translate-y-1/2 rounded-md bg-[#222222] p-1.5 text-center text-xs text-white shadow-md group-hover:block'>
              현재위치
            </span>
          </button>
          <div className='flex flex-col'>
            <button
              className='flex h-9 w-9 items-center justify-center rounded-tl-md rounded-tr-md border-x border-b-[0.5px] border-t border-gray-300 bg-white shadow-md outline-white'
              onClick={handleZoomIn}
            >
              <FiPlus className='locateIcon text-gray-700' size={21} />
            </button>
            <button
              className='flex h-9 w-9 items-center justify-center rounded-bl-md rounded-br-md border-x border-b border-t-[0.5px] border-gray-300 bg-white shadow-md outline-white'
              onClick={handleZoomOut}
            >
              <FiMinus className='locateIcon text-gray-700' size={21} />
            </button>
          </div>
        </div>

        {selectedPanoCoord && (
          <div
            className='absolute top-20 z-10 ml-auto aspect-video w-full max-w-full rounded-md shadow-md md:right-12 md:max-w-[550px]'
            ref={panoramaRef}
          >
            <button
              className='absolute right-2 top-2 z-10 rounded-full bg-[#000000B8]'
              onClick={handleClosePanorama}
            >
              <IoIosClose className='h-7 w-7 text-white' />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
