/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      "i.pravatar.cc", // Avatar random
      "iiryrpggrlwhcuzlgbot.supabase.co", // ✅ Supabase storage domain
    ],
  },
};

module.exports = nextConfig;
