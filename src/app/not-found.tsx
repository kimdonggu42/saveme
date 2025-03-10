import Link from 'next/link';

export default function NotFound() {
  return (
    <main className='flex min-h-screen w-full flex-col break-keep bg-white'>
      <section className='flex flex-1 flex-col items-center justify-center bg-blue-50 px-4 py-28 text-center sm:px-6 lg:px-8'>
        <h1 className='mb-4 text-4xl font-bold text-blue-500 sm:text-5xl'>404</h1>
        <p className='mb-8 text-base text-gray-700 sm:text-lg'>
          요청하신 페이지를 찾을 수 없습니다.
        </p>
        <Link
          href='/'
          className='rounded-md bg-blue-500 px-6 py-3 text-base font-semibold text-white shadow-md hover:bg-blue-600'
        >
          홈으로 돌아가기
        </Link>
      </section>
    </main>
  );
}
