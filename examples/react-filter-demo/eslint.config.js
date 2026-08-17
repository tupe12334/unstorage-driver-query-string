import agent from 'eslint-config-agent/recommended-incremental'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

/**
 * This demo previously used the stock Vite React template config
 * (`@eslint/js` + `typescript-eslint` recommended + react-hooks +
 * react-refresh). It now extends the shared `eslint-config-agent` instead, so
 * the example is linted with the same ruleset as the driver itself.
 *
 * The `recommended-incremental` preset is used deliberately: the strict default
 * surfaces ~100 pre-existing violations in this demo, which cannot be fixed
 * safely in one pass. `recommended-incremental` disables the most divisive
 * rules and downgrades the rest to warnings, so `npm run lint` exits 0 while
 * the full backlog is still reported and can be burned down.
 */
export default defineConfig([
  globalIgnores(['dist']),
  ...agent,
  // Vite-specific fast-refresh check, which the shared config does not cover.
  reactRefresh.configs.vite,
])
