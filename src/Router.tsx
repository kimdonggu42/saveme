import { BrowserRouter, Route, Routes } from "react-router-dom";
import Intro from "./pages/Intro";
import MainMap from "./pages/MainMap";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Intro />} />
        <Route path='/map' element={<MainMap />} />
      </Routes>
    </BrowserRouter>
  );
}
