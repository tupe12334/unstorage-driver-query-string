import agentConfig from 'eslint-config-agent'

export default [
  ...agentConfig,
  {
    rules: {
      // Require === and !== to avoid implicit type coercion bugs.
      eqeqeq: ['error', 'always'],
      // Require every function's `return` statements to be consistent: either
      // all of them specify a value or none do. A function that returns a
      // value on one branch but falls through on another silently yields
      // `undefined`, which propagates into stored state or URL output in this
      // parsing/transform driver. This makes accidental fall-through a lint
      // error and complements `array-callback-return` below.
      'consistent-return': 'error',
      // Disallow stray `console` calls in this published driver. Debug logs
      // that slip into the package pollute consumers' browser/server output
      // and can leak internal state; `console.warn`/`console.error` stay
      // allowed for the driver's legitimate diagnostics (e.g. the URL-length
      // warning in url-updater.ts).
      'no-console': ['error', { allow: ['warn', 'error'] }],
      // Only allow throwing Error objects. Throwing strings or plain objects
      // (e.g. `throw 'boom'`) loses the stack trace and breaks `instanceof`
      // checks for consumers catching this driver's failures. The driver
      // already throws `QueryStringDriverError` everywhere; this locks that in.
      'no-throw-literal': 'error',
      // Disallow reassigning function parameters. Mutating a parameter hides
      // the original argument, breaks referential reasoning, and is a common
      // source of subtle bugs in parsing/transform code.
      'no-param-reassign': ['error', { props: false }],
      // Force `import type` for type-only imports so they are erased at
      // compile time and never leak into the runtime bundle.
      '@typescript-eslint/consistent-type-imports': 'error',
      // Require a `return` value from every array-method callback that is
      // expected to produce one (`map`, `filter`, `reduce`, `sort`, `every`,
      // `some`, `flatMap`, etc.). A callback that falls through without
      // returning yields `undefined`, which silently corrupts the result:
      // `filter` drops every element, `map` fills the array with `undefined`,
      // `reduce` throws or accumulates wrong values. This driver parses and
      // transforms query-string entries through exactly these array methods,
      // so a missing return is a real correctness bug. `checkForEach` also
      // flags a `forEach` callback that returns a value, which usually means
      // the wrong method (`map`/`filter`) was intended.
      'array-callback-return': ['error', { checkForEach: true }]
    }
  },
  {
    ignores: ['dist/**', 'node_modules/**']
  }
]
