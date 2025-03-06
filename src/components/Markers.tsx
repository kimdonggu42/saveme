import { FiMapPin } from 'react-icons/fi';

interface MarkerInfoWindowProps {
  FNAME: string;
  ANAME: string;
  jibunAddress: string;
  roadAddress: string;
  onClickPanorama: () => void;
}

interface GeoCoderInfowindowProps {
  roadAddress: string;
  jibunAddress: string;
  englishAddress: string;
}

export function CurrentMyLocationMarker() {
  return (
    <div className='relative flex h-6 w-6 items-center justify-center'>
      <div className='absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75' />
      <div className='relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]' />
    </div>
  );
}

export function MarkerInfoWindow({
  FNAME,
  ANAME,
  jibunAddress,
  roadAddress,
  onClickPanorama,
}: MarkerInfoWindowProps) {
  return (
    <div className='flex flex-col gap-y-1.5 whitespace-nowrap rounded-md border border-gray-200 bg-white px-5 py-4 shadow-[0_4px_16px_0_rgba(0,0,0,0.1)]'>
      <div className='flex items-center gap-x-2'>
        <p className='text-lg font-bold'>{FNAME}</p>
        <p className='text-sm font-medium text-gray-500'>{ANAME}</p>
      </div>
      {roadAddress && <div>(도로명) {roadAddress}</div>}
      {jibunAddress && (
        <div className='text-sm font-medium'>
          <span className='mr-1.5 rounded border border-gray-400 px-1 py-0.5 text-xs font-semibold text-gray-700'>
            지번
          </span>
          {jibunAddress}
        </div>
      )}
      <div className='flex justify-end'>
        <button
          className='mt-1 flex rounded-full border border-gray-300 p-1.5 text-gray-600 hover:border-blue-500 hover:text-blue-500'
          onClick={onClickPanorama}
        >
          <FiMapPin className='h-5 w-5' />
        </button>
      </div>
    </div>
  );
}

export function GeoCoderInfowindow({
  roadAddress,
  jibunAddress,
  englishAddress,
}: GeoCoderInfowindowProps) {
  return (
    <div className='flex flex-col gap-y-1.5 whitespace-nowrap rounded-md border border-gray-200 bg-white px-5 py-4 shadow-[0_4px_16px_0_rgba(0,0,0,0.1)]'>
      <p className='text-lg font-bold'>{roadAddress}</p>
      {jibunAddress && roadAddress !== jibunAddress && (
        <div className='text-sm font-medium'>
          <span className='mr-1.5 rounded border border-gray-400 px-1 py-0.5 text-xs font-semibold text-gray-700'>
            지번
          </span>
          {jibunAddress}
        </div>
      )}
      {jibunAddress && (
        <div className='text-sm font-medium'>
          <span className='mr-1.5 rounded border border-gray-400 px-1 py-0.5 text-xs font-semibold text-gray-700'>
            영문
          </span>
          {englishAddress}
        </div>
      )}
    </div>
  );
}

export function ClusterMarker10() {
  return (
    <div className='flex h-7 w-7 cursor-pointer items-center justify-center rounded-full bg-emerald-500 text-xs font-semibold text-white' />
  );
}

export function ClusterMarker100() {
  return (
    <div className='flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-emerald-600 text-xs font-semibold text-white' />
  );
}

export function ClusterMarker200() {
  return (
    <div className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-emerald-700 text-xs font-semibold text-white' />
  );
}

export function ClusterMarker500() {
  return (
    <div className='flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-emerald-800 text-xs font-semibold text-white' />
  );
}

export function ClusterMarker1000() {
  return (
    <div className='flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-emerald-900 text-xs font-semibold text-white' />
  );
}
