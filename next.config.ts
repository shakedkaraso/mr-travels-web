import type { NextConfig } from "next";

// Temporary staging prefix: the site is being reviewed at
// mr-travels.co.il/home-page before swapping to root. Set via the
// NEXT_BASE_PATH env var so switching to root later is a Vercel env
// var removal, not a code change.
const basePath = process.env.NEXT_BASE_PATH || "";

const nextConfig: NextConfig = {
  basePath,
  assetPrefix: basePath || undefined,
};

export default nextConfig;
