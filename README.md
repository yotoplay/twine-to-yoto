# Yoto Homebrew Tap

This tap contains Yoto tools and utilities for Homebrew.

## Installation

Add this tap to your Homebrew installation:

```bash
brew tap yotoplay/tap
```

## Available Formulae

### twine-to-yoto

Convert Twine/Twee documents to TweeJSON and YotoJSON format.

```bash
brew install yotoplay/tap/twine-to-yoto
```

#### Usage

```bash
# Convert a Twee file to TweeJSON
twine2yoto --type=twee input.twee

# Convert a Twee file to YotoJSON
twine2yoto --type=yoto input.twee
```

For more information, visit: https://github.com/yotoplay/twine-to-yoto
