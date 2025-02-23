interface MarkerInfoWindowProps {
  FNAME: string;
  ANAME: string;
  jibunAddress: string;
  roadAddress: string;
}

export function MarkerInfoWindow({
  FNAME,
  ANAME,
  jibunAddress,
  roadAddress,
}: MarkerInfoWindowProps) {
  return (
    <div className='flex flex-col gap-y-1.5 rounded-md border border-gray-200 bg-white px-5 py-4 shadow-[0_4px_16px_0_rgba(0,0,0,0.1)]'>
      <div className='flex items-center gap-x-2'>
        <p className='text-lg font-bold'>{FNAME}</p>
        <p className='text-sm font-medium text-gray-500'>{ANAME}</p>
      </div>
      {jibunAddress && (
        <div className='text-sm font-medium'>
          <span className='mr-1 rounded border border-gray-400 px-1 py-0.5 text-xs font-semibold text-gray-700'>
            지번
          </span>
          {jibunAddress}
        </div>
      )}
      {roadAddress && <div>(도로명) {roadAddress}</div>}
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
    <div className='flex flex-col gap-y-1 rounded-md border border-gray-100 bg-white p-2.5 shadow-[0_4px_16px_0_rgba(0,0,0,0.1)]'>
      <h4 className='mb-1 font-bold'>검색 주소: {searchAddress}</h4>
      <p>[도로명 주소] {roadAddress}</p>
      <p>[지번 주소] {jibunAddress}</p>
      <p>[영문명 주소] {englishAddress}</p>
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
