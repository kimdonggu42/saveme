/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/seoul-toilets/:path*',
        destination: `http://openAPI.seoul.go.kr:8088/${process.env.SEOUL_SEOUL_OPEN_API_KEY}/json/SearchPublicToiletPOIService/:path*`, // HTTP API 엔드포인트
      },
    ];
  },
};

export default nextConfig;
