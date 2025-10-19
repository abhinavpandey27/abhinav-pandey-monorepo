/**
 * Next.js configuration tailored for the Vercel deployment target.
 * - Enables standalone output for leaner serverless bundles.
 * - Whitelists Cloudflare R2 and CMS-hosted assets for the Image component.
 * - Adds cache headers for static assets (tuned later alongside ISR strategy).
 */

const R2_HOST =
  process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL?.replace(/^https?:\/\//, '') ||
  '*.r2.cloudflarestorage.com';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  experimental: {
    instrumentationHook: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: R2_HOST,
      },
      {
        protocol: 'https',
        hostname: 'portfolio-cms.up.railway.app',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/:all*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=0, must-revalidate',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
