/** @type {import('next').NextConfig} */

const nextConfig= {
    images: {
      unoptimized: true,
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'firebasestorage.googleapis.com',
          port: '',
          pathname: '/v0/b/teamtec-727df.appspot.com/**',
        },
      ],
    },
    output: 'export'
  };

  export default nextConfig;