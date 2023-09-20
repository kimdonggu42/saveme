import MainIcon from "../assets/images/mainIcon.png";
import { LocationLoadingProps } from "../util/type";

export default function Spinner({ locationLoading }: LocationLoadingProps) {
  return (
    <div className='flex flex-col justify-center items-center w-screen h-screen bg-white'>
      <img
        src={MainIcon}
        alt='spinner'
        className='w-[150px] h-[150px] mb-[30px] animate-shake md:w-[250px] md:h-[250px]'
      />
      {locationLoading ? (
        <div className='text-[20px] font-semibold mt-[10px] md:text-[25px]'>
          현재 내 위치를 찾고 있어요
        </div>
      ) : (
        <div className='text-[20px] font-semibold mt-[10px] md:text-[25px]'>
          <div className='text-center'>
            내 주변의 화장실을 찾고 있어요
            <br />
            잠시만 기다려주세요
          </div>
        </div>
      )}
    </div>
  );
}
