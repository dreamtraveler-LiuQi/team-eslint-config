module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // 新功能
        'fix', // 修复bug
        'docs', // 文档更新
        'style', // 代码格式（不影响代码运行的变动）
        'refactor', // 重构（既不是增加feature）,也不是修复bug
        'perf', // 性能优化
        'test', // 增加测试
        'chore', // 构建过程或辅助工具的变动
        'revert', // 回退
        'build', // 打包
        'ci' // CI配置相关
      ]
    ],
    'type-empty': [2, 'never'],     // type不能为空
    'type-case': [2, 'always', 'lower-case'], // type必须小写
    'subject-empty': [2, 'never'],  // subject不能为空
    'subject-full-stop': [2, 'never', '.'], // subject结尾不能有.
    'header-max-length': [2, 'always', 150] // header最大150字符
  }
}; 
