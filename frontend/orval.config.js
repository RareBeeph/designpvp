import { defineConfig } from 'orval';

export default defineConfig({
  backend: {
    input: '../backend/schema.yml',
    output: {
      target: './api/backend.ts',
      client: 'react-query',
      httpClient: 'axios',
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
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
  allauth: {
    input: '../backend/allauth-schema.yaml',
    output: {
      target: './api/allauth.ts',
      client: 'react-query',
      httpClient: 'axios',
      baseUrl: '/api/',
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
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});
