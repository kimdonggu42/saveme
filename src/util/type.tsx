export interface CurrentMyLocation {
  lat: number;
  lng: number;
}

export interface CurrentMyLocationProps {
  userLocation: CurrentMyLocation;
  setUserLocation: React.Dispatch<React.SetStateAction<CurrentMyLocation>>;
}

export type ToiletData = {
  POI_ID: string;
  ANAME: string;
  CENTER_X1: number;
  CENTER_Y1: number;
  CNAME: string;
  FNAME: string;
  INSERTDATE: string;
  UPDATEDATE: string;
  X_WGS84: number;
  Y_WGS84: number;
  DISTANCE?: number;
};
