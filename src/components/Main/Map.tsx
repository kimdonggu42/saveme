import { useState, useEffect } from "react";
import dummyData from "../../testPosition";

function Map() {
  // const [userLocation, setUserLocation] = useState({
  //   lat: 0,
  //   lng: 0,
  // });
  const initMap = (lat: number, lng: number) => {
    // 지도 옵션
    const mapOptions = {
      center: new naver.maps.LatLng(lat, lng),
      zoom: 11,
      zoomControl: true,
      zoomControlOptions: {
        position: naver.maps.Position.RIGHT_TOP,
      },
      logoControl: false,
      mapDataControl: false,
    };

    // 지도 생성
    const map = new naver.maps.Map("map", mapOptions);

    // 현재 내 위치 마커 표시
    new naver.maps.Marker({
      position: new naver.maps.LatLng(lat, lng),
      map: map,
    });

    // 화장실들 위치 마커 표시
    dummyData.map((value: any) => {
      return new naver.maps.Marker({
        position: new naver.maps.LatLng(value.lat, value.lng),
        map: map,
      });
    });
  };

  // 내 현재 위치
  useEffect(() => {
    const getCurrentLocation = () => {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        initMap(lat, lng);
      });
    };
    getCurrentLocation();
  }, []);

  const mapStyle = {
    width: "100%",
    height: "700px",
  };

  return (
    <>
      <h1>지도</h1>
      <div id='map' style={mapStyle} />
    </>
  );
}

export default Map;
