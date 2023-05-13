import Main from "./pages/Main";
import { useState, useEffect } from "react";
import { UserLocation } from "./util/type";

function App() {
  const [userLocation, setUserLocation] = useState<UserLocation>({
    lat: 0,
    lng: 0,
  });
  console.log(userLocation);

  // 내 현재 위치 계산
  useEffect(() => {
    // 내 현재 위치 값 번환 성공 시 실행 함수 -> 내 현재 위치 값을 userLocation state에 저장
    const success = (position: any) => {
      setUserLocation({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      });
    };
    // 내 현재 위치 값 반홚 실패 시 실행 함수 -> 지도 중심을 서울시청 위치로 설정
    const error = () => {
      setUserLocation({ lat: 37.5666103, lng: 126.9783882 });
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }, []);

  return (
    <div className='App'>
      <Main userLocation={userLocation} />
    </div>
  );
}

export default App;
