interface MarkerInfoWindowProps {
  FNAME: string;
  ANAME: string;
}

export function MarkerInfoWindow({ FNAME, ANAME }: MarkerInfoWindowProps) {
  return (
    <div className='p-2.5 shadow-[0_4px_16px_0_rgba(0,0,0,0.1)]'>
      <div className='mb-1.5 font-bold'>{FNAME}</div>
      <div className='text-[13px]'>{ANAME}</div>
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
    <div className='flex flex-col gap-x-2 p-2.5 shadow-[0_4px_16px_0_rgba(0,0,0,0.1)]'>
      <h4 className='mb-1'>검색 주소: {searchAddress}</h4>
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
