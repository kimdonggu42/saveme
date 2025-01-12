import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  return (
    <div className='flex h-screen items-center justify-center gap-x-16 bg-[#2e87ec]'>
      <div className='flex flex-col items-center gap-y-5'>
        <div className='text-8xl leading-none text-white'>
          save<span className='font-semibold'>me</span>
        </div>
        <div className='mr-24 text-lg text-white'>
          별도의 검색 없이 바로
          <br />내 주변의 화장실을 찾아보세요.
        </div>
        <Link href='/map'>
          <button className='h-12 w-80 overflow-hidden rounded-lg border-none bg-white [&>div]:hover:ml-20 [&>p]:hover:ml-16'>
            <p className='mt-[10px] text-lg font-bold text-[#1e2236] duration-300'>
              내 주변의 화장실 찾기
            </p>
            <div className='relative left-[-210px] mt-[-38px] h-12 w-52 bg-[#55b290] duration-300'>
              <p className='mr-[-130px] pt-[10px] text-lg font-bold text-white'>GO!</p>
            </div>
          </button>
        </Link>
      </div>
      <Image src='/mainImg.png' alt='메인 페이지 모바일 이미지' width='400' height='400' />
    </div>
  );
}
