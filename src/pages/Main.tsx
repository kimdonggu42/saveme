import Header from "../components/Nav/Header";
import Map from "../components/Main/Map";
import { UserLocationProps } from "../util/type";

function Main({ userLocation }: UserLocationProps) {
  return (
    <>
      <Header />
      <Map userLocation={userLocation} />
    </>
  );
}

export default Main;
