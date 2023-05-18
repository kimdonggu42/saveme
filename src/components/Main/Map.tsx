import styled from "styled-components";
import { useEffect, useRef } from "react";
import { CurrentMyLocation, ToiletData } from "../../util/type";
import { SlLocationPin } from "react-icons/sl";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { currentMyLocationAtom, isLoadingAtom, isMapLoadingAtom } from "../../Recoil/atom";
import useFetch from "../hooks/useFetch";
import Spinner from "../common/Spinner";

const MapContainer = styled.div`
  width: 100vw;
  height: 92vh;
  position: relative;

  &:focus {
    outline: none;
  }
`;

const MainLogo = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  top: 10px;
  left: 10px;
  width: 100px;
  height: 35px;
  border: none;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  color: white;
  background-color: #2e87ec;
  position: absolute;
  z-index: 999;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 16px 0px;

  > span {
    font-weight: 600;
  }
`;

const RePositionButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  height: 35px;
  z-index: 999;
  left: 110px;
  top: 10px;
  border: none;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  position: absolute;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 16px 0px;
  cursor: pointer;

  > .positionIcon {
    margin: -2px;
  }
`;

function Map() {
  const [currentMyLocation, setCurrentMyLocation] =
    useRecoilState<CurrentMyLocation>(currentMyLocationAtom);

  const setIsMapLoading = useSetRecoilState<boolean>(isMapLoadingAtom);
  const isLoading = useRecoilValue<boolean>(isLoadingAtom);

  const mapRef = useRef<HTMLElement | null | any>(null);
  // 전체 화장실 데이터
  const mergeToiletData: ToiletData[] = useFetch(
    `/1/1000`,
    `/1001/2000/`,
    `/2001/3000/`,
    `/3001/4000/`,
    `/4001/5000/`
  );
  // 내 현재 위치에서 거리가 가까운 순으로 정렬한 데이터
  const sortedToiletData: ToiletData[] = [...mergeToiletData].sort(
    (a: any, b: any) => a.DISTANCE - b.DISTANCE
  );
  // 정렬한 데이터 중 내 현재 위치에서 가장 가까운 화장실 50개만 필터링한 데이터
  const nearByToiletData: ToiletData[] = [...sortedToiletData].filter(
    (value: ToiletData, index: number) => {
      if (index < 50) {
        return value;
      }
    }
  );

  // 현재 내 위치를 중심으로 하는 지도 생성 및 내 위치 마커 표시
  useEffect(() => {
    if (currentMyLocation.lat !== 0 && currentMyLocation.lng !== 0) {
      // 현재 내 위치를 중심으로 하는 지도 생성
      mapRef.current = new naver.maps.Map("map", {
        center: new naver.maps.LatLng(currentMyLocation.lat, currentMyLocation.lng),
        // center: new naver.maps.LatLng(37.5666103, 126.9783882),
        zoom: 15,
        minZoom: 10,
        zoomControl: true,
        mapTypeControl: true,
        zoomControlOptions: {
          position: naver.maps.Position.TOP_RIGHT,
        },
        logoControl: false,
        mapDataControl: false,
      });

      // 현재 내 위치 마커 표시
      new naver.maps.Marker({
        position: new naver.maps.LatLng(currentMyLocation.lat, currentMyLocation.lng),
        // position: new naver.maps.LatLng(37.5666103, 126.9783882),
        map: mapRef.current,
        icon: {
          url: "https://cdn-icons-png.flaticon.com/256/2344/2344085.png",
          size: new naver.maps.Size(40, 40),
          scaledSize: new naver.maps.Size(40, 40),
        },
      });
      setIsMapLoading(false);
    }
  }, [currentMyLocation, setIsMapLoading]);

  // 나와 제일 가까운 화장실과 나머지 인접한 49개의 화장실 마커 표시 및 정보창 생성
  useEffect(() => {
    if (currentMyLocation.lat !== 0 && currentMyLocation.lng !== 0 && nearByToiletData[0]) {
      // 현재 나와 제일 가까운 화장실의 마커 표시
      const closetMarker = new naver.maps.Marker({
        position: new naver.maps.LatLng(nearByToiletData[0].Y_WGS84, nearByToiletData[0].X_WGS84),
        // position: new naver.maps.LatLng(37.5666103, 126.9783882),
        map: mapRef.current,
        icon: {
          url: "https://cdn-icons-png.flaticon.com/512/5695/5695144.png",
          size: new naver.maps.Size(35, 35),
          scaledSize: new naver.maps.Size(35, 35),
        },
      });

      // 현재 나와 가장 가까이 있는 화장실의 정보창 생성
      const infoWindow = new naver.maps.InfoWindow({
        content: [
          '<div style="padding: 10px;">',
          `   <div style="font-weight: bold; margin-bottom: 5px;">${nearByToiletData[0].FNAME}</div>`,
          `   <div style="font-size: 13px;">${nearByToiletData[0].ANAME}<div>`,
          "</div>",
        ].join(""),
        maxWidth: 300,
        anchorSize: {
          width: 12,
          height: 14,
        },
      });

      // 현재 나와 가장 가까이 있는 화장실의 정보창 이벤트 핸들러
      naver.maps.Event.addListener(closetMarker, "click", () => {
        if (infoWindow.getMap()) {
          infoWindow.close();
        } else {
          infoWindow.open(mapRef.current, closetMarker);
        }
      });

      // 나머지 화장실 위치 마커가 담겨있는 배열
      const markers: object[] = [];
      // 나머지 화장실 정보창이 담겨있는 배열
      const infoWindows: any = [];

      for (let i = 1; i < nearByToiletData.length; i++) {
        // 나머지 화장실 위치 마커 생성
        const marker = new naver.maps.Marker({
          map: mapRef.current,
          position: new naver.maps.LatLng(nearByToiletData[i].Y_WGS84, nearByToiletData[i].X_WGS84),
          icon: {
            url: "https://cdn-icons-png.flaticon.com/512/5695/5695154.png",
            size: new naver.maps.Size(35, 35),
            scaledSize: new naver.maps.Size(35, 35),
          },
        });

        // 나머지 화장실의 정보창 생성
        const infoWindow = new naver.maps.InfoWindow({
          content: [
            '<div style="padding: 10px;">',
            `   <div style="font-weight: bold; margin-bottom: 5px;">${nearByToiletData[i].FNAME}</div>`,
            `   <div style="font-size: 13px;">${nearByToiletData[i].ANAME}<div>`,
            "</div>",
          ].join(""),
          maxWidth: 300,
          anchorSize: {
            width: 12,
            height: 14,
          },
        });

        markers.push(marker);
        infoWindows.push(infoWindow);
      }

      // 나머지 화장실 마커의 인덱스를 클로저 변수로 저장하는 이벤트 핸들러를 리턴하는 함수
      const getClickHandler = (index: number) => {
        return () => {
          if (infoWindows[index].getMap()) {
            infoWindows[index].close();
          } else {
            infoWindows[index].open(mapRef.current, markers[index]);
          }
        };
      };

      // 나머지 각 화장실의 정보창 이벤트 핸들러
      for (let i = 0; i < markers.length; i++) {
        naver.maps.Event.addListener(markers[i], "click", getClickHandler(i));
      }

      // 마커 숨김 함수
      const showMarker = (map: any, marker: any) => {
        if (marker.setMap()) return;
        marker.setMap(map);
      };

      // 마커 표시 함수
      const hideMarker = (map: any, marker: any) => {
        if (!marker.setMap()) return;
        marker.setMap(null);
      };

      // 마커 업데이트 유/무 판별 함수
      const updateMarkers = (map: any, markers: any) => {
        const mapBounds = map.getBounds();

        for (let i = 0; i < markers.length; i++) {
          const marker = markers[i];
          const position = marker.getPosition();

          if (mapBounds.hasLatLng(position)) {
            showMarker(map, marker);
          } else {
            hideMarker(map, marker);
          }
        }
      };

      // 지도 줌 인/아웃 시 마커 업데이트 이벤트 핸들러
      naver.maps.Event.addListener(mapRef.current, "zoom_changed", function () {
        updateMarkers(mapRef.current, markers);
      });
      // 지도 드래그 시 마커 업데이트 이벤트 핸들러
      naver.maps.Event.addListener(mapRef.current, "dragend", function () {
        updateMarkers(mapRef.current, markers);
      });
    }
  }, [nearByToiletData, currentMyLocation]);

  // 현재 내 위치로 이동하는 이벤트 핸들러
  const rePositionMyLocation = () => {
    const success = (position: any) => {
      setCurrentMyLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        // lat: 37.5666103,
        // lng: 126.9783882,
      });
    };
    const error = () => {
      setCurrentMyLocation({ lat: 37.5666103, lng: 126.9783882 });
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return (
    <>
      {isLoading && <Spinner />}
      <MapContainer id='map'>
        <MainLogo>
          save<span>me</span>
        </MainLogo>
        <RePositionButton onClick={rePositionMyLocation}>
          <SlLocationPin className='positionIcon' size={20} />
        </RePositionButton>
      </MapContainer>
    </>
  );
}

export default Map;
