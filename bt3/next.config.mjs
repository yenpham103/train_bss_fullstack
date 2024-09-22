/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: ['images.unsplash.com'],
  },
  env: {
    API_KEY: process.env.API_KEY,
    API_URL: process.env.API_URL,
  },
};

export default nextConfig;
