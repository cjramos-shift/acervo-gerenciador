import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

const REACT_PACKAGES = [
  { name: 'react', message: 'Camadas internas não conhecem o React.' },
  { name: 'react-dom', message: 'Camadas internas não conhecem o React.' },
  { name: 'react-router', message: 'Camadas internas não conhecem o roteador.' },
]

const forbidImports = (layerName, groups, extraPaths = []) => ({
  files: [`src/${layerName}/**/*.{ts,tsx}`],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        paths: extraPaths,
        patterns: groups.map(({ group, message }) => ({ group, message })),
      },
    ],
  },
})

const outerLayers = (names) => [
  {
    group: names.map((name) => `**/${name}`).concat(names.map((name) => `**/${name}/**`)),
    message: 'Regra de dependência da Clean Architecture: camadas internas não importam camadas externas.',
  },
]

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended, reactHooks.configs.flat.recommended],
    plugins: { 'react-refresh': reactRefresh },
    languageOptions: { ecmaVersion: 2023, globals: globals.browser },
    rules: { 'react-refresh/only-export-components': ['warn', { allowConstantExport: true }] },
  },
  forbidImports('domain', outerLayers(['application', 'interface-adapters', 'frameworks']), REACT_PACKAGES),
  forbidImports('application', outerLayers(['interface-adapters', 'frameworks']), REACT_PACKAGES),
  forbidImports('interface-adapters', outerLayers(['frameworks'])),
)
