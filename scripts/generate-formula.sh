#!/usr/bin/env bash

set -euo pipefail

FORMULA_DIR="./Formula"
TEMPLATE_FILE="../twine-to-yoto/scripts/template.rb"
OUTPUT_FILE="$FORMULA_DIR/twine-to-yoto.rb"

VERSION=$(<"$FORMULA_DIR/version.txt")
ARM64_URL=$(<"$FORMULA_DIR/arm64_url.txt")
ARM64_SHA=$(<"$FORMULA_DIR/arm64_sha256.txt")
X64_URL=$(<"$FORMULA_DIR/x64_url.txt")
X64_SHA=$(<"$FORMULA_DIR/x64_sha256.txt")

TEMPLATE=$(<"$TEMPLATE_FILE")

FORMULA="${TEMPLATE//\{\{VERSION\}\}/$VERSION}"
FORMULA="${FORMULA//\{\{ARM64_URL\}\}/$ARM64_URL}"
FORMULA="${FORMULA//\{\{ARM64_SHA\}\}/$ARM64_SHA}"
FORMULA="${FORMULA//\{\{X64_URL\}\}/$X64_URL}"
FORMULA="${FORMULA//\{\{X64_SHA\}\}/$X64_SHA}"

echo "$FORMULA" > "$OUTPUT_FILE"

echo "✅ Generated $OUTPUT_FILE"