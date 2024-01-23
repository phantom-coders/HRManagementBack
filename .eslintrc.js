module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-console': 1,
    'no-empty': 'off',
    'no-undef': 'off',
    'no-unused-vars': 1,
  },
};
