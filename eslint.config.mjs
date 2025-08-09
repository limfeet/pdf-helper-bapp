// eslint.config.mjs
import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import json from '@eslint/json'
import { defineConfig } from 'eslint/config'
import eslintConfigPrettier from 'eslint-config-prettier'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },

  tseslint.configs.recommended,

  // ⬇️ recommended 대신 최신 JSX Transform용 설정
  pluginReact.configs['flat/jsx-runtime'],

  // ⬇️ react 설정 "뒤에" 와야 확실히 덮어씀
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
    },
  },

  {
    files: ['**/*.json'],
    plugins: { json },
    language: 'json/json',
    extends: ['json/recommended'],
  },

  // ⬇️ 마지막에 두는 게 정석 (포맷 관련 규칙 끔)
  eslintConfigPrettier,
])
