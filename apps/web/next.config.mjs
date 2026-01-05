/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@workspace/ui', 'sonner'],
  images: {
    domains: ['github.com']
  }
};

export default nextConfig;
