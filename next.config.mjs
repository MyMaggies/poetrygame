/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'static',  // changed from 'export'
    images: {
      unoptimized: true
    }
  };
  
  export default nextConfig;