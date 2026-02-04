import { defineConfig } from 'orval';

export default defineConfig({
  backend: {
    input: 'http://backend:3000/api/schema/',
    output: {
      target: './api/backend.ts',
      client: 'react-query',
      httpClient: 'axios',
      prettier: true,
      override: {
        namingConvention: {
          enum: 'camelCase',
        },
        mutator: {
          path: './api/mutator/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
  allauth: {
    input: {
      target: './allauth-schema.yaml',
      override: {
        transformer: './api/mutator/add-client.js',
      },
    },
    output: {
      target: './api/allauth.ts',
      client: 'react-query',
      httpClient: 'axios',
      baseUrl: '/api/',
      prettier: true,
      override: {
        namingConvention: {
          enum: 'camelCase',
        },
        mutator: {
          path: './api/mutator/custom-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
});
