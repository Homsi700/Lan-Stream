import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    // This allows the Next.js dev server to be accessed from other devices on the local network.
    // Replace with your local IP address if needed, or keep it broad for development.
    allowedDevOrigins: ["http://192.168.10.94:9002", "http://localhost:3000"],
  },
};

export default nextConfig;
