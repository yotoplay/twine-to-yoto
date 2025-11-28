# twine-to-yoto

A command line to to help you convert twine -> twee documents to TweeJSON and to YotoJSON

#### requirements

No configuration files needed! The tool will prompt you for your ElevenLabs API key when first needed for audio generation.

You will be prompted for a Yoto Account via browser based authentication if you have not logged in already.

### run it

```
./twine2yoto-macos --help

Options:
      --version  Show version number                                   [boolean]
  -i, --input    Input file path                                        [string]
  -t, --type     Output type (twee or yoto)           [string] [default: "yoto"]
  -o, --output   Output directory                                       [string]
  -z, --zip      zip the output                                        [boolean]
  -u, --upload   uploads the content to Yoto Cloud; requires a token parameter
                                                                [default: false]
  -c, --cardid   a card id that the content will be uploaded to, if not supplied
                  a new card will be generated
  -h, --help     Show help                                             [boolean]

```

#### yotoJSON

```bash
# MacOS
# just the YotoJSON format
./twine2yoto-macos --type yoto --i ./twees/spyshort

# with auto generated files and upload to Yoto Cloud
./twine2yoto-macos --type yoto --i ./twees/spyshort --output ./.out --upload=true

# with auto generated files and upload to Yoto Cloud to an existing Yoto cardid
./twine2yoto-macos --type yoto --i ./twees/spyshort --output ./.out --upload=true --cardid=xxxxx
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

