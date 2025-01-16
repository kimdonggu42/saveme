'use client';

import { IoMdLocate } from 'react-icons/io';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import Spinner from '@/components/Spinner';
import { useGetToilets } from '@/hooks/useGetToilets';
import { useGeolocation } from '@/hooks/useGeolocation';
import { distanceCalculation } from '@/util/helpers/distanceCalculation';

declare const MarkerClustering: any;

export default function MainMap() {
  const mapRef = useRef<naver.maps.Map | null>(null);

  const { currentMyCoordinates, isCoordinatesLoading, getCurPosition } = useGeolocation();
  const { toilets, isToiletsLoading } = useGetToilets();

  const { lat, lng } = currentMyCoordinates;

  // 화장실 데이터 중 가까운 순으로 100개만 추출
  const filterdToilets = toilets
    .map((item) => {
      const distance = distanceCalculation(lat, lng, item.Y_WGS84, item.X_WGS84, 'K');
      return { ...item, DISTANCE: distance };
    })
    .sort((a, b) => a.DISTANCE - b.DISTANCE)
    .filter((_, index) => index < 100);

  // 지도 초기화
  useEffect(() => {
    if (lat !== 0 && lng !== 0) {
      mapRef.current = new naver.maps.Map('map', {
        center: new naver.maps.LatLng(lat, lng),
        zoom: 15,
        minZoom: 12,
        zoomControl: true,
        mapTypeControl: true,
        zoomControlOptions: {
          position: naver.maps.Position.TOP_RIGHT,
        },
        logoControl: false,
        mapDataControl: false,
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
  }, [lat, lng]);

  // 화장실 마커 + 클러스터링 적용
  useEffect(() => {
    if (lat !== 0 && lng !== 0 && filterdToilets.length !== 0 && mapRef.current) {
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

      for (let i = 0; i < filterdToilets.length; i++) {
        let iconUrl: string = '/aroundToilet.png';
        if (i === 0) iconUrl = '/closetToilet.png'; // 첫 번째(가장 가까운) 화장실 아이콘

        const marker = new naver.maps.Marker({
          position: new naver.maps.LatLng(filterdToilets[i].Y_WGS84, filterdToilets[i].X_WGS84),
          icon: {
            url: iconUrl,
            size: new naver.maps.Size(35, 35),
            scaledSize: new naver.maps.Size(35, 35),
          },
        });

        // 정보창
        const infoWindow = new naver.maps.InfoWindow({
          content: `
            <div style="padding: 10px; box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 16px 0px;">
              <div style="font-weight: bold; margin-bottom: 5px;">${filterdToilets[i].FNAME}</div>
              <div style="font-size: 13px;">${filterdToilets[i].ANAME}</div>
            </div>
          `,
          maxWidth: 300,
          anchorSize: {
            width: 12,
            height: 14,
          },
          borderColor: '#cecdc7',
        });

        markers.push(marker);
        infoWindows.push(infoWindow);
      }

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
        minClusterSize: 5, // 최소 몇 개부터 하나의 클러스터로 묶을지
        maxZoom: 20, // 어디까지 확대하면 클러스터 해제하고 개별 마커를 보일지
        map: mapRef.current,
        markers,
        disableClickZoom: false,
        gridSize: 120, //  마커를 클러스터로 인식하는 “범위”의 픽셀 크기
        icons: [htmlMarker1, htmlMarker2, htmlMarker3, htmlMarker4, htmlMarker5],
        indexGenerator: [10, 100, 200, 500, 1000], // 클러스터 개수별로 어떤 아이콘을 표시할지
        stylingFunction: (clusterMarker: any, count: any) => {
          // clusterMarker.getElement()를 통해 실제 HTML 요소에 접근 가능
          const el = clusterMarker.getElement().firstChild as HTMLElement | null;
          if (el) el.textContent = String(count);
        },
      });
    }
  }, [filterdToilets, currentMyCoordinates]);

  return (
    <>
      {(isCoordinatesLoading || isToiletsLoading) && <Spinner isLoading={isCoordinatesLoading} />}
      <div id='map' className='relative h-screen w-screen focus:outline-none'>
        <Link href='/'>
          <div className='absolute left-[10px] top-[10px] z-10 flex h-[35px] w-[100px] cursor-pointer items-center justify-center rounded-l rounded-t bg-[#2e87ec] shadow-md outline-none'>
            <div className='text-lg text-white'>
              save<span className='font-semibold'>me</span>
            </div>
          </div>
        </Link>
        <button
          onClick={getCurPosition}
          className='absolute left-[110px] top-[10px] z-10 flex h-[35px] w-[40px] items-center justify-center border-none bg-white shadow-md outline outline-[0.5px] outline-white [&>p]:hover:top-[45px] [&>p]:hover:block'
        >
          <IoMdLocate className='locateIcon' size={21} />
          <p className='color-white absolute hidden w-[60px] rounded bg-[#222222] p-1.5 text-center text-xs text-white shadow-md before:absolute before:left-[25px] before:top-[-10px] before:border-[5px] before:border-solid before:border-[#222222] before:border-transparent'>
            현재위치
          </p>
        </button>
      </div>
    </>
  );
}
