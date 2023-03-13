/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['chat.kanbox.vn', 'localhost', 'gpt3.com.vn'],
  }
}

module.exports = nextConfig
