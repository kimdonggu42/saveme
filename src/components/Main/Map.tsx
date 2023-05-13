import styled from "styled-components";
import { useEffect } from "react";
import dummyData from "../../testPosition";
import { UserLocationProps } from "../../util/type";

const MapContainer = styled.div`
  width: 100vw;
  height: 700px;

  &:focus {
    outline: none;
  }
`;

function Map({ userLocation }: UserLocationProps) {
  // 현재 내 위치를 중심으로 하는 지도 생성
  useEffect(() => {
    const initMap = () => {
      if (userLocation.lat !== 0 && userLocation.lng !== 0) {
        const map = new naver.maps.Map("map", {
          center: new naver.maps.LatLng(userLocation.lat, userLocation.lng),
          zoom: 11,
          zoomControl: true,
          zoomControlOptions: {
            position: naver.maps.Position.RIGHT_TOP,
          },
          logoControl: false,
          mapDataControl: false,
        });
        // 현재 내 위치 마커 표시
        new naver.maps.Marker({
          position: new naver.maps.LatLng(userLocation.lat, userLocation.lng),
          map: map,
          icon: {
            url: "https://cdn.icon-icons.com/icons2/317/PNG/512/map-marker-icon_34392.png",
            size: new naver.maps.Size(40, 40),
            scaledSize: new naver.maps.Size(40, 40),
          },
        });
        // 화장실들 위치 마커 표시
        dummyData.map((value: any) => {
          return new naver.maps.Marker({
            position: new naver.maps.LatLng(value.lat, value.lng),
            map: map,
          });
        });
      }
    };
    initMap();
  }, [userLocation]);

  return (
    <>
      <h1>지도</h1>
      <MapContainer id='map' />
    </>
  );
}

export default Map;
