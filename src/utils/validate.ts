import type { ESLintConfig, PrettierConfig, ProjectConfig } from '../types';

export function validateConfig(config: Partial<ProjectConfig>): void {
  if (!config.eslint || typeof config.eslint !== 'object') {
    throw new Error('ESLint configuration is required');
  }

  validateESLintConfig(config.eslint);

  if (config.prettier && typeof config.prettier === 'object') {
    validatePrettierConfig(config.prettier);
  }
}

function validateESLintConfig(config: ESLintConfig): void {
  const extends_ = Array.isArray(config.extends) ? config.extends : [];
  const plugins = Array.isArray(config.plugins) ? config.plugins : [];

  const requiredExtends = [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended'
  ] as const;
  
  const requiredPlugins = ['@typescript-eslint'] as const;

  if (!Array.isArray(extends_)) {
    throw new Error('ESLint extends must be an array');
  }

  if (!Array.isArray(plugins)) {
    throw new Error('ESLint plugins must be an array');
  }

  requiredExtends.forEach(ext => {
    if (!extends_.includes(ext)) {
      throw new Error(`Missing required ESLint extension: ${ext}`);
    }
  });

  requiredPlugins.forEach(plugin => {
    if (!plugins.includes(plugin)) {
      throw new Error(`Missing required ESLint plugin: ${plugin}`);
    }
  });
}

function validatePrettierConfig(config: PrettierConfig): void {
  const requiredOptions = ['semi', 'singleQuote', 'tabWidth'] as const;
  
  requiredOptions.forEach(option => {
    if (!(option in config)) {
      throw new Error(`Missing required Prettier option: ${option}`);
    }
  });
} 
