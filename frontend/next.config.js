const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require("path");

const pdfjsDistDir = path.dirname(require.resolve("pdfjs-dist/package.json"));
const cMapsDir = path.join(pdfjsDistDir, "cmaps");
const standardFontsDir = path.join(pdfjsDistDir, "standard_fonts");
const pdfWorkerPath = path.join(pdfjsDistDir, "build", "pdf.worker.min.js");

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: {
      allowedOrigins: ["localhost:3000", "*.vercel.app"],
    },
  },
  webpack: (config) => {
    config.resolve.alias.canvas = false;

    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [{ from: cMapsDir, to: "static/chunks/pdfjs/cmaps/" }],
      })
    );

    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: standardFontsDir,
            to: "static/chunks/pdfjs/standard_fonts/",
          },
        ],
      })
    );

    config.plugins.push(
      new CopyWebpackPlugin({
        patterns: [
          {
            from: pdfWorkerPath,
            to: "static/chunks/pdfjs/build/pdf.worker.min.js",
          },
        ],
      })
    );

    return config;
  },
  // Disable build errors temporarily
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
};

module.exports = nextConfig;
