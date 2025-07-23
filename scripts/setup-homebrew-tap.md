# Homebrew Tap Setup Guide

This guide will help you set up the Homebrew tap for `twine-to-yoto`.

## Step 1: Create the GitHub Repository

1. Go to https://github.com/yotoplay
2. Click "New repository"
3. Name it: `homebrew-tap`
4. Make it **Public**
5. Don't initialize with README (we'll push our own)

## Step 2: Push the Tap Files

The tap files are already prepared in the `../homebrew-tap` directory. To push them:

```bash
cd ../homebrew-tap
git remote set-url origin git@github.com:yotoplay/homebrew-tap.git
git push -u origin main
```

## Step 3: Update the Formula with SHA256

After the first release is created on GitHub, you'll need to:

1. Download the release zip file
2. Calculate its SHA256 hash:
   ```bash
   shasum -a 256 twine2yoto-macos-arm64.zip
   ```
3. Update `Formula/twine-to-yoto.rb` with the correct SHA256
4. Update the version number in the formula
5. Commit and push the changes

## Step 4: Test the Installation

Once the tap is set up, users can install with:

```bash
brew tap yotoplay/tap
brew install yotoplay/tap/twine-to-yoto
```

## Step 5: Update Formula for New Releases

For each new release:

1. Update the version in `Formula/twine-to-yoto.rb`
2. Download the new release zip
3. Calculate the new SHA256
4. Update the formula
5. Commit and push

## Automation (Future Enhancement)

Consider automating the formula updates by:
1. Creating a GitHub Action that updates the formula on each release
2. Using a script to calculate SHA256 and update the formula automatically 