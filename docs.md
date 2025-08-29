# twine-to-yoto

A command line to to help you convert twine -> twee documents to TweeJSON and to YotoJSON

#### requirements

a single .env file at the root containing the following - see .example.env:

```
ELEVENLABS_API_KEY=xxxx   # Your Elevenlabs API Key for generating audio tracks, contact Yoto if you need help with this
YOTO_CLIENT_ID=xxxx       # Your Yoto Api Key for uploading to Yoto Cloud
```

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

