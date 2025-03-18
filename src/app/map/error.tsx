'use client';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className='flex min-h-screen w-full flex-col break-keep bg-white'>
      <section className='flex flex-1 flex-col items-center justify-center bg-blue-50 px-4 py-28 text-center sm:px-6 lg:px-8'>
        <h1 className='mb-4 text-4xl font-bold text-blue-500 sm:text-5xl'>오류</h1>
        <p className='mb-8 text-base text-gray-700 sm:text-lg'>
          오류가 발생했습니다. 잠시 후 다시 시도해 주세요.
        </p>
        <button
          onClick={reset}
          className='rounded-md bg-blue-500 px-6 py-3 text-base font-semibold text-white shadow-md hover:bg-blue-600'
        >
          다시 시도하기
        </button>
      </section>
    </main>
  );
}
