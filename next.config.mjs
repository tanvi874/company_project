// next.config.mjs
import nextBundleAnalyzer from '@next/bundle-analyzer';

const withBundleAnalyzer = nextBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  assetPrefix: '/micro-company-search',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/a/**',
      },
      {
        protocol: 'https',
        hostname: 'www.setindiabiz.com',
        port: '', 
        pathname: '/assets/**', 
      },
    ],
  },
  // ... any other configurations you might have
};

// Use default export for the config object when wrapped
export default withBundleAnalyzer(nextConfig);
