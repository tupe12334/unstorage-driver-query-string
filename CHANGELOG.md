# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Reduced the bundled package size (#3)
- Stricter lint baseline: enabled `eqeqeq`, `no-console`, `no-throw-literal`, `@typescript-eslint/consistent-type-imports`, `no-param-reassign`, and `array-callback-return` (#5, #6, #8, #10, #18, #21, #23)

## [1.2.0] - 2025-09-27

### Added

- Comprehensive React example demonstrating URL-based filter management
- MIT License

### Changed

- Expanded the README with the React example and clearer demo instructions

## [1.1.0] - 2025-09-25

### Changed

- Packaged as an ESM module with a Vite build and a `type` field for proper module resolution
- Switched the test environment to Vitest with happy-dom (removed jsdom)

## [1.0.0] - 2025-09-25

### Added

- Initial release: an [unstorage](https://unstorage.unjs.io) driver that persists state in the URL query string, with a URL manager and query-string parser
- Unit test suite and ESLint configuration
