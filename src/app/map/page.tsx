'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { IoMdLocate } from 'react-icons/io';
import { useGetData } from '@/hooks/useGetData';
import Spinner from '@/components/Spinner';
import { useGeolocation } from '@/hooks/useGeolocation';
import { distanceCalculation } from '@/util/helperFunc/distanceCalculation';
import { checkForMarkersRendering } from '@/util/helperFunc/checkForMarkersRendering';

export default function MainMap() {
  const mapRef = useRef<naver.maps.Map | null>(null);
  const router = useRouter();

  const { currentMyLocation, locationLoading, getCurPosition } = useGeolocation();
  const { toiletData, dataLoading } = useGetData();

  const filterdToiletData = toiletData
    .map((item) => {
      const distance = distanceCalculation(
        currentMyLocation.lat,
        currentMyLocation.lng,
        item.Y_WGS84,
        item.X_WGS84,
        'K',
      );
      return { ...item, DISTANCE: distance };
    })
    .sort((a, b) => a.DISTANCE - b.DISTANCE)
    .filter((_, index) => {
      return index < 100;
    });

  const moveIntroPage = () => {
    router.push('/');
  };

  useEffect(() => {
    if (typeof naver !== 'undefined' && naver.maps)
      if (currentMyLocation.lat !== 0 && currentMyLocation.lng !== 0) {
        mapRef.current = new naver.maps.Map('map', {
          center: new naver.maps.LatLng(currentMyLocation.lat, currentMyLocation.lng),
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

        new naver.maps.Marker({
          position: new naver.maps.LatLng(currentMyLocation.lat, currentMyLocation.lng),
          map: mapRef.current,
          icon: {
            url: '/myMarker.png',
            size: new naver.maps.Size(43, 43),
            scaledSize: new naver.maps.Size(43, 43),
          },
        });
      }
  }, [currentMyLocation]);

  useEffect(() => {
    if (
      currentMyLocation.lat !== 0 &&
      currentMyLocation.lng !== 0 &&
      filterdToiletData.length !== 0 &&
      mapRef.current !== null
    ) {
      const markers: naver.maps.Marker[] = [];
      const infoWindows: naver.maps.InfoWindow[] = [];

      for (let i = 0; i < filterdToiletData.length; i++) {
        let iconUrl: any = '/aroundToilet.png';

        if (i === 0) {
          iconUrl = '/closetToilet.png';
        }

        const marker = new naver.maps.Marker({
          map: mapRef.current,
          position: new naver.maps.LatLng(
            filterdToiletData[i].Y_WGS84,
            filterdToiletData[i].X_WGS84,
          ),
          icon: {
            url: iconUrl,
            size: new naver.maps.Size(35, 35),
            scaledSize: new naver.maps.Size(35, 35),
          },
        });

        const infoWindow = new naver.maps.InfoWindow({
          content: [
            '<div style="padding: 10px; box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 16px 0px;">',
            `   <div style="font-weight: bold; margin-bottom: 5px;">${filterdToiletData[i].FNAME}</div>`,
            `   <div style="font-size: 13px;">${filterdToiletData[i].ANAME}<div>`,
            '</div>',
          ].join(''),
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

      const getClickHandler = (index: number) => {
        return () => {
          if (infoWindows[index].getMap()) {
            infoWindows[index].close();
          } else if (mapRef.current !== null) {
            infoWindows[index].open(mapRef.current, markers[index]);
          }
        };
      };

      // 나머지 각 화장실의 정보창 이벤트 핸들러
      for (let i = 0; i < markers.length; i++) {
        naver.maps.Event.addListener(markers[i], 'click', getClickHandler(i));
      }

      // 지도 줌 인/아웃 시 마커 업데이트 이벤트 핸들러
      naver.maps.Event.addListener(mapRef.current, 'zoom_changed', () => {
        if (mapRef.current !== null) {
          checkForMarkersRendering(mapRef.current, markers);
        }
      });
      // 지도 드래그 시 마커 업데이트 이벤트 핸들러
      naver.maps.Event.addListener(mapRef.current, 'dragend', () => {
        if (mapRef.current !== null) {
          checkForMarkersRendering(mapRef.current, markers);
        }
      });
    }
  }, [filterdToiletData, currentMyLocation]);

  return (
    <>
      {(locationLoading || dataLoading) && <Spinner locationLoading={locationLoading} />}
      <div id='map' className='relative h-screen w-screen focus:outline-none'>
        <div
          onClick={moveIntroPage}
          className='absolute left-[10px] top-[10px] z-10 flex h-[35px] w-[100px] cursor-pointer items-center justify-center rounded-l rounded-t bg-[#2e87ec] shadow-md outline-none'
        >
          <div className='text-lg text-white'>
            save<span className='font-semibold'>me</span>
          </div>
        </div>
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
