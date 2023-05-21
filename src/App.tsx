import MainIntro from "./components/Main/MainIntro";
import Map from "./pages/Map";
import GlobalStyle from "./assets/style/globalStyle";
import { useEffect } from "react";
import { currentMyLocationAtom } from "./Recoil/atom";
import { useSetRecoilState } from "recoil";
import { Routes, Route } from "react-router-dom";

function App() {
  const setCurrentMyLocation = useSetRecoilState(currentMyLocationAtom);

  // 내 현재 위치 계산
  useEffect(() => {
    // 내 현재 위치 값 번환 성공 시 실행 함수 -> 내 현재 위치 값을 currentMyLocationAtom에 저장
    const success = (location: { coords: { latitude: number; longitude: number } }) => {
      setCurrentMyLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    };
    // 내 현재 위치 값 반환 실패 시 실행 함수 -> 지도 중심을 서울시청 위치로 설정
    const error = () => {
      setCurrentMyLocation({ lat: 37.5666103, lng: 126.9783882 });
    };
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  }, [setCurrentMyLocation]);

  return (
    <div className='App'>
      <GlobalStyle />
      <Routes>
        <Route path='/' element={<MainIntro />} />
        <Route path='/Map' element={<Map />} />
      </Routes>
    </div>
  );
}

export default App;
