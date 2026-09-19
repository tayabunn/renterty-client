/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  transpilePackages: ["@proofly-framer/ui", "@proofly-framer/runtime"],
  serverExternalPackages: ['@better-auth/kysely-adapter', 'kysely'],
  reactCompiler: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: [
      'lucide-react',
      'framer-motion',
      'recharts',
      'radix-ui',
      'react-hot-toast',
      'leaflet',
      'react-leaflet',
      'clsx',
      'tailwind-merge',
    ],
  },
};

export default nextConfig;
