import { defineConfig } from 'orval';

export default defineConfig({
  backend: {
    input: '../backend/schema.yml',
    output: './api/backend.ts',
    hooks: {
      afterAllFilesWrite: 'prettier --write',
    },
  },
});
