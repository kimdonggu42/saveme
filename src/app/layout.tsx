import type { Metadata } from 'next';
import localFont from 'next/font/local';
import Script from 'next/script';
import './globals.css';

const pretendard = localFont({
  src: '../../public/fonts/PretendardVariable.woff2',
  weight: '1 999',
  display: 'swap',
  fallback: ['system-ui', 'sans-serif'],
});

export const metadata: Metadata = {
  title: 'saveme',
  description: '급할 땐 saveme! 내 주변의 화장실을 빠르게 찾아드려요.',
  metadataBase: new URL('https://saveme-restroom.com'),
  openGraph: {
    url: 'https://saveme-restroom.com',
    siteName: 'saveme',
    images: [
      {
        url: '/images/saveme.png',
      },
    ],
    locale: 'ko_KR',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={`${pretendard.className} antialiased`}>
        {children}
        <Script
          type='text/javascript'
          src={`https://openapi.map.naver.com/openapi/v3/maps.js?ncpClientId=${process.env.NEXT_PUBLIC_NAVER_MAP_API_KEY}&submodules=geocoder,panorama`}
          strategy='beforeInteractive'
        />
        <Script src='/MarkerClustering.js' />
      </body>
    </html>
  );
}
