# twine-to-yoto

A command line to to help you convert twine -> twee documents to TweeJSON and to YotoJSON

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

See docs.md for usage instructions

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

Note: NPM publishing is currently disabled. To enable it, add `@semantic-release/npm` to the plugins in `.releaserc.json`.

#### Manual Release

To run a release manually:

```bash
npm run release
```

####
