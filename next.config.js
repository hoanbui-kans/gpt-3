/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['chat.kanbox.vn', 'localhost'],
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: 'https://yourdomain.com/',
        permanent: true,
      },
    ]
  },
}

module.exports = nextConfig
