import Intro from "./pages/Intro";
import MainMap from "./pages/MainMap";
import GlobalStyle from "./assets/style/globalStyle";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className='App'>
      <GlobalStyle />
      <Routes>
        <Route path='/' element={<Intro />} />
        <Route path='/Map' element={<MainMap />} />
      </Routes>
    </div>
  );
}

export default App;
