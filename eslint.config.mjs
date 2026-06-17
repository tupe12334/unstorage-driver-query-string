import agentConfig from 'eslint-config-agent'

export default [
  ...agentConfig,
  {
    rules: {
      // Require === and !== to avoid implicit type coercion bugs.
      eqeqeq: ['error', 'always'],
      // Disallow reassigning function parameters. Mutating a parameter hides
      // the original argument, breaks referential reasoning, and is a common
      // source of subtle bugs in parsing/transform code.
      'no-param-reassign': ['error', { props: false }]
    }
  },
  {
    ignores: ['dist/**', 'node_modules/**']
  }
]