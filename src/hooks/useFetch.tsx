import { useState, useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { currentMyLocationAtom, isDataLoadingAtom } from "../recoil/atom";
import { getDistance } from "../util/helperFunc";
import { PROXY_API } from "../util/api";
import { CurrentMyLocation, ToiletData } from "../util/interface";

const useFetch = (
  rowOneApi: string,
  rowTwoApi: string,
  rowThreeApi: string,
  rowFourApi: string,
  rowFiveApi: string
) => {
  const [toiletLocationData, setToiletLocationData] = useState<ToiletData[]>([]);

  const currentMyLocation = useRecoilValue<CurrentMyLocation>(currentMyLocationAtom);
  const setIsLoading = useSetRecoilState<boolean>(isDataLoadingAtom);

  useEffect(() => {
    const getData = async () => {
      try {
        if (currentMyLocation.lat !== 0 && currentMyLocation.lng !== 0) {
          const resOne = await PROXY_API.get(rowOneApi);
          const resTwo = await PROXY_API.get(rowTwoApi);
          const resThree = await PROXY_API.get(rowThreeApi);
          const resFour = await PROXY_API.get(rowFourApi);
          const resFive = await PROXY_API.get(rowFiveApi);
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
          // get 해온 화장실 위치 데이터에 현재 내 위치와의 거리 DISTANCE 프로퍼티 추가
          for (let i = 0; i < combineData.length; i++) {
            const distance = getDistance(
              currentMyLocation.lat,
              currentMyLocation.lng,
              combineData[i].Y_WGS84,
              combineData[i].X_WGS84,
              "K"
            );
            combineData[i].DISTANCE = distance;
          }
          setIsLoading(false);
          setToiletLocationData(combineData);
        }
      } catch (err) {
        setIsLoading(false);
        console.error(err);
      }
    };
    getData();
  }, [
    rowOneApi,
    rowTwoApi,
    rowThreeApi,
    rowFourApi,
    rowFiveApi,
    currentMyLocation,
    setToiletLocationData,
    setIsLoading,
  ]);

  return toiletLocationData;
};

export default useFetch;
