/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com'],
  },
  env: {
    API_KEY: process.env.API_KEY,
  },
  // publicRuntimeConfig: {
  //   API_KEY: process.env.NEXT_PUBLIC_API_KEY,
  // },
};

export default nextConfig;
