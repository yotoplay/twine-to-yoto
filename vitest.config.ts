import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        globals: true,
        name: 'unit tests',
        environment: 'node',
        setupFiles: ['./__tests__/setup.ts'],
        include: ['**/*.test.[jt]s?(x)'],
        exclude: ['**/__tests__/e2e/**', 'node_modules/**', '.serverless/**']
    }
});
