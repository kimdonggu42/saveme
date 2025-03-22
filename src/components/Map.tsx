'use client';

import { toast } from 'sonner';
import { IoSearch } from 'react-icons/io5';
import { FiPlus, FiMinus } from 'react-icons/fi';
import { IoIosClose, IoIosAlert, IoMdLocate } from 'react-icons/io';

import Image from 'next/image';
import { useState, useEffect, useRef, useMemo } from 'react';
import { flushSync } from 'react-dom';
import { renderToStaticMarkup } from 'react-dom/server';
import { createRoot } from 'react-dom/client';

import Spinner from '@/components/Spinner';
import Modal from '@/components/Modal';
import {
  CurrentMyLocationMarker,
  MarkerInfoWindow,
  GeoCoderInfowindow,
  ClusterMarker10,
  ClusterMarker100,
  ClusterMarker200,
  ClusterMarker500,
  ClusterMarker1000,
} from '@/components/Markers';
import { useGeolocation } from '@/hooks/useGeolocation';
import { defalutCoordinates } from '@/hooks/useGeolocation';
import { distanceCalculation } from '@/util/helpers/distanceCalculation';
import { Coords } from '@/util/types';
import normalMap from '../../public/images/normal-map.png';
import terrainMap from '../../public/images/terrain-map.png';
import satelliteMap from '../../public/images/satellite-map.png';

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

