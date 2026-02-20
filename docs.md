# twine-to-yoto

A command line to to help you convert twine -> twee documents to TweeJSON and to YotoJSON

#### installation

**macOS (Homebrew)**

```bash
brew tap yotoplay/tap
brew install twine-to-yoto
```

**Windows (Scoop)**

```powershell
scoop bucket add yotoplay https://github.com/yotoplay/scoop-bucket
scoop install twine2yoto
```

**Manual download**

Grab the latest zip from the [releases page](https://github.com/yotoplay/twine-to-yoto/releases).

#### requirements

No configuration files needed! The tool will prompt you for your ElevenLabs API key when first needed for audio generation (requires `--auto` flag).

#### authentication

You can authenticate with Yoto ahead of time using the `login` command:

```bash
./twine2yoto-macos login
```

This opens a browser for device code authentication and stores your tokens locally. Subsequent commands that need auth (e.g. `--upload`) will use the stored tokens automatically.

To clear stored credentials:

```bash
./twine2yoto-macos --clearAuth
```

### run it

```
./twine2yoto-macos --help

Commands:
  twine2yoto login          Authenticate with Yoto

Options:
      --version    Show version number                                 [boolean]
  -i, --input      Input directory path - must contain at least a *.twee file
                                                                        [string]
  -t, --type       Output type (twee or yoto)         [string] [default: "yoto"]
  -o, --output     Output directory                                     [string]
  -f, --force      force empty the output directory   [boolean] [default: false]
  -u, --upload     uploads the content to YotoCloud   [boolean] [default: false]
  -c, --cardid     a card id that the content will be uploaded to       [string]
  -a, --auto       Enable automatic audio generation via ElevenLabs
                                                      [boolean] [default: false]
      --clearAuth  Clear stored authentication configuration
                                                      [boolean] [default: false]
  -p, --preset     Transcode preset (e.g. music for AAC, auto for auto-detect)
                                                                        [string]
  -h, --help       Show help                                           [boolean]

```

#### yotoJSON

```bash
# MacOS
# just the YotoJSON format
./twine2yoto-macos --type yoto --i ./twees/spyshort

# with output directory (passages without audio will have empty tracks)
./twine2yoto-macos --type yoto --i ./twees/spyshort --output ./.out

# with auto generated audio via ElevenLabs and upload to Yoto Cloud
./twine2yoto-macos --type yoto --i ./twees/spyshort --output ./.out --auto --upload

# upload to an existing Yoto card
./twine2yoto-macos --type yoto --i ./twees/spyshort --output ./.out --upload --cardid=xxxxx
```

#### tweeJSON

```bash
# Just the tweeJSON format
./twine2yoto-macos --type twee --i ./twees/spymission2.twee -output ./.outtwee
```

### Voice IDs

The ElevenLabs Voice IDs must be defined in the `Twee ::StoryInit` section, for example:

```plaintext
(set: $defaultVoiceId to "JBFqnCBsd6RMkjVDRZzb")
```

Here are some example voice IDs:

- Charlotte `XB0fDUnXU5powFXDhCwa` British Female
- George `JBFqnCBsd6RMkjVDRZzb` British Male

### Cover Image

Place an `image.png` file in the same directory as your `.twee` file. When using `--upload`, the tool will automatically detect and upload it as the default cover art for your card.

