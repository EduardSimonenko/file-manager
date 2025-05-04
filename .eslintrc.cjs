module.exports = {
  // Используем рекомендованные правила ESLint + Airbnb
  extends: ['eslint:recommended', 'airbnb-base'],

  // Дополнительные настройки парсера (если нужен Babel)
  parserOptions: {
    ecmaVersion: 2022, // или 12 / 13 (в зависимости от версии Node)
    sourceType: 'module', // если используем ES-модули
  },

  // Правила (можно кастомизировать)
  rules: {
    // Основные правила
    'indent': ['error', 2], // отступ 2 пробела
    'quotes': ['error', 'single'], // одинарные кавычки
    'semi': ['error', 'always'], // точка с запятой обязательна
    'max-len': ['warn', { code: 120 }], // макс. длина строки 120 символов
    'linebreak-style': ['error', 'unix'], // LF (для Unix/macOS)

    // Стиль кода
    'camelcase': 'error', // переменные в camelCase
    'no-underscore-dangle': 'off', // разрешить _privateMethod
    'no-unused-vars': 'warn', // предупреждение на неиспользуемые переменные
    'space-before-function-paren': ['error', 'never'],
    'space-before-blocks': ['error', 'always'],

    // Импорты
    'import/prefer-default-export': 'off', // можно именованный экспорт
    'import/extensions': ['error', 'ignorePackages'], // не требовать .js в импортах

    // Консоль (можно отключить для прода)
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
  },


  // Глобальные переменные (если работаем с браузером или Node.js)
  env: {
    browser: true, // document, window и т.д.
    node: true, // require, process и т.д.
    es2021: true, // новые фичи ES (опционально)
  },
};