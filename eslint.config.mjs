import agentConfig from 'eslint-config-agent'

export default [
  ...agentConfig,
  {
    rules: {
      // Require === and !== to avoid implicit type coercion bugs.
      eqeqeq: ['error', 'always'],
      // Disallow shorthand type coercions (!!x, +x, '' + x) in favor of
      // explicit Boolean(x)/Number(x)/String(x) for clearer, safer conversions.
      'no-implicit-coercion': 'error'
    }
  },
  {
    ignores: ['dist/**', 'node_modules/**']
  }
]