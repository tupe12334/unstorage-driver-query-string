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
      // Forbid non-null assertions (`x!`) which silence the compiler and can
      // hide real null/undefined values that crash at runtime.
      '@typescript-eslint/no-non-null-assertion': 'error'
    }
  },
  {
    ignores: ['dist/**', 'node_modules/**']
  }
]
