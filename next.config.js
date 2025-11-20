/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["geist"],
  images: {
    remotePatterns: [],
    unoptimized: true,
  },
  async redirects() {
    return [
      {
        source: "/api-reference",
        destination: "/api-reference/getting-started",
        permanent: true,
      },
      {
        source: "/confirm-auth",
        destination: "/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
