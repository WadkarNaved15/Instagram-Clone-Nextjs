// next.config.js

const nextConfig = {
    webpack: (config, { isServer }) => {
      // Modify webpack config here if needed
      return config;
    },
  
    async headers() {
      return [
        {
          source: '/api/upload',
          headers: [
            {
              key: 'Access-Control-Allow-Origin',
              value: '*',
            },
            {
              key: 'Access-Control-Allow-Methods',
              value: 'GET, POST, PUT, DELETE, OPTIONS',
            },
            {
              key: 'Access-Control-Allow-Headers',
              value: 'X-Requested-With, Content-Type, Authorization',
            },
          ],
        },
      ];
    },
  };
  
  export default nextConfig;
  