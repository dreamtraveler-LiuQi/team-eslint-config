import { PrettierConfig } from './types';

const config: PrettierConfig = {
  semi: true,
  singleQuote: true,
  tabWidth: 2,
  trailingComma: 'none',
  printWidth: 100,
  endOfLine: 'auto',
  arrowParens: 'avoid',
  vueIndentScriptAndStyle: false
};

export = config;
