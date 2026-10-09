import type { NextConfig } from "next";

const repo = process.env.GITHUB_REPOSITORY?.split("/")[1] ?? "";
const isPages = process.env.PAGES_BUILD === "true" && repo.length > 0;

const nextConfig: NextConfig = {
  allowedDevOrigins: ["127.0.0.1"],
  output: "export",
  trailingSlash: true,
  images: {unoptimized: true},
  basePath: isPages ? `/${repo}` : "",
  assetPrefix: isPages ? `/${repo}/` : ""
};

export default nextConfig;
