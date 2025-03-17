# Team ESLint Config

团队统一的代码规范和格式化配置，支持 Vue 3、Nuxt 3 和 WXT 项目。

## 特性

- 严格的 TypeScript 类型检查
- 严格的 ESLint 规则配置
- 统一的 Prettier 格式化规则
- VS Code 编辑器配置
- Git hooks 自动检查代码
- 一键安装和配置

## 安装

### Vue 项目

npx team-eslint-setup vue

### Nuxt 项目

npx team-eslint-setup nuxt

### WXT 项目

npx team-eslint-setup wxt


## 使用

安装完成后，你可以使用以下命令：

- `npm run lint` - 检查代码风格
- `npm run lint:fix` - 自动修复代码风格问题
- `npm run format` - 使用 Prettier 格式化代码
- `npm run type-check` - 检查 TypeScript 类型

## VS Code 集成

安装后会自动配置 VS Code 设置和推荐扩展。建议安装以下扩展：

- ESLint
- Prettier
- Volar (Vue Language Features)
- TypeScript Vue Plugin
- Error Lens
- EditorConfig

## Git Hooks

安装后会自动配置 Git pre-commit hook，在提交代码前自动检查和修复代码风格问题。

## 严格模式

此配置启用了以下严格检查：

### TypeScript 严格检查

- `strict: true`
- `noImplicitAny: true`
- `strictNullChecks: true`
- `strictFunctionTypes: true`
- `strictBindCallApply: true`
- `strictPropertyInitialization: true`
- `noImplicitThis: true`
- `alwaysStrict: true`
- `noUnusedLocals: true`
- `noUnusedParameters: true`
- `noImplicitReturns: true`
- `noFallthroughCasesInSwitch: true`

### ESLint 严格规则

- `@typescript-eslint/no-explicit-any: error`
- `@typescript-eslint/explicit-module-boundary-types: error`
- `@typescript-eslint/no-unused-vars: error`
- `@typescript-eslint/no-non-null-assertion: error`
- `@typescript-eslint/strict-boolean-expressions: error`
- `@typescript-eslint/no-floating-promises: error`

## 开发模式

在开发模式下，错误会实时显示在终端和编辑器中：

## 发布到 NPM

1. 更新 `package.json` 中的版本号
2. 运行 `npm run build` 构建项目
3. 运行 `npm publish` 发布到 NPM
