const js = require('@eslint/js')
const prettier = require('eslint-plugin-prettier')

module.exports = [
  js.configs.recommended,
  {
    ignores: ['node_modules/', 'dist/', '.git/', 'evaluation/', 'TEMP/'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs'
    },
    plugins: {
      prettier
    },
    rules: {
      'prettier/prettier': 'error'
    }
  }
]
