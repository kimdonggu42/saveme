import styled from "styled-components";
import { useEffect, useRef } from "react";
import { IoMdLocate } from "react-icons/io";
import { Link } from "react-router-dom";
import { useGetData } from "../hooks/useGetData";
import Spinner from "../components/Spinner";
import myMarker from "../assets/images/myMarker.png";
import closetToilet from "../assets/images/closetToilet.png";
import aroundToilet from "../assets/images/aroundToilet.png";
import { useGeolocation } from "../hooks/useGeolocation";
import { getDistance } from "../util/helperFunc";

export default function MainMap() {
  const mapRef = useRef<naver.maps.Map | null>(null);

  const { currentMyLocation, getCurPosition } = useGeolocation();
  const { toiletData, dataLoading } = useGetData();

  const sortedToiletData = toiletData
    .map((item) => {
      const distance = getDistance(
        currentMyLocation.lat,
        currentMyLocation.lng,
        item.Y_WGS84,
        item.X_WGS84,
        "K"
      );
      return { ...item, DISTANCE: distance };
    })
    .sort((a, b) => a.DISTANCE - b.DISTANCE);

  // 현재 내 위치를 중심으로 하는 지도 생성 및 내 위치 마커 표시
  useEffect(() => {
    if (currentMyLocation.lat !== 0 && currentMyLocation.lng !== 0) {
      // 현재 내 위치를 중심으로 하는 지도 생성
      mapRef.current = new naver.maps.Map("map", {
        center: new naver.maps.LatLng(currentMyLocation.lat, currentMyLocation.lng),
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
        map: mapRef.current,
        icon: {
          url: `${myMarker}`,
          size: new naver.maps.Size(43, 43),
          scaledSize: new naver.maps.Size(43, 43),
        },
        zIndex: 999,
      });
      // setIsMapLoading(false);
    }
  }, [currentMyLocation]);

  // 나와 제일 가까운 화장실과 나머지 인접한 100개의 화장실 마커 표시 및 정보창 생성
  useEffect(() => {
    if (
      currentMyLocation.lat !== 0 &&
      currentMyLocation.lng !== 0 &&
      sortedToiletData[0] &&
      mapRef.current !== null
    ) {
      // 현재 나와 제일 가까운 화장실의 마커 표시
      const closetMarker = new naver.maps.Marker({
        position: new naver.maps.LatLng(sortedToiletData[0].Y_WGS84, sortedToiletData[0].X_WGS84),
        map: mapRef.current,
        icon: {
          url: `${closetToilet}`,
          size: new naver.maps.Size(40, 40),
          scaledSize: new naver.maps.Size(40, 40),
        },
        zIndex: 999,
      });

      // 현재 나와 가장 가까이 있는 화장실의 정보창 생성
      const infoWindow = new naver.maps.InfoWindow({
        content: [
          '<div style="padding: 10px; box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 16px 0px;">',
          `   <div style="font-weight: bold; margin-bottom: 5px;">${sortedToiletData[0].FNAME}</div>`,
          `   <div style="font-size: 13px;">${sortedToiletData[0].ANAME}<div>`,
          "</div>",
        ].join(""),
        maxWidth: 300,
        anchorSize: {
          width: 12,
          height: 14,
        },
        borderColor: "#cecdc7",
      });

      // 현재 나와 가장 가까이 있는 화장실의 정보창 이벤트 핸들러
      naver.maps.Event.addListener(closetMarker, "click", () => {
        if (infoWindow.getMap()) {
          infoWindow.close();
        } else if (mapRef.current !== null) {
          infoWindow.open(mapRef.current, closetMarker);
        }
      });

      // 나머지 화장실 위치 마커가 담겨있는 배열
      const markers: naver.maps.Marker[] = [];
      // 나머지 화장실 정보창이 담겨있는 배열
      const infoWindows: naver.maps.InfoWindow[] = [];

      // 내 현재 위치에서 가장 가까운 화장실 100개만 마커 생성
      for (let i = 1; i < 100; i++) {
        // 나머지 화장실 위치 마커 생성
        const marker = new naver.maps.Marker({
          map: mapRef.current,
          position: new naver.maps.LatLng(sortedToiletData[i].Y_WGS84, sortedToiletData[i].X_WGS84),
          icon: {
            url: `${aroundToilet}`,
            size: new naver.maps.Size(35, 35),
            scaledSize: new naver.maps.Size(35, 35),
          },
        });

        // 나머지 화장실의 정보창 생성
        const infoWindow = new naver.maps.InfoWindow({
          content: [
            '<div style="padding: 10px; box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 16px 0px;">',
            `   <div style="font-weight: bold; margin-bottom: 5px;">${sortedToiletData[i].FNAME}</div>`,
            `   <div style="font-size: 13px;">${sortedToiletData[i].ANAME}<div>`,
            "</div>",
          ].join(""),
          maxWidth: 300,
          anchorSize: {
            width: 12,
            height: 14,
          },
          borderColor: "#cecdc7",
        });

        markers.push(marker);
        infoWindows.push(infoWindow);
      }

      // 나머지 화장실 마커의 인덱스를 클로저 변수로 저장하는 이벤트 핸들러를 리턴하는 함수
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
        naver.maps.Event.addListener(markers[i], "click", getClickHandler(i));
      }

      // 마커 표시 함수
      const showMarker = (map: naver.maps.Map, marker: naver.maps.Marker) => {
        marker.setMap(map);
      };

      // 마커 숨김 함수
      const hideMarker = (marker: naver.maps.Marker) => {
        marker.setMap(null);
      };

      // 마커 업데이트 유/무 판별 함수
      const updateMarkers = (map: naver.maps.Map, markers: naver.maps.Marker[]) => {
        const mapBounds: any = map.getBounds();

        for (let i = 0; i < markers.length; i++) {
          const position = markers[i].getPosition();

          if (mapBounds.hasLatLng(position)) {
            showMarker(map, markers[i]);
          } else {
            hideMarker(markers[i]);
          }
        }
      };

      // 지도 줌 인/아웃 시 마커 업데이트 이벤트 핸들러
      naver.maps.Event.addListener(mapRef.current, "zoom_changed", () => {
        if (mapRef.current !== null) {
          updateMarkers(mapRef.current, markers);
        }
      });
      // 지도 드래그 시 마커 업데이트 이벤트 핸들러
      naver.maps.Event.addListener(mapRef.current, "dragend", () => {
        if (mapRef.current !== null) {
          updateMarkers(mapRef.current, markers);
        }
      });
    }
  }, [sortedToiletData, currentMyLocation]);

  return (
    <>
      {dataLoading && <Spinner />}
      <MapContainer id='map'>
        <Link to='/'>
          <MainLogo>
            <div className='title'>
              save<span>me</span>
            </div>
          </MainLogo>
        </Link>
        <RePositionButton onClick={getCurPosition}>
          <IoMdLocate className='locateIcon' size={21} />
          <p>현재위치</p>
        </RePositionButton>
      </MapContainer>
    </>
  );
}

