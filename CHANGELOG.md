# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed

- Restructured the repository to follow the Quartz community plugin template:
  `src/components/`, client script in `remark42.inline.ts`, `./types` and
  `./components` export subpaths, template build config, ESLint, Prettier,
  Vitest, Changesets and CI.
- `dist/` is now committed so Quartz can skip the build step on install.

## [2.0.0]

### Changed

- Ported to the Quartz 5 plugin structure (breaks compatibility with the
  Quartz 4 version).

### Added

- `idField` option: key comment threads by a stable frontmatter field instead
  of the page URL.
