// create a local API route that forwards the request to your backend -> Same-origin → no CORS issue
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/wa/:path*",
        destination: "http://127.0.0.1:1799/:path*", // GOWA backend target
      },
    ];
  },
};

module.exports = nextConfig;
