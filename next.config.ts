import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // URL avec barre finale, comme la V1 WordPress (/ateliers-tissage-teinture/).
  trailingSlash: true,
  cacheComponents: true,
  // Ne pas (re)créer AGENTS.md à la racine : tous les .md vivent dans docs/.
  agentRules: false,
  partialPrefetching: true,
  turbopack: {
    // Racine du projet : évite que Next remonte à un package-lock.json du dossier personnel.
    root: __dirname,
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
