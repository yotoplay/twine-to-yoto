# Homebrew Installation

`twine-to-yoto` is available via Homebrew for easy installation on macOS.

## Installation

### Add the Yoto Tap

First, add the Yoto Homebrew tap to your system:

```bash
brew tap yotoplay/tap
```

### Install twine-to-yoto

Install the tool using Homebrew:

```bash
brew install yotoplay/tap/twine-to-yoto
```

## Usage

After installation, you can use `twine2yoto` directly from your terminal:

```bash
# Convert a Twee file to TweeJSON
twine2yoto --type=twee input.twee

# Convert a Twee file to YotoJSON
twine2yoto --type=yoto input.twee

# Get help
twine2yoto --help
```

## Updating

To update to the latest version:

```bash
brew upgrade yotoplay/tap/twine-to-yoto
```

## Uninstalling

To remove the tool:

```bash
brew uninstall yotoplay/tap/twine-to-yoto
```

## Manual Installation

If you prefer not to use Homebrew, you can:

1. Download the latest release from [GitHub Releases](https://github.com/yotoplay/twine-to-yoto/releases)
2. Extract the zip file
3. Move the `twine2yoto` binary to a directory in your PATH

## Development

For development and building from source, see the main [README.md](README.md). 