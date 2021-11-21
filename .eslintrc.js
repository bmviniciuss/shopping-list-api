module.exports = {
  "env": {
    "es2021": true,
    "node": true
  },
  "extends": [
    "standard"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 13,
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint"
  ],
  "rules": {
    'no-useless-constructor': 0,
    'import-helpers/order-imports': [
      'error',
      {
        newlinesBetween: 'always',
        groups: [
          'module',
          [
            'parent',
            'sibling',
            'index'
          ]
        ],
        alphabetize: {
          order: 'asc',
          ignoreCase: true
        }
      }
    ]
  }
};
