import type { ESLintConfig, PrettierConfig, ProjectConfig } from '../types';

export function validateConfig(config: Partial<ProjectConfig>): void {
  // 使用严格的类型检查
  if (typeof config.eslint !== 'object' || config.eslint === null) {
    throw new Error('ESLint configuration is required');
  }

  // 验证必要的 ESLint 配置
  validateESLintConfig(config.eslint);

  // 使用严格的类型检查
  if (typeof config.prettier === 'object' && config.prettier !== null) {
    validatePrettierConfig(config.prettier);
  }
}

function validateESLintConfig(config: ESLintConfig): void {
  // 使用严格的类型检查
  const extends_ = Array.isArray(config.extends) ? config.extends : [];
  const plugins = Array.isArray(config.plugins) ? config.plugins : [];

  // 验证必要的扩展和插件
  const requiredExtends = ['eslint:recommended', 'plugin:@typescript-eslint/recommended'];
  const requiredPlugins = ['@typescript-eslint'];

  // 验证 extends
  if (!Array.isArray(extends_)) {
    throw new Error('ESLint extends must be an array');
  }

  // 验证 plugins
  if (!Array.isArray(plugins)) {
    throw new Error('ESLint plugins must be an array');
  }

  // 验证必要的扩展
  requiredExtends.forEach(ext => {
    if (!extends_.includes(ext)) {
      throw new Error(`Missing required ESLint extension: ${ext}`);
    }
  });

  // 验证必要的插件
  requiredPlugins.forEach(plugin => {
    if (!plugins.includes(plugin)) {
      throw new Error(`Missing required ESLint plugin: ${plugin}`);
    }
  });
}

function validatePrettierConfig(config: PrettierConfig): void {
  // 验证必要的 Prettier 配置
  const requiredOptions = ['semi', 'singleQuote', 'tabWidth'] as const;
  
  requiredOptions.forEach(option => {
    if (!(option in config)) {
      throw new Error(`Missing required Prettier option: ${option}`);
    }
  });
} 
