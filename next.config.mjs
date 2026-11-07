/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  images: {  // 👈 NOVO BLOCO
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.marquesvendaspmg.shop',
        port: '',
        pathname: '/images/**',  // Permite qualquer imagem na pasta /images
      },
    ],
  },
  
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
      {
        source: '/food-news',
        destination: '/food-news',
      }
    ];
  },
};

export default nextConfig;
