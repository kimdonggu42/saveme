'use client';

import { IoMdLocate } from 'react-icons/io';
import { IoSearch } from 'react-icons/io5';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import Spinner from '@/components/Spinner';
import { useGetToilets } from '@/hooks/useGetToilets';
import { useGeolocation } from '@/hooks/useGeolocation';
import { distanceCalculation } from '@/util/helpers/distanceCalculation';
import normalMap from '../../../public/normal-map.png';
import terrainMap from '../../../public/terrain-map.png';
import satelliteMap from '../../../public/satellite-map.png';
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

export default function MainMap() {
  const [selectedMapType, setSelectedMapType] = useState<MapType>('NORMAL');

  const mapRef = useRef<naver.maps.Map | null>(null);
  const addressInputRef = useRef<HTMLInputElement | null>(null);

  const { currentMyCoordinates, isCoordinatesLoading, getCurPosition } = useGeolocation();
  const { toilets, isToiletsLoading } = useGetToilets();

  const { lat, lng } = currentMyCoordinates;

  // 가장 가까운 화장실 찾기
  const [closestToilet] = toilets
    .map((item) => ({
      ...item,
      DISTANCE: distanceCalculation(lat, lng, item.Y_WGS84, item.X_WGS84, 'K'),
    }))
    .sort((a, b) => a.DISTANCE - b.DISTANCE);

  // 지도 초기화
  useEffect(() => {
    if (lat !== 0 && lng !== 0) {
      mapRef.current = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(lat, lng),
        zoom: 18,
        minZoom: 12,
        mapDataControl: false,
      });

      // 현재 내 위치를 표시하는 마커
      new naver.maps.Marker({
        position: new naver.maps.LatLng(lat, lng),
        map: mapRef.current,
        icon: {
          url: '/current-location-marker.png',
          size: new naver.maps.Size(43, 43),
          scaledSize: new naver.maps.Size(43, 43),
        },
      });
    }
  }, [currentMyCoordinates]);

  // 화장실 마커 + 클러스터링 적용
  useEffect(() => {
    if (lat !== 0 && lng !== 0 && toilets.length !== 0 && mapRef.current) {
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

      // 1) 화장실 마커 생성
      const markers: naver.maps.Marker[] = [];
      const infoWindows: naver.maps.InfoWindow[] = [];

      toilets.forEach((toilet) => {
        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(toilet.Y_WGS84, toilet.X_WGS84),
          icon: {
            url: toilet.POI_ID === closestToilet.POI_ID ? '/closetToilet.png' : '/aroundToilet.png',
            size: new naver.maps.Size(35, 35),
            scaledSize: new naver.maps.Size(35, 35),
          },
        });

        // 정보창
        const infoWindow = new naver.maps.InfoWindow({
          content: renderToStaticMarkup(
            <MarkerInfoWindow FNAME={toilet.FNAME} ANAME={toilet.ANAME} />,
          ),
          anchorSize: {
            width: 12,
            height: 14,
          },
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        });

        markers.push(marker);
        infoWindows.push(infoWindow);
      });

      // 2) 마커 클릭 시 정보창 열기/닫기
      markers.forEach((marker, i) => {
        naver.maps.Event.addListener(marker, 'click', () => {
          if (infoWindows[i].getMap()) {
            infoWindows[i].close();
          } else if (mapRef.current !== null) {
            infoWindows[i].open(mapRef.current, marker);
          }
        });
      });

      // 3) MarkerClustering 생성
      const markerClustering = new MarkerClustering({
        map: mapRef.current,
        markers,
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
    }
  }, [toilets, currentMyCoordinates]);

  // 주소 -> 좌표 검색 기능
  const searchAddressToCoordinate = (searchAddress: string) => {
    if (!searchAddress) return;
    const naverMaps = window.naver.maps;

    naverMaps.Service.geocode({ query: searchAddress }, (status, response) => {
      if (!mapRef.current) return;

      if (status === naverMaps.Service.Status.ERROR) {
        alert('주소 검색 중 문제가 발생했습니다.');
        return;
      }

      if (response.v2.meta.totalCount === 0) {
        alert('검색 결과가 없습니다.');
        return;
      }

      const item = response.v2.addresses[0];
      const { roadAddress, jibunAddress, englishAddress } = item;
      const searchAddressCoordinate = new naverMaps.Point(Number(item.x), Number(item.y));

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
      mapRef.current.setCenter(searchAddressCoordinate);
      geoCoderInfowindow.open(mapRef.current, searchAddressCoordinate);
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') searchAddressToCoordinate(addressInputRef.current?.value || '');
  };

  const handleSearchClick = () => searchAddressToCoordinate(addressInputRef.current?.value || '');

  const handleMapTypeChange = (mapType: MapType) => {
    if (mapRef.current && selectedMapType !== mapType) {
      mapRef.current.setMapTypeId(window.naver.maps.MapTypeId[mapType]);
      setSelectedMapType(mapType);
    }
  };

  return (
    <>
      {(isCoordinatesLoading || isToiletsLoading) && <Spinner isLoading={isCoordinatesLoading} />}

      <div id='map' className='relative h-screen w-screen focus:outline-none'>
        <div className='absolute top-3 z-10 flex h-11 w-full items-center px-3 sm:left-3 sm:p-0'>
          <div className='z-10 hidden h-11 min-w-[100px] items-center justify-center rounded-bl-md rounded-tl-md bg-[#2e87ec] text-xl text-white shadow-md outline-none sm:flex'>
            save <span className='font-semibold'>me</span>
          </div>
          <div className='relative w-full'>
            <button className='absolute left-2 top-1/2 -translate-y-1/2 transform'>
              <IoSearch className='h-7 w-7 text-[#2e87ec]' onClick={handleSearchClick} />
            </button>
            <input
              className='h-11 w-full rounded-md border-2 border-[#2e87ec] pl-10 font-medium shadow-md focus:outline-none sm:w-[370px] sm:rounded-l-none sm:rounded-br-md sm:rounded-tr-md'
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
              className={`w-16 rounded-md border-[1.5px] border-solid bg-white shadow-md sm:w-20 ${
                selectedMapType === mapTypeButton.type ? 'border-[#2e87ec]' : 'border-gray-400'
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

        <button
          onClick={getCurPosition}
          className='group absolute right-3 top-72 z-10 flex h-9 w-10 items-center justify-center rounded-md border-[1.5px] border-gray-400 bg-white shadow-md outline-white sm:top-80 md:top-24'
        >
          <IoMdLocate className='locateIcon text-gray-700' size={21} />
          <span className='absolute left-[-70px] top-1/2 hidden w-[60px] -translate-y-1/2 rounded-md bg-[#222222] p-1.5 text-center text-xs text-white shadow-md group-hover:block'>
            현재위치
          </span>
        </button>
      </div>
    </>
  );
}
