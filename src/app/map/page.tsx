'use client';

import { IoMdLocate } from 'react-icons/io';
import { IoSearch } from 'react-icons/io5';
import Image from 'next/image';
import { useState, useEffect, useRef } from 'react';
import Spinner from '@/components/Spinner';
import { useGetToilets } from '@/hooks/useGetToilets';
import { useGeolocation } from '@/hooks/useGeolocation';
import { distanceCalculation } from '@/util/helpers/distanceCalculation';
import normalMap from '../../../public/normal-map.png';
import terrainMap from '../../../public/terrain-map.png';
import satelliteMap from '../../../public/satellite-map.png';

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
      });

      // 현재 내 위치를 표시하는 마커
      new naver.maps.Marker({
        position: new naver.maps.LatLng(lat, lng),
        map: mapRef.current,
        icon: {
          url: '/myMarker.png',
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
        content:
          '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/cluster-marker-1.png);background-size:contain;"></div>',
        size: new naver.maps.Size(40, 40),
        anchor: new naver.maps.Point(20, 20),
      };
      const htmlMarker2 = {
        content:
          '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/cluster-marker-2.png);background-size:contain;"></div>',
        size: new naver.maps.Size(40, 40),
        anchor: new naver.maps.Point(20, 20),
      };
      const htmlMarker3 = {
        content:
          '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/cluster-marker-3.png);background-size:contain;"></div>',
        size: new naver.maps.Size(40, 40),
        anchor: new naver.maps.Point(20, 20),
      };
      const htmlMarker4 = {
        content:
          '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/cluster-marker-4.png);background-size:contain;"></div>',
        size: new naver.maps.Size(40, 40),
        anchor: new naver.maps.Point(20, 20),
      };
      const htmlMarker5 = {
        content:
          '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/cluster-marker-5.png);background-size:contain;"></div>',
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
          content: `
            <div style="padding: 10px; box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 16px 0px;">
              <div style="font-weight: bold; margin-bottom: 5px;">${toilet.FNAME}</div>
              <div style="font-size: 13px;">${toilet.ANAME}</div>
            </div>
          `,
          anchorSize: {
            width: 12,
            height: 14,
          },
          borderColor: '#cecdc7',
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
  const searchAddressToCoordinate = (address: string) => {
    if (!address) return;
    const naverMaps = window.naver.maps;

    naverMaps.Service.geocode({ query: address }, (status, response) => {
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
      const point = new naverMaps.Point(Number(item.x), Number(item.y));
      const htmlAddresses = [];

      if (item.roadAddress) htmlAddresses.push('[도로명 주소] ' + item.roadAddress);
      if (item.jibunAddress) htmlAddresses.push('[지번 주소] ' + item.jibunAddress);
      if (item.englishAddress) htmlAddresses.push('[영문명 주소] ' + item.englishAddress);

      const geoCoderInfowindow = new naver.maps.InfoWindow({
        content: `
          <div style="padding: 10px; box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 16px 0px;">
            <h4 style="margin-top:5px;">검색 주소: ${address}</h4><br/>
            ${htmlAddresses.join('<br/>')}
          </div>
        `,
        anchorSize: {
          width: 12,
          height: 14,
        },
        borderColor: '#cecdc7',
      });

      // 지도 중심 이동 및 InfoWindow 오픈
      mapRef.current.setCenter(point);
      geoCoderInfowindow.open(mapRef.current, point);
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
        <div className='absolute left-3 top-3 z-10 flex h-11 items-center'>
          <div className='z-10 flex h-11 w-[100px] items-center justify-center rounded-bl-md rounded-tl-md bg-[#2e87ec] text-xl text-white shadow-md outline-none'>
            save <span className='font-semibold'>me</span>
          </div>
          <div className='relative'>
            <button className='absolute left-2 top-1/2 -translate-y-1/2 transform'>
              <IoSearch className='h-7 w-7 text-[#2e87ec]' onClick={handleSearchClick} />
            </button>
            <input
              className='h-11 w-80 rounded-br-md rounded-tr-md border-2 border-[#2e87ec] pl-10 font-medium shadow-md focus:outline-none'
              ref={addressInputRef}
              type='text'
              placeholder='주소 검색'
              onKeyDown={handleKeyDown}
            />
          </div>
        </div>

        <div className='absolute right-3 top-3 z-10 flex gap-x-2'>
          {mapTypeButtonList.map((mapTypeButton) => (
            <button
              key={mapTypeButton.type}
              className={`w-20 rounded-md border-[1.5px] border-solid bg-white shadow-md ${selectedMapType === mapTypeButton.type ? 'border-[#2e87ec]' : 'border-gray-400'}`}
              onClick={() => handleMapTypeChange(mapTypeButton.type)}
            >
              <Image
                className='rounded-tl-md rounded-tr-md'
                src={mapTypeButton.img}
                alt='map img'
              />
              <div
                className={`py-1 text-xs font-semibold ${selectedMapType === mapTypeButton.type ? 'text-[#2e87ec]' : 'text-gray-700'}`}
              >
                {mapTypeButton.label}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={getCurPosition}
          className='group absolute right-3 top-24 z-10 flex h-9 w-10 items-center justify-center rounded-md border-[1.5px] border-gray-400 bg-white shadow-md outline-white'
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
