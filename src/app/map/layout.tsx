import Script from 'next/script';
import { Toaster } from '@/components/ui/sonner';

export default function MapLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
      <Script
        type='text/javascript'
        src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_API_KEY}&submodules=geocoder,panorama`}
      />
      <Script src='/MarkerClustering.js' />
      <Toaster position='top-center' offset={{ top: '70px' }} mobileOffset={{ top: '70px' }} />
    </>
  );
}
