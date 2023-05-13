import styled from "styled-components";
import { useState, useEffect } from "react";
import { UserLocationProps } from "../../util/type";
import axios from "axios";

const MapContainer = styled.div`
  width: 100vw;
  height: 700px;

  &:focus {
    outline: none;
  }
`;

function Map({ userLocation }: UserLocationProps) {
  const [locationData, setLocationData] = useState<any>([]);

  // 내 현재 위치에서 거리가 가까운 순으로 정렬한 데이터
  const sortedLocationData = [...locationData].sort((a: any, b: any) => a.DISTANCE - b.DISTANCE);
  // 정렬한 데이터 중 내 현재 위치에서 가장 가까운 화장실 100개만 필터링한 데이터
  const nearByLocationData = [...sortedLocationData].filter((value: any, index: number) => {
    if (index < 50) {
      return value;
    }
  });

  console.log(nearByLocationData);

  // 현재 내 위치와의 거리를 계산 해주는 함수
  const getDistance = (
    myLat: number,
    myLng: number,
    dataLat: number,
    dataLng: number,
    unit: string
  ) => {
    if (myLat === dataLat && myLng === dataLng) {
      return 0;
    } else {
      var radlat1 = (Math.PI * myLat) / 180;
      var radlat2 = (Math.PI * dataLat) / 180;
      var theta = myLng - dataLng;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      if (unit === "K") {
        dist = dist * 1.609344;
      }
      if (unit === "N") {
        dist = dist * 0.8684;
      }
      return dist;
    }
  };

  // 화장실 위치 데이터 GET 요청
  useEffect(() => {
    const getData = async () => {
      try {
        if (userLocation.lat !== 0 && userLocation.lng !== 0) {
          const res = await axios.get(
            `http://openAPI.seoul.go.kr:8088/${process.env.REACT_APP_SEOUL_PUBLIC_API_KEY}/json/SearchPublicToiletPOIService/1/1000/`
          );
          const resData = res.data.SearchPublicToiletPOIService.row;
          // get 해온 화장실 위치 데이터에 현재 내 위치와의 거리 DISTANCE 값 추가
          for (let i = 0; i < resData.length; i++) {
            const distance = getDistance(
              userLocation.lat,
              userLocation.lng,
              // 37.5666103,
              // 126.9783882,
              resData[i].Y_WGS84,
              resData[i].X_WGS84,
              "K"
            );
            resData[i].DISTANCE = distance;
          }
          setLocationData(resData);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getData();
  }, [userLocation]);

  // 현재 내 위치를 중심으로 하는 지도 생성
  useEffect(() => {
    const initMap = () => {
      if (userLocation.lat !== 0 && userLocation.lng !== 0) {
        const map = new naver.maps.Map("map", {
          center: new naver.maps.LatLng(userLocation.lat, userLocation.lng),
          // center: new naver.maps.LatLng(37.5666103, 126.9783882),
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
          // position: new naver.maps.LatLng(37.5666103, 126.9783882),
          map: map,
          icon: {
            url: "https://cdn.icon-icons.com/icons2/317/PNG/512/map-marker-icon_34392.png",
            size: new naver.maps.Size(40, 40),
            scaledSize: new naver.maps.Size(40, 40),
          },
        });
        // 화장실 위치 마커 표시
        nearByLocationData.map((value: any) => {
          return new naver.maps.Marker({
            position: new naver.maps.LatLng(value.Y_WGS84, value.X_WGS84),
            map: map,
          });
        });
      }
    };
    initMap();
  }, [nearByLocationData, userLocation]);

  return (
    <>
      <h1>지도</h1>
      <MapContainer id='map' />
    </>
  );
}

export default Map;
