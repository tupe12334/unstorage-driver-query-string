import { defineConfig } from 'vite'

export default defineConfig(async ({ command }) => {
  const plugins = []

  if (command === 'build') {
    const { default: dts } = await import('vite-plugin-dts')
    plugins.push(
      dts({
        insertTypesEntry: true,
        exclude: ['**/*.test.ts'],
        tsconfigPath: './tsconfig.build.json'
      })
    )
  }

  return {
    plugins,
    build: {
      lib: {
        entry: 'src/index.ts',
        name: 'UnstorageDriverQueryString',
        formats: ['es', 'cjs'],
        fileName: (format) => `index.${format === 'es' ? 'mjs' : 'js'}`
      },
      rollupOptions: {
        external: ['unstorage', 'qs', 'es-toolkit', 'validator', 'tiny-invariant', 'history']
      }
    }
  }
})