const MapContainer = styled.div`
  width: 100vw;
  height: 100vh;
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
  outline: none;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
  color: white;
  background-color: #2e87ec;
  position: absolute;
  z-index: 999;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 16px 0px;

  > .title {
    margin-bottom: 3px;
    font-size: 18px;

    > span {
      font-weight: 600;
    }
  }
`;

const RePositionButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 35px;
  z-index: 999;
  left: 110px;
  top: 10px;
  border: none;
  outline: 0.5px solid #cecdc7;
  border-top-right-radius: 4px;
  border-bottom-right-radius: 4px;
  position: absolute;
  background-color: white;
  box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 16px 0px;
  cursor: pointer;

  > p {
    display: none;
    background-color: #222222;
    padding: 6px;
    text-align: center;
    width: 60px;
    position: absolute;
    border-radius: 4px;
    box-shadow: rgba(0, 0, 0, 0.1) 0px 4px 16px 0px;
    font-size: 12px;
    color: white;
    font-weight: 500;

    &::before {
      position: absolute;
      content: "";
      border: 5px solid transparent;
      border-bottom-color: #222222;
      top: -10px;
      left: 25px;
    }
  }

  &:hover {
    .locateIcon {
      opacity: 0.5;
    }
  }

  &:hover p {
    top: 45px;
    display: block;
  }
`;
