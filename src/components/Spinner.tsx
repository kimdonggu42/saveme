import Image from 'next/image';

export default function Spinner() {
  return (
    <div className='flex h-dvh w-dvw flex-col items-center justify-center bg-white'>
      <Image
        src='/mainIcon.png'
        alt='spinner'
        width='150'
        height='150'
        className='mb-[30px] animate-shake md:h-[250px] md:w-[250px]'
      />
      <div className='mt-[10px] text-[20px] font-semibold md:text-[25px]'>
        현재 내 위치를 찾고 있어요
      </div>
    </div>
  );
}
