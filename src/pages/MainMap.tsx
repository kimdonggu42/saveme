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
import { distanceCalculation } from "../util/helperFunc/distanceCalculation";
import { checkForMarkersRendering } from "../util/helperFunc/checkForMarkersRendering";
import { useState } from "react";

export default function MainMap() {
  const mapRef = useRef<naver.maps.Map | null>(null);

  const { currentMyLocation, locationLoading, getCurPosition } = useGeolocation();
  const { toiletData, dataLoading } = useGetData();

  const filterdToiletData = toiletData
    .map((item) => {
      const distance = distanceCalculation(
        currentMyLocation.lat,
        currentMyLocation.lng,
        item.Y_WGS84,
        item.X_WGS84,
        "K"
      );
      return { ...item, DISTANCE: distance };
    })
    .sort((a, b) => a.DISTANCE - b.DISTANCE)
    .filter((_, index) => {
      return index < 100;
    });

  useEffect(() => {
    if (currentMyLocation.lat !== 0 && currentMyLocation.lng !== 0) {
      mapRef.current = new naver.maps.Map("map", {
        center: new naver.maps.LatLng(currentMyLocation.lat, currentMyLocation.lng),
        zoom: 15,
        minZoom: 15,
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
          url: myMarker,
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
        let iconUrl: any = aroundToilet;

        if (i === 0) {
          iconUrl = closetToilet;
        }

        const marker = new naver.maps.Marker({
          map: mapRef.current,
          position: new naver.maps.LatLng(
            filterdToiletData[i].Y_WGS84,
            filterdToiletData[i].X_WGS84
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

      // 지도 줌 인/아웃 시 마커 업데이트 이벤트 핸들러
      naver.maps.Event.addListener(mapRef.current, "zoom_changed", () => {
        if (mapRef.current !== null) {
          checkForMarkersRendering(mapRef.current, markers);
        }
      });
      // 지도 드래그 시 마커 업데이트 이벤트 핸들러
      naver.maps.Event.addListener(mapRef.current, "dragend", () => {
        if (mapRef.current !== null) {
          checkForMarkersRendering(mapRef.current, markers);
        }
      });
    }
  }, [filterdToiletData, currentMyLocation]);

  return (
    <>
      {(locationLoading || dataLoading) && <Spinner locationLoading={locationLoading} />}
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
