import agentConfig from 'eslint-config-agent'

export default [
  ...agentConfig,
  {
    rules: {
      // Require === and !== to avoid implicit type coercion bugs.
      eqeqeq: ['error', 'always'],
      // Force `import type` for type-only imports so they are erased at
      // compile time and never leak into the runtime bundle.
      '@typescript-eslint/consistent-type-imports': 'error'
    }
  },
  {
    ignores: ['dist/**', 'node_modules/**']
  }
]