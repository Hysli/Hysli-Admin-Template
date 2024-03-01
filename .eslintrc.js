module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:vue/vue3-essential'
  ],
  overrides: [
    {
      env: {
        node: true
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@typescript-eslint/parser',
    sourceType: 'module'
  },
  plugins: ['@typescript-eslint', 'vue'],
  rules: {
    // 允许使用 @ts-ignore
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'linebreak-style': ['error', 'unix'],
    'no-irregular-whitespace': 'off', // 关闭不规则空白检查
    'vue/comment-directive': 'off',
    quotes: ['error', 'single'],
    semi: ['error', 'never'],
    'vue/multi-word-component-names': 'off',
    // 关闭 no-mixed-spaces-and-tabs 规则
    'no-mixed-spaces-and-tabs': 'off',
    // no-empty 规则暂时关闭
    'no-empty': 'off',
    // no-useless-escape 规则暂时关闭
    'no-useless-escape': 'off',
    '@typescript-eslint/no-duplicate-enum-values': 'off',
    '@typescript-eslint/ban-types': 'off',
    'vue/no-mutating-props': 'off',
    'vue/valid-v-for': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    //  不检查 script 开头的
    'vue/script-setup-uses-vars': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    'prefer-const': 'off'
  },
  globals: {
    uni: true,
    wx: true,
    NodeJS: true,
    Recordable: true,
    Nullable: true,
    LabelValueOptions: true,
    ChangeEvent: true,
    Fn: true,
    ComponentRef: true
  }
}
