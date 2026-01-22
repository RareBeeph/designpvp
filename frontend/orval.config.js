import { defineConfig } from 'orval';

export default defineConfig({
  backend: {
    input: '../backend/schema.yml',
    output: {
      target: './api/backend.ts',
      client: 'react-query',
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
