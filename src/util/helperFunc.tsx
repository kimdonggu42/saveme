// 현재 내 위치와의 거리를 계산 해주는 함수
export const getDistance = (
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
