/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  async rewrites() {
    return [
      {
        source: '/food-news/:slug',
        destination: '/food-news?slug=:slug',
      },
      {
        source: '/food-news/:slug/:id',
        destination: '/food-news?slug=:slug&page=:id',
      },
      // Mantém compatibilidade com URLs antigas
      {
        source: '/food-news',
        destination: '/food-news',
      }
    ];
  },
};

export default nextConfig;
