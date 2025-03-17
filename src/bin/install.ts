#!/usr/bin/env node

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { ProjectType, ConfigFile, VSCodeFile, PackageJson } from '../types';

// 获取项目类型参数
const projectType = (process.argv[2] || 'vue') as ProjectType;
if (!['vue', 'nuxt', 'wxt'].includes(projectType)) {
  console.error('Error: Project type must be one of: vue, nuxt, wxt');
  process.exit(1);
}

// 获取用户项目根目录
const userProjectRoot = process.cwd();

// 配置文件路径
const configFiles: ConfigFile[] = [
  {
    source: path.resolve(__dirname, `../../dist/configs/${projectType}.js`),
    target: path.resolve(userProjectRoot, '.eslintrc.js'),
    content: `module.exports = require('team-eslint-config/dist/configs/${projectType}');`
  },
  {
    source: path.resolve(__dirname, '../../dist/prettier.js'),
    target: path.resolve(userProjectRoot, '.prettierrc.js'),
    content: `module.exports = require('team-eslint-config/dist/prettier');`
  }
];

// 创建 VS Code 配置目录
const vscodeDir = path.resolve(userProjectRoot, '.vscode');
if (!fs.existsSync(vscodeDir)) {
  fs.mkdirSync(vscodeDir);
}

// VS Code 配置文件
const vscodeFiles: VSCodeFile[] = [
  {
    source: path.resolve(__dirname, '../../dist/vscode-settings.js'),
    target: path.resolve(vscodeDir, 'settings.json'),
    transform: (content) => JSON.stringify(content, null, 2)
  },
  {
    source: path.resolve(__dirname, '../../dist/vscode-extensions.js'),
    target: path.resolve(vscodeDir, 'extensions.json'),
    transform: (content) => JSON.stringify(content, null, 2)
  }
];

// 写入配置文件
configFiles.forEach(({ target, content }) => {
  fs.writeFileSync(target, content);
  console.log(`Created ${path.relative(userProjectRoot, target)}`);
});

// 写入 VS Code 配置文件
vscodeFiles.forEach(({ source, target, transform }) => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const content = require(source) as Record<string, unknown>;
  fs.writeFileSync(target, transform(content));
  console.log(`Created ${path.relative(userProjectRoot, target)}`);
});

// 更新 package.json
const packageJsonPath = path.resolve(userProjectRoot, 'package.json');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require(packageJsonPath) as PackageJson;

// 添加脚本
packageJson.scripts = packageJson.scripts || {};
packageJson.scripts.lint = 'eslint --ext .js,.ts,.vue --ignore-path .gitignore .';
packageJson.scripts['lint:fix'] = 'eslint --ext .js,.ts,.vue --ignore-path .gitignore . --fix';
packageJson.scripts.format = 'prettier --write .';
packageJson.scripts['type-check'] = 'vue-tsc --noEmit';
packageJson.scripts.prepare = 'husky install'; // 添加 prepare 脚本以自动安装 husky

// 添加 lint-staged 配置
packageJson['lint-staged'] = {
  '*.{js,ts,vue}': [
    'eslint --fix',
    'prettier --write'
  ],
  '*.{css,scss,less}': [
    'prettier --write'
  ],
  '*.{json,md}': [
    'prettier --write'
  ]
};

// 写入更新后的 package.json
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
console.log('Updated package.json');

// 创建 tsconfig.json 如果不存在
const tsconfigPath = path.resolve(userProjectRoot, 'tsconfig.json');
if (!fs.existsSync(tsconfigPath)) {
  const tsconfig = {
    compilerOptions: {
      target: "ES2018",
      module: "ESNext",
      moduleResolution: "Node",
      strict: true,
      jsx: "preserve",
      sourceMap: true,
      resolveJsonModule: true,
      esModuleInterop: true,
      lib: ["ESNext", "DOM"],
      skipLibCheck: true,
      noImplicitAny: true,
      strictNullChecks: true,
      strictFunctionTypes: true,
      strictBindCallApply: true,
      strictPropertyInitialization: true,
      noImplicitThis: true,
      alwaysStrict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noImplicitReturns: true,
      noFallthroughCasesInSwitch: true,
      types: [] as string[]  // 指定为字符串数组类型
    },
    include: ["src/**/*", "tests/**/*"],
    exclude: ["node_modules", "dist"]
  };

  // 根据项目类型添加特定的类型定义
  if (projectType === 'wxt') {
    tsconfig.compilerOptions.types.push("chrome", "web-ext-types");
  }

  fs.writeFileSync(tsconfigPath, JSON.stringify(tsconfig, null, 2));
  console.log('Created tsconfig.json');
}

