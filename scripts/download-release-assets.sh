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

          # Download both zip files
          curl -L -o "twine2yoto-macos-arm64-${VERSION}.zip" \
            "https://github.com/yotoplay/twine-to-yoto/releases/download/${RELEASE_TAG}/twine2yoto-macos-arm64-${VERSION}.zip"
          
          curl -L -o "twine2yoto-macos-x64-${VERSION}.zip" \
            "https://github.com/yotoplay/twine-to-yoto/releases/download/${RELEASE_TAG}/twine2yoto-macos-x64-${VERSION}.zip"

          # Calculate SHA256 for both
          ARM64_SHA256=$(shasum -a 256 twine2yoto-macos-arm64-${VERSION}.zip | cut -d' ' -f1)
          X64_SHA256=$(shasum -a 256 twine2yoto-macos-x64-${VERSION}.zip | cut -d' ' -f1)

echo "ARM64 SHA256: $ARM64_SHA256"
echo "X64 SHA256: $X64_SHA256"

# Update the formula using awk for more precise control
awk -v version="$VERSION" -v arm64_sha="$ARM64_SHA256" -v x64_sha="$X64_SHA256" '
{
  # Update version
  gsub(/version "[^"]*"/, "version \"" version "\"")
  
  # Update URLs
  gsub(/url "https:\/\/github\.com\/yotoplay\/twine-to-yoto\/releases\/download\/v[^"]*/, "url \"https://github.com/yotoplay/twine-to-yoto/releases/download/v" version)
  
  # Update SHA256 values - track which one we are updating
  if ($0 ~ /arm64/) {
    in_arm64 = 1
  }
  if ($0 ~ /x64/) {
    in_arm64 = 0
  }
  if ($0 ~ /sha256 "PLACEHOLDER_SHA256"/) {
    if (in_arm64) {
      gsub(/sha256 "PLACEHOLDER_SHA256"/, "sha256 \"" arm64_sha "\"")
    } else {
      gsub(/sha256 "PLACEHOLDER_SHA256"/, "sha256 \"" x64_sha "\"")
    }
  }
  print
}' Formula/twine-to-yoto.rb > Formula/twine-to-yoto.rb.tmp && mv Formula/twine-to-yoto.rb.tmp Formula/twine-to-yoto.rb

# Show the updated formula for debugging
echo "Updated formula:"
cat Formula/twine-to-yoto.rb 