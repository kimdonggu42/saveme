export default {
  env: {
    es6: true,
  },
  extends: 'next/core-web-vitals',
  rules: {
    'no-var': 'error',
    'no-multiple-empty-lines': 'error',
    'no-console': 'off',
    eqeqeq: 'error',
    'dot-notation': 'error',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },
};
