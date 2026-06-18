import agentConfig from 'eslint-config-agent'

export default [
  ...agentConfig,
  {
    rules: {
      // Require === and !== to avoid implicit type coercion bugs.
      eqeqeq: ['error', 'always'],
      // Disallow stray `console` calls in this published driver. Debug logs
      // that slip into the package pollute consumers' browser/server output
      // and can leak internal state; `console.warn`/`console.error` stay
      // allowed for the driver's legitimate diagnostics (e.g. the URL-length
      // warning in url-updater.ts).
      'no-console': ['error', { allow: ['warn', 'error'] }],
      // Flag unused variables, imports and arguments to catch dead code.
      // Names prefixed with `_` are treated as intentionally unused.
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ]
    }
  },
  {
    ignores: ['dist/**', 'node_modules/**']
  }
]
