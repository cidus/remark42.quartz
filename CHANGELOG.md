# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-10-01

First release of this fork as a Quartz 5 plugin. Breaks compatibility with
the Quartz 4 version ([OCDkirby/remark42.quartz](https://github.com/OCDkirby/remark42.quartz)).

### Added

- `idField` option: key comment threads by a stable frontmatter field instead
  of the page URL, so renaming a page doesn't orphan its comments.
- Comments can be hidden per page with `comments: false` in frontmatter.

### Changed

- Ported to the Quartz 5 plugin structure, following the
  [Quartz community plugin template](https://github.com/quartz-community/plugin-template):
  client script in `remark42.inline.ts`, `./types` and `./components` export
  subpaths, template build config, ESLint, Prettier, Vitest and CI.
- `dist/` is committed so Quartz skips the build step on install.

### Fixed

- The widget mounts on first load without waiting for a Quartz `nav` event.
- Comments no longer disappear after SPA navigation: the running Remark42
  instance is destroyed before Quartz patches the DOM.
- An unset `theme` follows Quartz's current theme instead of always rendering
  light comments.

[2.0.0]: https://github.com/cidus/remark42.quartz/releases/tag/v2.0.0
