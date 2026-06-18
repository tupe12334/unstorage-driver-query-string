import agentConfig from 'eslint-config-agent'

export default [
  ...agentConfig,
  {
    rules: {
      // Require === and !== to avoid implicit type coercion bugs.
      eqeqeq: ['error', 'always'],
      // Forbid non-null assertions (`x!`) which silence the compiler and can
      // hide real null/undefined values that crash at runtime.
      '@typescript-eslint/no-non-null-assertion': 'error'
    }
  },
  {
    ignores: ['dist/**', 'node_modules/**']
  }
]