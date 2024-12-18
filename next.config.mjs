/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export',  // 'static' was invalid, changed back to 'export'
    images: {
      unoptimized: true
    }
  };
  
  export default nextConfig;