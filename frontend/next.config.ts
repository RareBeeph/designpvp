import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  // Emit a self-contained server with a pruned node_modules, so the production
  // image can ship the build output without installing dependencies again. See
  // the runtime stage in Dockerfile.
  output: 'standalone',

  images: {
    // Uploaded media lives on a different origin to the app: MinIO in development, R2
    // behind a custom domain in production. Both are declared here so next/image will
    // accept them, but note that media is intentionally rendered without the optimizer.
    //
    // Two reasons. In development the browser reaches MinIO on localhost, which the Next
    // server inside its container cannot resolve, so a server-side fetch would fail. And
    // in production R2 already sits behind Cloudflare's CDN, so re-encoding through a Node
    // process would duplicate work and add egress for nothing
    remotePatterns: [
      { protocol: 'http', hostname: 'localhost', port: '9400', pathname: '/media/**' },
      ...(process.env.NEXT_PUBLIC_MEDIA_HOSTNAME ?
        [{ protocol: 'https' as const, hostname: process.env.NEXT_PUBLIC_MEDIA_HOSTNAME }]
      : []),
    ],
  },
};

export default nextConfig;
