import agentConfig from 'eslint-config-agent'

export default [
  ...agentConfig,
  {
    rules: {
      // Require === and !== to avoid implicit type coercion bugs.
      eqeqeq: ['error', 'always']
    }
  },
  {
    ignores: ['dist/**', 'node_modules/**']
  }
]