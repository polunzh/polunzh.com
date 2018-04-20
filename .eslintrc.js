module.exports = {
  plugins: [
    'import',
  ],
  extends: 'airbnb',
  env: {
    es6: true,
    browser: true,
    node: true,
    mocha: true,
  },
  rules: {
    // 不禁用 console
    'no-console': 'off',
    // 不强制函数表达式有名字
    'func-names': 'off',
    // 不禁用 amd 的 require
    'import/no-amd': 'off',
    // 不强制全局 require
    'global-require': 'off',
    // 由于是 4 空格缩进，将每行最大长度放宽到 240，airbnb 为 100
    'max-len': [2, 240, 2, { ignoreUrls: true, ignoreComments: false }],
    // 不禁止 for in 循环
    'no-restricted-syntax': [2, 'DebuggerStatement', 'LabeledStatement', 'WithStatement'],
    // 不禁止使用下划线作为变量名前缀
    'no-underscore-dangle': ['off'],
    // 不强制 return
    'consistent-return': ['off'],
    // 不强制使用 => 代替函数
    'prefer-arrow-callback': ['off'],
    // 不强制使用 camel case 命名
    camelcase: ['error'],
    // 允许修改参数
    'no-param-reassign': ['off'],
    // 不强制链式操作另起一行
    'newline-per-chained-call': ['off'],
    'new-parens': 'off',
    'arrow-parens': 'off',
    'no-plusplus': 'off',
    'no-nested-ternary': 'off',
    'no-mixed-operators': 'off',
    'no-useless-escape': 'off',
    'import/extensions': 'off',
    'import/newline-after-import': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-dynamic-require': 'off',
    'import/imports-first': 'off',
    'no-unused-expressions': 'off',
    'comma-dangle': ['error', {
        'arrays': 'always-multiline',
        'objects': 'always-multiline',
        'imports': 'always-multiline',
        'exports': 'always-multiline',
        'functions': 'ignore',
    }]
  },
  globals: {
    __DEVELOPMENT__: true,
    __DEVTOOLS__: true,
    webpackIsomorphicTools: true,
    $: true,
    jQuery: true,
    sentry: true,
    socket: true,
  },
};
