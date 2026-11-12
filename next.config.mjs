/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  images: {
    // 1. Gerar APENAS WebP (remove AVIF, que dobra as transformações)
    formats: ['image/webp'],
    
    // 2. Reduzir os tamanhos de tela (remove 2048 e 3840, que geram versões enormes)
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    
    // 3. Tamanhos menores para ícones/thumbnails (mantém o padrão)
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    
    // 4. Cache longo (31 dias) para reduzir "cache stale" e novas transformações
    minimumCacheTTL: 2678400, // 31 dias em segundos
    
    // 5. Qualidade única (75) para não multiplicar variantes
    qualities: [75],
    
    // 6. Manter a permissão do seu domínio
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.marquesvendaspmg.shop',
        port: '',
        pathname: '/images/**',
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
