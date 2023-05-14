export interface UserLocation {
  lat: number;
  lng: number;
}

export interface UserLocationProps {
  userLocation: UserLocation;
  setUserLocation: React.Dispatch<React.SetStateAction<UserLocation>>;
}
