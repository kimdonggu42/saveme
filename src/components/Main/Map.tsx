import styled from "styled-components";
import { useEffect } from "react";
import { CurrentMyLocation } from "../../util/type";
import { SlLocationPin } from "react-icons/sl";
import { useRecoilState } from "recoil";
import { currentMyLocationAtom } from "../../Recoil/atom";
import useFetch from "../hooks/useFetch";

const MapContainer = styled.div`
  width: 100vw;
  height: 700px;
  position: relative;

  &:focus {
    outline: none;
  }
`;

const RePositionButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 30px;
  height: 30px;
  z-index: 999;
  right: 10px;
  top: 200px;
  border: 1px solid black;
  position: absolute;
  background-color: white;
  cursor: pointer;

  > .positionIcon {
    margin: -2px;
  }
`;

function Map() {
  const [currentMyLocation, setCurrentMyLocation] =
    useRecoilState<CurrentMyLocation>(currentMyLocationAtom);

  // 전체 화장실 데이터
  const mergeToiletData = useFetch(
    `/1/1000`,
    `/1001/2000/`,
    `/2001/3000/`,
    `/3001/4000/`,
    `/4001/5000/`
  );
  // 내 현재 위치에서 거리가 가까운 순으로 정렬한 데이터
  const sortedToiletData = [...mergeToiletData].sort((a: any, b: any) => a.DISTANCE - b.DISTANCE);
  // 정렬한 데이터 중 내 현재 위치에서 가장 가까운 화장실 50개만 필터링한 데이터
  const nearByToiletData = [...sortedToiletData].filter((value: any, index: number) => {
    if (index < 50) {
      return value;
    }
  });

  // 현재 내 위치를 중심으로 하는 지도 생성
  useEffect(() => {
    const initMap = () => {
      if (currentMyLocation.lat !== 0 && currentMyLocation.lng !== 0 && nearByToiletData[0]) {
        const map = new naver.maps.Map("map", {
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
          map: map,
          icon: {
            url: "https://cdn-icons-png.flaticon.com/256/2344/2344085.png",
            size: new naver.maps.Size(40, 40),
            scaledSize: new naver.maps.Size(40, 40),
          },
        });

        // 현재 나와 제일 가까운 화장실의 마커 표시
        const myMarker = new naver.maps.Marker({
          position: new naver.maps.LatLng(nearByToiletData[0].Y_WGS84, nearByToiletData[0].X_WGS84),
          // position: new naver.maps.LatLng(37.5666103, 126.9783882),
          map: map,
          icon: {
            url: "https://cdn-icons-png.flaticon.com/512/5695/5695144.png",
            size: new naver.maps.Size(35, 35),
            scaledSize: new naver.maps.Size(35, 35),
          },
        });

        // 나머지 화장실 위치 마커 표시
        nearByToiletData.filter((value: any) => {
          if (nearByToiletData.indexOf(value) !== 0) {
            new naver.maps.Marker({
              position: new naver.maps.LatLng(value.Y_WGS84, value.X_WGS84),
              map: map,
              icon: {
                url: "https://cdn-icons-png.flaticon.com/512/5695/5695154.png",
                size: new naver.maps.Size(35, 35),
                scaledSize: new naver.maps.Size(35, 35),
              },
            });
          }
        });

        // 현재 나와 가장 가까이 있는 화장실의 정보창 내용
        const contentString = [
          '<div style="padding: 10px;">',
          `   <div style="font-weight: bold; margin-bottom: 5px;">${nearByToiletData[0].FNAME}</div>`,
          `   <div style="font-size: 13px;">${nearByToiletData[0].ANAME}<div>`,
          "</div>",
        ].join("");

        // 정보창 생성
        const infowindow = new naver.maps.InfoWindow({
          content: contentString,
          maxWidth: 300,
          anchorSize: {
            width: 12,
            height: 14,
          },
        });

        // 정보창 이벤트 핸들러
        naver.maps.Event.addListener(myMarker, "click", function () {
          if (infowindow.getMap()) {
            infowindow.close();
          } else {
            infowindow.open(map, myMarker);
          }
        });
      }
    };

    initMap();
  }, [nearByToiletData, currentMyLocation]);

  // 현재 내 위치로 이동하는 이벤트 핸들러
  const rePositionMyLocation = () => {
    const success = (position: any) => {
      setCurrentMyLocation({
        // lat: position.coords.latitude,
        // lng: position.coords.longitude,
        lat: 37.5666103,
        lng: 126.9783882,
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
      <MapContainer id='map'>
        <RePositionButton onClick={rePositionMyLocation}>
          <SlLocationPin className='positionIcon' size={20} />
        </RePositionButton>
      </MapContainer>
    </>
  );
}

export default Map;
