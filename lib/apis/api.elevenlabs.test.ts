import MockAdapter from "axios-mock-adapter";
import { client, textToSpeech } from "./api.elevenlabs.js";
const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1";
describe("textToSpeech", () => {
  let mock: any;

  beforeEach(() => {
    mock = new MockAdapter(client);
  });

  afterEach(() => {
    mock.reset();
  });

  it("allows the voiceId to be specified amd returns the text-to-speech data", async () => {
    process.env.ELEVENLABS_API_KEY = "mocked-api-key";
    const voiceId = "mock-voice-id";

    mock
      .onPost(
        `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}?output_format=mp3_44100_64&enable_logging=true`,
      )
      .reply(200, Buffer.from("mock-audio-data"));

    const result = await textToSpeech("Hello, world!", voiceId);
    expect(result).toEqual({ data: Buffer.from("mock-audio-data") });
  });

  it("throws an error if the ELEVENLABS_API_KEY is missing", async () => {
    delete process.env.ELEVENLABS_API_KEY;
    await expect(
      textToSpeech("Hello, world!", "mock-voice-id"),
    ).rejects.toThrow("ELEVENLABS_API_KEY is not set");
  });
});
