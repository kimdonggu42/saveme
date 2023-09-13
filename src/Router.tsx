import { Route, Routes } from "react-router-dom";
import Intro from "./pages/Intro";
import MainMap from "./pages/MainMap";

export default function Router() {
  return (
    <Routes>
      <Route path='/' element={<Intro />} />
      <Route path='/Map' element={<MainMap />} />
    </Routes>
  );
}
