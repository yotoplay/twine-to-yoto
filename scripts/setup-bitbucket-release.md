# Bitbucket Semantic-Release Setup

## Required Repository Variables

Set these in your Bitbucket repository settings (Repository Settings > Repository Variables):

### NPM_TOKEN

- **Name:** `NPM_TOKEN`
- **Value:** Your npm authentication token
- **Secured:** ✅ Yes
- **Get token:** https://www.npmjs.com/settings/tokens

### BITBUCKET_ACCESS_TOKEN (Optional)

- **Name:** `BITBUCKET_ACCESS_TOKEN`
- **Value:** Bitbucket access token with repo permissions
- **Secured:** ✅ Yes
- **Get token:** https://bitbucket.org/account/settings/app-passwords/

## Pipeline Configuration

The `bitbucket-pipelines.yml` file includes a release step that:

1. Runs tests
2. Executes semantic-release
3. Creates tags and updates CHANGELOG.md
4. Publishes to npm (if NPM_TOKEN is set)

## Testing Locally

```bash
# Test semantic-release without publishing
npx semantic-release --dry-run

# Run a real release (be careful!)
npm run release
```

## Migration to GitHub

When migrating to GitHub:

1. The GitHub Actions workflow (`.github/workflows/release.yml`) will automatically take over
2. Update the `repositoryUrl` in `.releaserc.json` to the GitHub URL
3. Set up `NPM_TOKEN` in GitHub repository secrets
