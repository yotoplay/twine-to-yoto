#!/bin/bash

# Download release assets and update homebrew formula
# Usage: ./scripts/download-release-assets.sh <release_tag>

set -e

RELEASE_TAG="$1"
if [ -z "$RELEASE_TAG" ]; then
    echo "Error: Release tag is required"
    echo "Usage: $0 <release_tag>"
    exit 1
fi

VERSION="${RELEASE_TAG#v}"

echo "Processing release: $RELEASE_TAG"
echo "Version: $VERSION"

ARM64_ZIP_URL="https://github.com/yotoplay/twine-to-yoto/releases/download/${RELEASE_TAG}/twine2yoto-macos-arm64.zip"
X64_ZIP_URL="https://github.com/yotoplay/twine-to-yoto/releases/download/${RELEASE_TAG}/twine2yoto-macos-x64.zip"

# Download both zip files
curl -L -o "twine2yoto-macos-arm64.zip" "$ARM64_ZIP_URL"
curl -L -o "twine2yoto-macos-x64.zip" "$X64_ZIP_URL"

# Calculate SHA256 for both
ARM64_SHA256=$(shasum -a 256 twine2yoto-macos-arm64.zip | cut -d' ' -f1)
X64_SHA256=$(shasum -a 256 twine2yoto-macos-x64.zip | cut -d' ' -f1)

pwd
ls -la
git status

echo "ARM64 SHA256: $ARM64_SHA256"
echo "X64 SHA256: $X64_SHA256"

# Create URL files in the homebrew-tap Formula directory
echo "$ARM64_ZIP_URL" > ./Formula/arm64_url.txt
echo "$X64_ZIP_URL" > ./Formula/x64_url.txt

# Create SHA256 files in the homebrew-tap Formula directory
echo "$ARM64_SHA256" > ./Formula/arm64_sha256.txt
echo "$X64_SHA256" > ./Formula/x64_sha256.txt

# Create version file in the homebrew-tap Formula directory
echo "$VERSION" > ./Formula/version.txt

ls -la
git status

echo "Created URL and SHA256 files in homebrew-tap/Formula directory:"
echo "  arm64_url.txt: $(cat ./Formula/arm64_url.txt)"
echo "  x64_url.txt: $(cat ./Formula/x64_url.txt)"
echo "  arm64_sha256.txt: $(cat ./Formula/arm64_sha256.txt)"
echo "  x64_sha256.txt: $(cat ./Formula/x64_sha256.txt)"
echo "  version.txt: $(cat ./Formula/version.txt)" 