interface ClusterMarker {
  getElement(): HTMLElement;
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

const seoulBoundaryCoordinates = {
  north: 37.715133, // 최대 위도
  south: 37.413294, // 최소 위도
  east: 127.269311, // 최대 경도
  west: 126.734086, // 최소 경도
} as const;

export default function Map({ toilets }: MapProps) {
  const [selectedMapType, setSelectedMapType] = useState<MapType>('NORMAL');
  const [selectedPanoCoord, setSelectedPanoCoord] = useState<Coords | null>(null);
  const [mapCenterCoords, setMapCenterCoords] = useState<Coords | null>(null);
  const [isOutsideSeoul, setIsOutsideSeoul] = useState<boolean>(false);
  const [isSearchAddress, setIsSearchAddress] = useState<boolean>(false);

  const mapRef = useRef<naver.maps.Map | null>(null);
  const currentLocationMarkerRef = useRef<naver.maps.Marker | null>(null);
  const toiletInfoWindowsRef = useRef<naver.maps.InfoWindow[]>([]);
  const geoCoderInfowindowRef = useRef<naver.maps.InfoWindow | null>(null);
  const markerClusterRef = useRef<any>(null);
  const panoramaRef = useRef<HTMLDivElement | null>(null);
  const addressInputRef = useRef<HTMLInputElement | null>(null);

  const { currentMyCoordinates, geoStatus, getCurPosition } = useGeolocation();

  // 최초 내 위치(currentMyCoordinates)가 로드되면 mapCenterCoords를 currentMyCoordinates 값으로 변경
  useEffect(() => {
    if (currentMyCoordinates && !mapCenterCoords) setMapCenterCoords(currentMyCoordinates);
  }, [currentMyCoordinates, mapCenterCoords]);

  const toiletsWithDistance = useMemo(() => {
    if (!mapCenterCoords) return [];

    return toilets
      .map((toilet) => ({
        ...toilet,
        DISTANCE: distanceCalculation(
          mapCenterCoords.lat,
          mapCenterCoords.lng,
          toilet.Y_WGS84,
          toilet.X_WGS84,
          'K',
        ),
      }))
      .sort((a, b) => a.DISTANCE - b.DISTANCE)
      .slice(0, 100);
  }, [toilets, mapCenterCoords]);

  // 지도 초기화
  useEffect(() => {
    if (!mapCenterCoords || mapRef.current) return;

    mapRef.current = new naver.maps.Map('map', {
      center: new naver.maps.LatLng(mapCenterCoords.lat, mapCenterCoords.lng),
      zoom: 18,
      minZoom: 8,
      mapDataControl: false,
      disableKineticPan: false,
    });
  }, [mapCenterCoords]);

  // 마커 렌더링 및 클러스터링
  useEffect(() => {
    if (!mapRef.current || geoStatus === 'error') return;

    if (!toiletsWithDistance.length) {
      toast.error('화장실 데이터를 불러오는데 실패했습니다. 잠시 후 다시 시도해 주세요.', {
        icon: <IoIosAlert className='text-blue-500' size={20} />,
      });
      return;
    }

    const toiletMarkers: naver.maps.Marker[] = [];

    toiletsWithDistance.forEach((toilet) => {
      const { Y_WGS84, X_WGS84, FNAME, ANAME, DISTANCE } = toilet;

      const marker = new naver.maps.Marker({
        position: new naver.maps.LatLng(Y_WGS84, X_WGS84),
        icon: {
          url: '/images/aroundToilet.png',
          size: new naver.maps.Size(32, 32),
          scaledSize: new naver.maps.Size(32, 32),
          anchor: new naver.maps.Point(16, 16),
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
      toiletInfoWindowsRef.current.push(infoWindow);

      naver.maps.Event.addListener(marker, 'click', () => {
        if (infoWindow.getMap()) {
          infoWindow.close();
        } else {
          const coords = new naver.maps.LatLng(Y_WGS84, X_WGS84);
          naver.maps.Service.reverseGeocode({ coords }, (status, response) => {
            if (status === naver.maps.Service.Status.OK && mapRef.current) {
              const { jibunAddress, roadAddress } = response.v2.address;

              flushSync(() =>
                root.render(
                  <MarkerInfoWindow
                    FNAME={FNAME}
                    ANAME={ANAME}
                    jibunAddress={jibunAddress}
                    roadAddress={roadAddress}
                    DISTANCE={DISTANCE}
                    isSearchAddress={isSearchAddress}
                    onClickPanorama={() => {
                      handleOpenPanorama(Y_WGS84, X_WGS84);
                      if (mapRef.current) mapRef.current.panTo(coords);
                    }}
                  />,
                ),
              );

              infoWindow.open(mapRef.current, marker);
            }
          });
        }
      });
    });

    // 마커 클러스터링
    const clusterMarker10Icon = {
      content: renderToStaticMarkup(<ClusterMarker10 />),
      anchor: new naver.maps.Point(12, 12),
    };
    const clusterMarker100Icon = {
      content: renderToStaticMarkup(<ClusterMarker100 />),
      anchor: new naver.maps.Point(12, 12),
    };
    const clusterMarker200Icon = {
      content: renderToStaticMarkup(<ClusterMarker200 />),
      anchor: new naver.maps.Point(12, 12),
    };
    const clusterMarker500Icon = {
      content: renderToStaticMarkup(<ClusterMarker500 />),
      anchor: new naver.maps.Point(12, 12),
    };
    const clusterMarker1000Icon = {
      content: renderToStaticMarkup(<ClusterMarker1000 />),
      anchor: new naver.maps.Point(12, 12),
    };

    markerClusterRef.current = new MarkerClustering({
      map: mapRef.current,
      markers: toiletMarkers,
      disableClickZoom: false,
      minClusterSize: 5,
      maxZoom: 20,
      gridSize: 150,
      icons: [
        clusterMarker10Icon,
        clusterMarker100Icon,
        clusterMarker200Icon,
        clusterMarker500Icon,
        clusterMarker1000Icon,
      ],
      indexGenerator: [10, 100, 200, 500, 1000],
      averageCenter: false,
      stylingFunction: (clusterMarker: ClusterMarker, count: number) => {
        const el = clusterMarker.getElement().firstChild as HTMLElement | null;
        if (el) el.textContent = String(count);
      },
    });
  }, [toiletsWithDistance]);

  // mapCenterCoords가 서울 밖에 있는지 체크
  useEffect(() => {
    if (!mapCenterCoords) return;

    if (
      mapCenterCoords.lat > seoulBoundaryCoordinates.north ||
      mapCenterCoords.lat < seoulBoundaryCoordinates.south ||
      mapCenterCoords.lng < seoulBoundaryCoordinates.west ||
      mapCenterCoords.lng > seoulBoundaryCoordinates.east
    ) {
      setIsOutsideSeoul(true);
    } else {
      setIsOutsideSeoul(false);
    }
  }, [mapCenterCoords]);

  // 현재 위치 마커 업데이트
  useEffect(() => {
    if (geoStatus === 'error') {
      toast.error(
        '현재 위치 정보를 가져올 수 없습니다. 브라우저의 위치 접근 권한을 확인해 주세요.',
        {
          icon: <IoIosAlert className='text-blue-500' size={20} />,
        },
      );
      return;
    }

    if (!mapRef.current || geoStatus !== 'success' || !currentMyCoordinates) return;

    if (currentLocationMarkerRef.current) currentLocationMarkerRef.current.setMap(null);

    currentLocationMarkerRef.current = new naver.maps.Marker({
      position: new naver.maps.LatLng(currentMyCoordinates.lat, currentMyCoordinates.lng),
      map: mapRef.current,
      icon: {
        content: renderToStaticMarkup(<CurrentMyLocationMarker />),
        anchor: new naver.maps.Point(12, 12),
      },
    });
  }, [currentMyCoordinates, geoStatus, mapCenterCoords]);

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

  // 기존 마커와 클러스터 제거 함수
  const clearMapOverlays = () => {
    if (toiletInfoWindowsRef) {
      toiletInfoWindowsRef.current.forEach((toiletInfoWindow) => toiletInfoWindow.close());
      toiletInfoWindowsRef.current = [];
    }

    if (geoCoderInfowindowRef.current) {
      geoCoderInfowindowRef.current.close();
      geoCoderInfowindowRef.current = null;
    }

    if (markerClusterRef.current) {
      markerClusterRef.current.setMarkers([]);
      markerClusterRef.current.setMap(null);
      markerClusterRef.current = null;
    }
  };

  // 주소 검색
  const searchAddressToCoordinate = (searchAddress: string) => {
    const trimmedSearchAddress = searchAddress.trim();
    if (!trimmedSearchAddress) return;

    naver.maps.Service.geocode({ query: trimmedSearchAddress }, (status, response) => {
      if (!mapRef.current) return;

      if (status === naver.maps.Service.Status.ERROR) {
        toast.error('주소 검색 중 문제가 발생했어요.', {
          icon: <IoIosAlert className='text-blue-500' size={20} />,
        });
        return;
      }

      if (response.v2.meta.totalCount === 0) {
        toast.error('주소 검색 결과가 없어요.', {
          icon: <IoIosAlert className='text-blue-500' size={20} />,
        });
        return;
      }

      const [addresses] = response.v2.addresses;
      const { roadAddress, jibunAddress, englishAddress, x, y } = addresses;
      const searchAddressCoordinate = new naver.maps.LatLng(Number(y), Number(x));

      const geoCoderInfowindow = new naver.maps.InfoWindow({
        content: renderToStaticMarkup(
          <GeoCoderInfowindow
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

      setIsSearchAddress(true);

      clearMapOverlays();
      setMapCenterCoords({ lat: Number(y), lng: Number(x) });
      mapRef.current.panTo(searchAddressCoordinate);

      geoCoderInfowindow.open(mapRef.current, searchAddressCoordinate);
      geoCoderInfowindowRef.current = geoCoderInfowindow;
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

  const handleCurrentLocation = () => {
    getCurPosition();
    setIsSearchAddress(false);

    if (currentMyCoordinates && mapRef.current) {
      if (
        mapCenterCoords &&
        mapCenterCoords.lat === currentMyCoordinates.lat &&
        mapCenterCoords.lng === currentMyCoordinates.lng
      ) {
        // 현재 지도 중심이 내 위치일 때 현재 위치 버튼을 클릭할 경우 지도 중심만 내 위치로 이동
        mapRef.current.panTo(
          new naver.maps.LatLng(currentMyCoordinates.lat, currentMyCoordinates.lng),
        );
      } else {
        // 주소 검색으로 이동한 좌표와 현재 내 위치 좌표가 동일하지 않을 경우 검색한 주소 주변의 마커를 지운 후 내 위치로 이동
        clearMapOverlays();
        setMapCenterCoords(currentMyCoordinates);
        mapRef.current.panTo(
          new naver.maps.LatLng(currentMyCoordinates.lat, currentMyCoordinates.lng),
        );
      }
    }
  };

  return (
    <>
      {!currentMyCoordinates ? (
        <Spinner />
      ) : (
        <main>
          <div id='map' className='relative h-dvh w-full p-3 focus:outline-none'>
            <div className='absolute z-10 flex h-11 w-full items-center'>
              <div className='z-10 hidden h-11 min-w-[100px] items-center justify-center rounded-bl-md rounded-tl-md bg-blue-500 text-xl text-white shadow-md outline-none sm:flex'>
                save <span className='font-semibold'>me</span>
              </div>
              <div className='relative w-[calc(100%-24px)]'>
                <button
                  className='absolute left-2 top-1/2 -translate-y-1/2 transform'
                  onClick={handleSearchClick}
                >
                  <IoSearch className='h-7 w-7 text-blue-500' />
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
                    selectedMapType === mapTypeButton.type
                      ? 'border-[1.5px] border-blue-500'
                      : 'border-gray-300'
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
                      selectedMapType === mapTypeButton.type ? 'text-blue-500' : 'text-gray-700'
                    }`}
                  >
                    {mapTypeButton.label}
                  </div>
                </button>
              ))}
            </div>

            <div className='absolute bottom-11 right-3 z-10'>
              <button
                className='group mb-3 flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 bg-white shadow-md outline-white'
                onClick={handleCurrentLocation}
                disabled={geoStatus === 'loading'}
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
                className='absolute top-20 z-10 ml-auto aspect-video w-full max-w-full rounded-md shadow-md md:max-w-[550px]'
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
          <Modal
            isOpen={isOutsideSeoul}
            setIsOpen={setIsOutsideSeoul}
            title='현재 위치가 서울이 아닌 것 같아요.'
            description='saveme는 현재 서울 지역 내 화장실 정보만 제공됩니다. 서울 지도 보기로 전환할까요?'
            confirmText='전환하기'
            onConfirm={() => {
              if (mapRef.current) {
                clearMapOverlays();
                setMapCenterCoords(currentMyCoordinates || defalutCoordinates);
                mapRef.current.panTo(currentMyCoordinates || defalutCoordinates);
                setIsOutsideSeoul(false);
              }
            }}
          />
        </main>
      )}
    </>
  );
}
