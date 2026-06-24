import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["192.168.230.1", "192.168.1.6"],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'dxzvxxjorggprjcpttab.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;

