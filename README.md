# twine-to-yoto

A command line to to help you convert [Twine/twee](https://twinery.org/) documents to YotoJSON format for interactive audio content.

## How To

### build it

```
npm install
npm run build
```

#### as a binary exe

```
npm install
npm run build:exe
```

### test it

```
npm run test
```

### run it

See [docs.md](docs.md) for usage instructions

## Notes for maintainers/contributors

### release it

This project uses [semantic-release](https://github.com/semantic-release/semantic-release) for automated versioning and releases.

#### Commit Convention

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

- `feat:` - New features (minor version bump)
- `fix:` - Bug fixes (patch version bump)
- `BREAKING CHANGE:` - Breaking changes (major version bump)
- `chore:, docs:, style:, refactor:, perf:, test:` - No version bump

#### Automated Release

Releases are automatically triggered when pushing to the `main` branch via GitHub Actions. The process:

1. Analyzes commits since last release
2. Determines next version based on commit types
3. Updates CHANGELOG.md
4. Creates git tag
5. Publishes to npm (if configured)

#### GitHub Setup

The GitHub Actions workflow will automatically handle releases. Ensure these repository secrets are set in GitHub:

- `NPM_TOKEN` - NPM access token (optional, for npm publishing)
- `HOMEBREW_TAP_TOKEN` - GitHub PAT with write access to `yotoplay/homebrew-tap` and `yotoplay/scoop-bucket` (used to push formula/manifest updates after each release)

Note: NPM publishing is currently disabled. To enable it, add `@semantic-release/npm` to the plugins in `.releaserc.json`.

#### Homebrew and Scoop

Each release (on push to `main` when semantic-release creates a new tag) builds macOS and Windows binaries, publishes GitHub release assets, then triggers two workflows:

- **Homebrew** – [update-homebrew.yml](.github/workflows/update-homebrew.yml) checks out [yotoplay/homebrew-tap](https://github.com/yotoplay/homebrew-tap), downloads the macOS zips from the new release, runs [scripts/download-release-assets.sh](scripts/download-release-assets.sh) and [scripts/generate-formula.sh](scripts/generate-formula.sh), and pushes an updated Ruby formula. Users install with `brew tap yotoplay/tap && brew install twine-to-yoto`.
- **Scoop** – [update-scoop.yml](.github/workflows/update-scoop.yml) checks out [yotoplay/scoop-bucket](https://github.com/yotoplay/scoop-bucket), runs [scripts/generate-scoop-manifest.sh](scripts/generate-scoop-manifest.sh) to produce an updated `twine2yoto.json` from the new Windows zip, and pushes the change. Users install with `scoop bucket add yotoplay https://github.com/yotoplay/scoop-bucket && scoop install twine2yoto`.

Both workflows can also be run manually via **Actions → workflow_dispatch** with a `release_tag` input (e.g. `v1.22.0`) if you need to refresh a package manager without cutting a new release.

#### Manual Release

To run a release manually:

```bash
npm run release
```
