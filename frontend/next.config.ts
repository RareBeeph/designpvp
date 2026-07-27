import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  // Emit a self-contained server with a pruned node_modules, so the production
  // image can ship the build output without installing dependencies again. See
  // the runtime stage in Dockerfile.
  output: 'standalone',
};

export default nextConfig;