// 安装所需依赖
console.log(`Installing dependencies for ${projectType} project...`);
try {
  const dependencies = [
    'eslint',
    'prettier',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    'eslint-config-prettier',
    'eslint-plugin-prettier',
    'eslint-plugin-vue',
    'vue-tsc',
    'typescript',
    'husky',
    'lint-staged'
  ];

  // 根据项目类型添加特定依赖
  if (projectType === 'nuxt') {
    dependencies.push('@nuxtjs/eslint-config-typescript');
  } else if (projectType === 'wxt') {
    dependencies.push('eslint-plugin-mozilla');
    dependencies.push('@types/chrome');
    dependencies.push('web-ext-types');
  }

  execSync(`npm install --save-dev ${dependencies.join(' ')}`, { stdio: 'inherit' });
  console.log('Dependencies installed successfully');
} catch (error) {
  console.error('Failed to install dependencies:', error instanceof Error ? error.message : String(error));
}

// 设置 Husky
console.log('Setting up Husky...');
try {
  // 检查是否是 Git 仓库
  const isGitRepo = fs.existsSync(path.resolve(userProjectRoot, '.git'));

  if (!isGitRepo) {
    console.log('Initializing Git repository...');
    execSync('git init', { stdio: 'inherit' });
  }

  // 初始化 Husky
  execSync('npx husky install', { stdio: 'inherit' });

  // 创建 .husky 目录
  const huskyDir = path.resolve(userProjectRoot, '.husky');
  if (!fs.existsSync(huskyDir)) {
    fs.mkdirSync(huskyDir, { recursive: true });
  }

  // 创建 pre-commit hook
  const preCommitPath = path.resolve(huskyDir, 'pre-commit');
  const preCommitContent = `#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npx lint-staged
`;
  fs.writeFileSync(preCommitPath, preCommitContent, { mode: 0o755 });
  console.log('Created pre-commit hook');

  // 创建 _目录和 husky.sh
  const huskyShDir = path.resolve(huskyDir, '_');
  if (!fs.existsSync(huskyShDir)) {
    fs.mkdirSync(huskyShDir, { recursive: true });
  }

  const huskyShPath = path.resolve(huskyShDir, 'husky.sh');
  const huskyShContent = `#!/usr/bin/env sh
if [ -z "$husky_skip_init" ]; then
  debug () {
    if [ "$HUSKY_DEBUG" = "1" ]; then
      echo "husky (debug) - $1"
    fi
  }

  readonly hook_name="$(basename -- "$0")"
  debug "starting $hook_name..."

  if [ "$HUSKY" = "0" ]; then
    debug "HUSKY env variable is set to 0, skipping hook"
    exit 0
  fi

  if [ -f ~/.huskyrc ]; then
    debug "sourcing ~/.huskyrc"
    . ~/.huskyrc
  fi

  readonly husky_skip_init=1
  export husky_skip_init
  sh -e "$0" "$@"
  exitCode="$?"

  if [ $exitCode != 0 ]; then
    echo "husky - $hook_name hook exited with code $exitCode (error)"
  fi

  exit $exitCode
fi
`;
  fs.writeFileSync(huskyShPath, huskyShContent, { mode: 0o755 });
  console.log('Created husky.sh');

  console.log('Husky setup complete');
} catch (error) {
  console.error('Failed to setup Husky:', error instanceof Error ? error.message : String(error));
  console.log('You can manually setup Husky by running:');
  console.log('  npx husky install');
  console.log('  npx husky add .husky/pre-commit "npx lint-staged"');
}

console.log('\nSetup complete! Your project now has team code style configuration.');
console.log(`Project type: ${projectType}`);
console.log('Run `npm run lint` to check your code style');
console.log('Run `npm run lint:fix` to automatically fix issues');
console.log('Run `npm run format` to format your code with Prettier');
console.log('Run `npm run type-check` to check TypeScript types');
console.log('\nGit hooks are set up to automatically check your code before commits.');
