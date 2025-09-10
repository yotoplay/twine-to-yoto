import MockAdapter from "axios-mock-adapter";
import { vi } from "vitest";
import { client, textToSpeech } from "./api.elevenlabs.js";

const ELEVENLABS_API_URL = "https://api.elevenlabs.io/v1";

// Mock the elevenLabsAuth module
vi.mock("../auth/elevenLabsAuth.js", () => ({
  ensureElevenLabsApiKey: vi.fn(),
}));

describe("textToSpeech", () => {
  let mock: any;
  let mockEnsureElevenLabsApiKey: any;

  beforeEach(async () => {
    mock = new MockAdapter(client);
    const { ensureElevenLabsApiKey } = await import("../auth/elevenLabsAuth.js");
    mockEnsureElevenLabsApiKey = ensureElevenLabsApiKey;
  });

  afterEach(() => {
    mock.reset();
    vi.clearAllMocks();
  });

  it("allows the voiceId to be specified and returns the text-to-speech data", async () => {
    mockEnsureElevenLabsApiKey.mockResolvedValue("mocked-api-key");
    const voiceId = "mock-voice-id";

    mock
      .onPost(
        `${ELEVENLABS_API_URL}/text-to-speech/${voiceId}?output_format=mp3_44100_64&enable_logging=true`,
      )
      .reply(200, Buffer.from("mock-audio-data"));

    const result = await textToSpeech("Hello, world!", voiceId);
    expect(result).toEqual({ data: Buffer.from("mock-audio-data") });
    expect(mockEnsureElevenLabsApiKey).toHaveBeenCalled();
  });

  it("throws an error if the API key cannot be obtained", async () => {
    mockEnsureElevenLabsApiKey.mockRejectedValue(new Error("API key not available"));
    
    await expect(
      textToSpeech("Hello, world!", "mock-voice-id"),
    ).rejects.toThrow("API key not available");
  });
});
