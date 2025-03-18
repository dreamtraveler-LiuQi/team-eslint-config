import { Linter } from 'eslint';
import { Options } from 'prettier';

export type ESLintConfig = Linter.Config;
export type PrettierConfig = Options;

export type ProjectType = 'vue' | 'nuxt' | 'wxt';

export interface ConfigFile {
  source: string;
  target: string;
  content: string;
}

export interface VSCodeFile {
  source: string;
  target: string;
  transform: (content: Record<string, unknown>) => string;
}

export interface VSCodeSettings {
  [key: string]: unknown;
}

export interface VSCodeExtensions {
  recommendations: string[];
}

export interface PackageJson {
  name?: string;
  version?: string;
  scripts?: Record<string, string>;
  dependencies?: Record<string, string>;
  devDependencies?: Record<string, string>;
  'lint-staged'?: Record<string, string[]>;
  [key: string]: unknown;
}

export interface ProjectConfig {
  eslint: ESLintConfig;
  prettier: PrettierConfig;
  vscode: {
    settings: VSCodeSettings;
    extensions: VSCodeExtensions;
  };
}

export interface InstallOptions {
  projectType: ProjectType;
  typescript?: boolean;
  prettier?: boolean;
  vscode?: boolean;
  git?: boolean;
}
