import Image from 'next/image';
import Link from 'next/link';
import { FiMapPin, FiSearch, FiMap } from 'react-icons/fi';

export default function MainPage() {
  return (
    <main className='min-h-screen w-full break-keep bg-white'>
      <section className='relative flex flex-col items-center justify-center bg-blue-50 px-4 py-20 text-center sm:px-6 lg:px-8'>
        <h1 className='mb-4 text-4xl font-bold text-blue-500 sm:text-5xl'>saveme</h1>
        <p className='mb-7 text-base text-gray-700 sm:text-lg'>
          갑자기 화장실이 급할 때, 바로 내 주변의 화장실을 찾아보세요.
        </p>
        <Link
          className='rounded-md bg-blue-500 px-6 py-3 text-base font-semibold text-white shadow-md hover:bg-blue-600'
          href='/map'
        >
          내 주변 화장실 찾기
        </Link>
        <div className='mt-8 flex items-center justify-center'>
          <div className='relative top-4 z-10'>
            <Image
              src='/images/main-mobile.png'
              alt='Mobile Image'
              width={160}
              height={400}
              className='rounded-lg'
            />
          </div>
          <div className='relative z-0 -ml-12'>
            <Image
              src='/images/main-tablet.png'
              alt='Tablet Image'
              width={500}
              height={300}
              className='rounded-lg'
            />
          </div>
        </div>
      </section>

      <section className='mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8'>
        <div className='grid gap-8 sm:grid-cols-3'>
          <div className='flex flex-col items-center'>
            <FiMapPin className='mb-4 h-10 w-10 text-blue-500' />
            <h3 className='mb-2 text-lg font-semibold text-gray-800'>내 위치 확인</h3>
            <p className='break-keep px-4 text-center text-sm text-gray-600'>
              현재 내 위치를 확인 후, 주변에서 가장 가까운 화장실을 찾을 수 있어요.
            </p>
          </div>
          <div className='flex flex-col items-center'>
            <FiMap className='mb-4 h-10 w-10 text-blue-500' />
            <h3 className='mb-2 text-lg font-semibold text-gray-800'>다양한 지도 옵션</h3>
            <p className='px-4 text-center text-sm text-gray-600'>
              지도 유형을 설정할 수 있고 화장실 주변 환경을 파노라마로 확인할 수 있어요.
            </p>
          </div>
          <div className='flex flex-col items-center'>
            <FiSearch className='mb-4 h-10 w-10 text-blue-500' />
            <h3 className='mb-2 text-lg font-semibold text-gray-800'>빠른 검색</h3>
            <p className='px-4 text-center text-sm text-gray-600'>
              주소나 지역명으로 검색하면 해당 지역 주변에 있는 화장실을 빠르게 찾을 수 있어요.
            </p>
          </div>
        </div>
      </section>

      <footer className='bg-blue-500 py-6 text-center text-white'>
        <p className='text-sm'>© {new Date().getFullYear()} saveme. All rights reserved.</p>
      </footer>
    </main>
  );
}
