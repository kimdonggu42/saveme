import styled from "styled-components";
import { useState, useEffect } from "react";
import { UserLocationProps } from "../../util/type";
import axios from "axios";
import { SlLocationPin } from "react-icons/sl";

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

function Map({ userLocation, setUserLocation }: UserLocationProps) {
  const [locationData, setLocationData] = useState<any>([]);

  // 내 현재 위치에서 거리가 가까운 순으로 정렬한 데이터
  const sortedLocationData = [...locationData].sort((a: any, b: any) => a.DISTANCE - b.DISTANCE);
  // 정렬한 데이터 중 내 현재 위치에서 가장 가까운 화장실 100개만 필터링한 데이터
  const nearByLocationData = [...sortedLocationData].filter((value: any, index: number) => {
    if (index < 50) {
      return value;
    }
  });

  // console.log(nearByLocationData);

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
      const radlat1 = (Math.PI * myLat) / 180;
      const radlat2 = (Math.PI * dataLat) / 180;
      const theta = myLng - dataLng;
      const radtheta = (Math.PI * theta) / 180;
      let dist =
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
          const resOne = await axios.get(
            `http://openAPI.seoul.go.kr:8088/${process.env.REACT_APP_SEOUL_PUBLIC_API_KEY}/json/SearchPublicToiletPOIService/1/1000/`
          );
          const resTwo = await axios.get(
            `http://openAPI.seoul.go.kr:8088/${process.env.REACT_APP_SEOUL_PUBLIC_API_KEY}/json/SearchPublicToiletPOIService/1001/2000/`
          );
          const resThree = await axios.get(
            `http://openAPI.seoul.go.kr:8088/${process.env.REACT_APP_SEOUL_PUBLIC_API_KEY}/json/SearchPublicToiletPOIService/2001/3000/`
          );
          const resFour = await axios.get(
            `http://openAPI.seoul.go.kr:8088/${process.env.REACT_APP_SEOUL_PUBLIC_API_KEY}/json/SearchPublicToiletPOIService/3001/4000/`
          );
          const resFive = await axios.get(
            `http://openAPI.seoul.go.kr:8088/${process.env.REACT_APP_SEOUL_PUBLIC_API_KEY}/json/SearchPublicToiletPOIService/4001/5000/`
          );
          const resDataOne = resOne.data.SearchPublicToiletPOIService.row;
          const resDataTwo = resTwo.data.SearchPublicToiletPOIService.row;
          const resDataThree = resThree.data.SearchPublicToiletPOIService.row;
          const resDataFour = resFour.data.SearchPublicToiletPOIService.row;
          const resDataFive = resFive.data.SearchPublicToiletPOIService.row;
          // 데이터 병합
          const combineData = [
            ...resDataOne,
            ...resDataTwo,
            ...resDataThree,
            ...resDataFour,
            ...resDataFive,
          ];
          // get 해온 화장실 위치 데이터에 현재 내 위치와의 거리 DISTANCE 값 추가
          for (let i = 0; i < combineData.length; i++) {
            const distance = getDistance(
              userLocation.lat,
              userLocation.lng,
              // 37.5666103,
              // 126.9783882,
              combineData[i].Y_WGS84,
              combineData[i].X_WGS84,
              "K"
            );
            combineData[i].DISTANCE = distance;
          }
          setLocationData(combineData);
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

  // 현재 내 위치로 이동하는 이벤트 핸들러
  const rePositionMyLocation = () => {
    const success = (position: any) => {
      setUserLocation({
        // lat: position.coords.latitude,
        // lng: position.coords.longitude,
        lat: 37.5666103,
        lng: 126.9783882,
      });
    };
    const error = () => {
      setUserLocation({ lat: 37.5666103, lng: 126.9783882 });
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
