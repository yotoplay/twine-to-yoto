## [1.18.1](https://github.com/yotoplay/twine-to-yoto/compare/v1.18.0...v1.18.1) (2025-12-19)


### Bug Fixes

* remove skipMediaFileCheck - this is a necesary step ([ec41b58](https://github.com/yotoplay/twine-to-yoto/commit/ec41b581657c6b3110a31712a4a97ac035cbde86))

# [1.18.0](https://github.com/yotoplay/twine-to-yoto/compare/v1.17.1...v1.18.0) (2025-11-28)


### Features

* adds covert art support (image.png) ([f05adc3](https://github.com/yotoplay/twine-to-yoto/commit/f05adc31ce3bc5ce5ef9fe5c0af870a2c7083f58))
* adds the ability to save a custom Cover Art image.png in the root of the twee folder ([201def9](https://github.com/yotoplay/twine-to-yoto/commit/201def9271561065bed478d8c0f2df0aaff79a75))
* now uses elevenlabs_v3 model by default ([ee75672](https://github.com/yotoplay/twine-to-yoto/commit/ee75672a8336e1fdd3ce88d14f95d28e34561d95))

## [1.17.1](https://github.com/yotoplay/twine-to-yoto/compare/v1.17.0...v1.17.1) (2025-11-28)


### Bug Fixes

* ensures StoryInit and errors if it's not correctly specified ([3e1c256](https://github.com/yotoplay/twine-to-yoto/commit/3e1c25689a98276cec880b56f5f60613dd03bb56))

# [1.17.0](https://github.com/yotoplay/twine-to-yoto/compare/v1.16.2...v1.17.0) (2025-09-10)


### Features

* make ElevenLabs API key optional and prompt at startup ([1d05ae9](https://github.com/yotoplay/twine-to-yoto/commit/1d05ae9d073b5d55df62db2a650a2a5fe220fda0))

## [1.16.2](https://github.com/yotoplay/twine-to-yoto/compare/v1.16.1...v1.16.2) (2025-09-10)


### Bug Fixes

* prevent multiple simultaneous ElevenLabs API key prompts ([6b714d8](https://github.com/yotoplay/twine-to-yoto/commit/6b714d845a7ee0dab70f56c8ee9d7e980851dc38))

## [1.16.1](https://github.com/yotoplay/twine-to-yoto/compare/v1.16.0...v1.16.1) (2025-09-10)


### Bug Fixes

* replace placeholder client ID with actual Yoto client ID ([53a441d](https://github.com/yotoplay/twine-to-yoto/commit/53a441d0c37da2e6d74d17280045f960124cbb21))

# [1.16.0](https://github.com/yotoplay/twine-to-yoto/compare/v1.15.7...v1.16.0) (2025-09-10)


### Features

* replace .env file with interactive API key prompt for Homebrew distribution ([5644828](https://github.com/yotoplay/twine-to-yoto/commit/5644828f91ab23941b3c1bc75712d5711a8a6a2e))

## [1.15.7](https://github.com/yotoplay/twine-to-yoto/compare/v1.15.6...v1.15.7) (2025-09-09)


### Bug Fixes

* restore YOTO_CLIENT_ID environment variable for tests ([8c49c1e](https://github.com/yotoplay/twine-to-yoto/commit/8c49c1edaa0cfde667729da9dcf3d92736ca4205))

## [1.15.6](https://github.com/yotoplay/twine-to-yoto/compare/v1.15.5...v1.15.6) (2025-07-24)


### Bug Fixes

* update generate-formula.js to use ES modules and correct file paths ([4ec5537](https://github.com/yotoplay/twine-to-yoto/commit/4ec55371a6d40cef4c1718e0628b3383ef504fc6))

## [1.15.5](https://github.com/yotoplay/twine-to-yoto/compare/v1.15.4...v1.15.5) (2025-07-24)


### Bug Fixes

* rever to using ,/Formula directory ([1ea74fe](https://github.com/yotoplay/twine-to-yoto/commit/1ea74fe4521917e9b01bd5c6afb9bd306741a4bd))

## [1.15.4](https://github.com/yotoplay/twine-to-yoto/compare/v1.15.3...v1.15.4) (2025-07-24)


### Bug Fixes

* remove NODE_AUTH_TOKEN from release workflow since npm publishing is disabled ([cea14ee](https://github.com/yotoplay/twine-to-yoto/commit/cea14ee8071cc6c8098e6af18139de6b846592be))

## [1.15.3](https://github.com/yotoplay/twine-to-yoto/compare/v1.15.2...v1.15.3) (2025-07-24)


### Bug Fixes

* update script to work with separate homebrew-tap repository in GitHub Actions ([787fb7a](https://github.com/yotoplay/twine-to-yoto/commit/787fb7a9f9fefb2b17541c24cd1296b8e8652446))

## [1.15.2](https://github.com/yotoplay/twine-to-yoto/compare/v1.15.1...v1.15.2) (2025-07-24)


### Bug Fixes

* use file-based variables for Homebrew formula instead of awk string replacement ([688024f](https://github.com/yotoplay/twine-to-yoto/commit/688024f41611d22d00c7322b136468e6cef34f15))

## [1.15.1](https://github.com/yotoplay/twine-to-yoto/compare/v1.15.0...v1.15.1) (2025-07-24)


### Bug Fixes

* pull build step back out of semantic release ([4e5df63](https://github.com/yotoplay/twine-to-yoto/commit/4e5df636200363111fb4478cbbfd58366c351454))

# [1.15.0](https://github.com/yotoplay/twine-to-yoto/compare/v1.14.0...v1.15.0) (2025-07-24)


### Bug Fixes

* update semantic-release permissions and repository URL ([057b01e](https://github.com/yotoplay/twine-to-yoto/commit/057b01e0c8aff20e656d5cf13db940ea59a66e52))


### Features

* add build:all script for semantic-release prepareCmd ([e97c889](https://github.com/yotoplay/twine-to-yoto/commit/e97c889b673f14442f539b1d70552787e37c96aa))

# [1.14.0](https://github.com/yotoplay/twine-to-yoto/compare/v1.13.1...v1.14.0) (2025-07-24)


### Features

* optimize release workflow with semantic-release asset upload ([aac742a](https://github.com/yotoplay/twine-to-yoto/commit/aac742a4247ae8a7d887a6ca8992f25d0145cf21))

## [1.13.1](https://github.com/yotoplay/twine-to-yoto/compare/v1.13.0...v1.13.1) (2025-07-23)


### Bug Fixes

* add macOS code signing to release workflow ([7d7e201](https://github.com/yotoplay/twine-to-yoto/commit/7d7e201acc2d635865786f2286615a20aea0e279))
* correct zip file names with version numbers in workflows ([d5e8b24](https://github.com/yotoplay/twine-to-yoto/commit/d5e8b24a63b52840aaca06043fe6675f44f0bb81))
* remove duplicate test step from Windows build job ([bbdbf80](https://github.com/yotoplay/twine-to-yoto/commit/bbdbf8085cec56ffdc500918789d86eaf713c1b3))

# [1.13.0](https://github.com/yotoplay/twine-to-yoto/compare/v1.12.0...v1.13.0) (2025-07-23)


### Features

* add Windows build to release workflow ([c1d3b7a](https://github.com/yotoplay/twine-to-yoto/commit/c1d3b7a506a1798f2a9d5cd9b277336ef5646e82))

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
