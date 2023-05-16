export type CurrentMyLocation = {
  lat: number;
  lng: number;
};

export interface CurrentMyLocationProps {
  userLocation: CurrentMyLocation;
  setUserLocation: React.Dispatch<React.SetStateAction<CurrentMyLocation>>;
}
