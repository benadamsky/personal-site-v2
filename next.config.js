/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  turbopack: { root: __dirname },
  // /plain was the document's address for a few days before it became the root.
  redirects: async () => [{ source: '/plain', destination: '/', permanent: true }]
};

module.exports = nextConfig;
