/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Admin uploads are stored on Cloudinary; placeholder photos come from Unsplash.
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
};

export default nextConfig;
