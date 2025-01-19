import Image from 'next/image';

interface LocationLoadingProps {
  isLoading?: boolean;
}

export default function Spinner({ isLoading }: LocationLoadingProps) {
  return (
    <div className='flex h-screen w-screen flex-col items-center justify-center bg-white'>
      <Image
        src='/mainIcon.png'
        alt='spinner'
        width='150'
        height='150'
        className='mb-[30px] animate-shake md:h-[250px] md:w-[250px]'
      />
      {isLoading ? (
        <div className='mt-[10px] text-[20px] font-semibold md:text-[25px]'>
          현재 내 위치를 찾고 있어요
        </div>
      ) : (
        <div className='mt-[10px] text-[20px] font-semibold md:text-[25px]'>
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
