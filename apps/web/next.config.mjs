/**
 * Next.js configuration tailored for the Vercel deployment target.
 * - Enables standalone output for leaner serverless bundles.
 * - Whitelists Cloudflare R2 and CMS-hosted assets for the Image component.
 * - Adds cache headers for static assets (tuned later alongside ISR strategy).
 */

const r2Url = process.env.NEXT_PUBLIC_R2_PUBLIC_BASE_URL;
const parsedR2Host = r2Url
  ? new URL(r2Url).hostname
  : '*.r2.cloudflarestorage.com';
const cmsHost =
  process.env.NEXT_PUBLIC_CMS_API_URL &&
  new URL(process.env.NEXT_PUBLIC_CMS_API_URL).hostname;

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
        hostname: parsedR2Host,
      },
      ...(cmsHost
        ? [
            {
              protocol: 'https',
              hostname: cmsHost,
            },
          ]
        : []),
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
