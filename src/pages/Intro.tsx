import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import mainImg from "../assets/images/mainImg.png";

export default function Intro() {
  const navigate = useNavigate();

  const moveMapPage = () => {
    navigate("/map");
  };

  return (
    <div className='flex justify-center items-center gap-x-16 h-screen bg-[#2e87ec]'>
      <div className='flex flex-col items-center gap-y-5'>
        <div className='text-white text-8xl leading-none'>
          save<span className='font-semibold'>me</span>
        </div>
        <div className='mr-24 text-white text-lg'>
          별도의 검색 없이 바로
          <br />내 주변의 화장실을 찾아보세요.
        </div>
        <button
          onClick={moveMapPage}
          className='bg-white w-80 h-12 overflow-hidden border-none rounded-lg [&>p]:hover:ml-16 [&>div]:hover:ml-20'
        >
          <p className='mt-[10px] text-lg font-bold text-[#1e2236] duration-300'>
            내 주변의 화장실 찾기
          </p>
          <div className='relative w-52 h-12 mt-[-38px] bg-[#55b290] left-[-210px] duration-300'>
            <p className='pt-[10px] text-lg mr-[-130px] font-bold  text-white'>GO!</p>
          </div>
        </button>
      </div>
      <img src={mainImg} alt='메인 페이지 모바일 이미지' className='w-[400px] h-[540px]' />
    </div>
  );
}
