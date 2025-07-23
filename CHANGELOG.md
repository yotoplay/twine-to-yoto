# [1.12.0](https://github.com/yotoplay/twine-to-yoto/compare/v1.11.1...v1.12.0) (2025-07-23)


### Features

* add multi-architecture support for macOS ARM64 and x64 ([d11dd51](https://github.com/yotoplay/twine-to-yoto/commit/d11dd514aa4551403f74d5c60fdf7d7c6af35e8c))

## [1.11.1](https://github.com/yotoplay/twine-to-yoto/compare/v1.11.0...v1.11.1) (2025-07-23)


### Bug Fixes

* ensure GitHub releases are published immediately and add workflow debugging ([2fdf289](https://github.com/yotoplay/twine-to-yoto/commit/2fdf28913f5e43e76e76da19124a15d7ed180041))

# [1.11.0](https://github.com/yotoplay/twine-to-yoto/compare/v1.10.1...v1.11.0) (2025-07-23)


### Features

* add automated Homebrew formula updates on GitHub releases ([07f07c9](https://github.com/yotoplay/twine-to-yoto/commit/07f07c94d5661487ae1f5f23026e86ab4769676b))

## [1.10.1](https://github.com/yotoplay/twine-to-yoto/compare/v1.10.0...v1.10.1) (2025-07-23)


### Bug Fixes

* revert README.md and create separate BREW.md for Homebrew instructions ([f8a6d4c](https://github.com/yotoplay/twine-to-yoto/commit/f8a6d4ccf0b23dc5d2254656d3632e62bd7ffc01))

# [1.10.0](https://github.com/yotoplay/twine-to-yoto/compare/v1.9.0...v1.10.0) (2025-07-23)


### Features

* add GitHub releases with binary assets for Homebrew distribution ([13db442](https://github.com/yotoplay/twine-to-yoto/commit/13db442d96ee11a82bbc63f577d3adfc1cfffe39))
* add Homebrew tap setup documentation and update script ([81e8a16](https://github.com/yotoplay/twine-to-yoto/commit/81e8a16e072d8a1b47c07546305fc2057ddcbaab))

# [1.9.0](https://github.com/yotoplay/twine-to-yoto/compare/v1.8.2...v1.9.0) (2025-07-23)


### Features

* complete GitHub migration by removing all Bitbucket references ([c17efec](https://github.com/yotoplay/twine-to-yoto/commit/c17efecdb515213c291172c63471a4ca8b1eace6))

### Features

* migrate repository to GitHub and update semantic-release configuration ([022acf7](https://github.com/yotoplay/twine-to-yoto/commit/022acf7e5575e2bf30593a52bd380a44527aac9b))

# [1.8.0](https://github.com/yotoplay/twine-to-yoto/compare/v1.7.4...v1.8.0) (2025-07-23)


### Bug Fixes

* remove npm publishing from semantic-release to prevent token errors ([7c974ff](https://github.com/yotoplay/twine-to-yoto/commit/7c974ff91a7510b9e705addac6a8630b219ec814))
* update test mock to use simpleOpen instead of open module ([e6ad48b](https://github.com/yotoplay/twine-to-yoto/commit/e6ad48b32e76e1f69edad25ffdd8764d4f45f4a7))


### Features

* add semantic-release with changelog generation ([ba65b36](https://github.com/yotoplay/twine-to-yoto/commit/ba65b36f693026ef63edccea4a97b13279498f2d))
* configure semantic-release for GitHub Actions ([e628702](https://github.com/yotoplay/twine-to-yoto/commit/e628702171b77208f63a434999a689d66816fe49))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [1.7.4](https://github.com/yotoplay/twine-to-yoto/compare/v1.7.3...v1.7.4) (2025-07-23)

### Features

- add dedicated build script for zip packaging with file exclusions ([4f78d9e](https://github.com/yotoplay/twine-to-yoto/commit/4f78d9e))

## [1.7.3](https://github.com/yotoplay/twine-to-yoto/compare/v1.7.2...v1.7.3) (2025-07-23)

### Bug Fixes

- prevent pkg bundling errors caused by open and configstore by inlining them ([c462c76](https://github.com/yotoplay/twine-to-yoto/commit/c462c76))
