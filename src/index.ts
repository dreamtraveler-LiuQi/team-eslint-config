import { ESLintConfig } from './types';

const config: ESLintConfig = {
  extends: [
    './eslint',
  ],
};

export default config;

export { default as vueConfig } from './config/vue';
export { default as nuxtConfig } from './config/nuxt';
export { default as wxtConfig } from './config/wxt';
export { default as prettierConfig } from './prettier';
