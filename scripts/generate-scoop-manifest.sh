#!/usr/bin/env bash

set -euo pipefail

RELEASE_TAG="$1"
if [ -z "$RELEASE_TAG" ]; then
    echo "Error: Release tag is required"
    echo "Usage: $0 <release_tag>"
    exit 1
fi

VERSION="${RELEASE_TAG#v}"

WIN_ZIP_URL="https://github.com/yotoplay/twine-to-yoto/releases/download/${RELEASE_TAG}/twine2yoto-win.zip"

echo "Downloading Windows zip for SHA256..."
curl -sL -o /tmp/twine2yoto-win.zip "$WIN_ZIP_URL"
WIN_SHA256=$(shasum -a 256 /tmp/twine2yoto-win.zip | cut -d' ' -f1)
rm -f /tmp/twine2yoto-win.zip

echo "Version: $VERSION"
echo "URL: $WIN_ZIP_URL"
echo "SHA256: $WIN_SHA256"

cat > twine2yoto.json <<EOF
{
    "version": "${VERSION}",
    "description": "Convert Twine/Twee documents to TweeJSON and YotoJSON",
    "homepage": "https://github.com/yotoplay/twine-to-yoto",
    "license": "MIT",
    "url": "${WIN_ZIP_URL}",
    "hash": "${WIN_SHA256}",
    "bin": "twine2yoto.exe",
    "checkver": "github",
    "autoupdate": {
        "url": "https://github.com/yotoplay/twine-to-yoto/releases/download/v\$version/twine2yoto-win.zip"
    }
}
EOF

echo "✅ Generated twine2yoto.json"
