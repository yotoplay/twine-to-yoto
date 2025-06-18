import config from '@yoto/eslint-config';

export default [
    {
        ignores: ['artifacts/', 'build/']
    },
    ...config,
    {
        rules: {
            'no-console': 'off'
        }
    }
];
