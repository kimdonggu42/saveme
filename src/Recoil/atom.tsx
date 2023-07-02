import { atom } from "recoil";
import { CurrentMyLocation } from "../util/interface";

// 현재 위치 정보
export const currentMyLocationAtom = atom<CurrentMyLocation>({
  key: "currentMyLocationAtom",
  default: {
    lat: 0,
    lng: 0,
  },
});

// 지도 렌더링 완료 여부
export const isMapLoadingAtom = atom<boolean>({
  key: "isMapLoadingAtom",
  default: true,
});

// 화장실 데이터 GET 요청 완료 여부
export const isDataLoadingAtom = atom<boolean>({
  key: "isDataLoadingAtom",
  default: true,
});
