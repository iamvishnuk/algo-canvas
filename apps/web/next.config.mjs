/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@algocanvas/ui', 'sonner'],
  images: {
    domains: ['github.com']
  }
};

export default nextConfig;
