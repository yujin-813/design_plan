/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // 폰트는 런타임 <link>로 로드 (빌드 시 외부 폰트 스타일시트 최적화 비활성화)
  optimizeFonts: false,
};

export default nextConfig;
