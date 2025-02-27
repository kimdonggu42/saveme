import { FiMapPin } from 'react-icons/fi';

interface MarkerInfoWindowProps {
  FNAME: string;
  ANAME: string;
  jibunAddress: string;
  roadAddress: string;
  onClickPanorama: () => void;
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
          className='mt-1 flex rounded-full border border-gray-300 p-1.5 text-gray-600 hover:border-[#2e87ec] hover:text-[#2e87ec]'
          onClick={onClickPanorama}
        >
          <FiMapPin className='h-5 w-5' />
        </button>
      </div>
    </div>
  );
}

export function GeoCoderInfowindow({
  searchAddress,
  roadAddress,
  jibunAddress,
  englishAddress,
}: any) {
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
    <div className="h-10 w-10 cursor-pointer bg-[url('/cluster-marker-10.png')] bg-contain text-center text-[10px] font-bold leading-[42px] text-white" />
  );
}

export function ClusterMarker100() {
  return (
    <div className="h-10 w-10 cursor-pointer bg-[url('/cluster-marker-100.png')] bg-contain text-center text-[10px] font-bold leading-[42px] text-white" />
  );
}

export function ClusterMarker200() {
  return (
    <div className="h-10 w-10 cursor-pointer bg-[url('/cluster-marker-200.png')] bg-contain text-center text-[10px] font-bold leading-[42px] text-white" />
  );
}

export function ClusterMarker500() {
  return (
    <div className="h-10 w-10 cursor-pointer bg-[url('/cluster-marker-500.png')] bg-contain text-center text-[10px] font-bold leading-[42px] text-white" />
  );
}

export function ClusterMarker1000() {
  return (
    <div className="h-10 w-10 cursor-pointer bg-[url('/cluster-marker-100.png')] bg-contain text-center text-[10px] font-bold leading-[42px] text-white" />
  );
}
