import { atom } from "recoil";
import { CurrentMyLocation, ToiletData } from "../util/type";

export const currentMyLocationAtom = atom<CurrentMyLocation>({
  key: "currentMyLocationAtom",
  default: {
    lat: 0,
    lng: 0,
    // lat: 37.5666103,
    // lng: 126.9783882,
  },
});

export const toiletLocationDataAtom = atom<ToiletData[]>({
  key: "toiletLocationDataAtom",
  default: [],
});

export const isLoadingAtom = atom<boolean>({
  key: "isLoadingAtom",
  default: true,
});
