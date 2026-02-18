import { convertTweeToYoto, YotoJSON } from "@yotoplay/twee2yoto";
import {
  updateTrackUrls,
  clearPlaceholderTracks,
} from "./audioFileHandler.js";

describe("Given a YotoJSON I can update trackUrls", () => {
  const mockTweeJson = {
    metadata: {
      title: "Spy Mission",
      init: null,
      data: {
        ifid: "F84DACAA-11AB-43E3-8AD4-483BDDA4B134",
        format: "Harlowe",
        creator: "Twine",
        "format-version": "3.3.9",
        start: "Start",
        zoom: 1,
      },
    },
    variables: {
      cover: "https://cdn.yoto.io/myo-cover/star_green.gif",
      customProperty: "My custom value",
      resumeTimeout: 1,
      anotherVar: 42,
      myMap: {
        key1: "value1",
        key2: 100,
      },
    },
    passages: [
      {
        name: "Start",
        metadata: null,
        content:
          "You are Agent Alex, a young spy on a mission to find the hidden treasure before the villains do. Your adventure begins now.",
        choices: [
          {
            text: "Go to the old library to search for clues",
            link: "OldLibrary",
          },
          {
            text: "Investigate the mysterious cave near the beach",
            link: "MysteriousCave",
          },
        ],
      },
    ],
  };

  it("can update the content audio url", () => {
    const yotoJSON = convertTweeToYoto(mockTweeJson, { useTags: false });

    expect(yotoJSON.content.chapters[0].tracks[0].trackUrl).toEqual(
      "[placeholder]",
    );

    updateTrackUrls("Start", "passagetrack", yotoJSON);

    expect(yotoJSON.content.chapters[0].tracks[0].trackUrl).toEqual(
      "yoto:#passagetrack",
    );
  });
});

describe("clearPlaceholderTracks", () => {
  function makeYotoJson(chapters: YotoJSON["content"]["chapters"]): YotoJSON {
    return {
      slug: "test",
      sortkey: "test",
      metadata: {
        author: "",
        category: "",
        cover: { imageL: "" },
        description: "",
      },
      updatedAt: "",
      content: {
        cover: { imageL: "" },
        editSettings: {},
        config: {},
        chapters,
        playbackType: "interactive",
      },
    };
  }

  it("clears tracks to empty array for chapters where all tracks are placeholders", () => {
    const yotoJson = makeYotoJson([
      {
        title: "Start",
        key: "Start",
        display: { icon16x16: "" },
        tracks: [
          {
            key: "Start",
            title: "Start",
            type: "audio",
            format: "",
            trackUrl: "[placeholder]",
            events: {},
          },
        ],
      },
    ]);

    clearPlaceholderTracks(yotoJson);

    expect(yotoJson.content.chapters[0].tracks).toEqual([]);
  });

  it("preserves tracks that have resolved trackUrls", () => {
    const yotoJson = makeYotoJson([
      {
        title: "Start",
        key: "Start",
        display: { icon16x16: "" },
        tracks: [
          {
            key: "Start",
            title: "Start",
            type: "audio",
            format: "",
            trackUrl: "yoto:#abc123",
            events: {},
          },
        ],
      },
    ]);

    clearPlaceholderTracks(yotoJson);

    expect(yotoJson.content.chapters[0].tracks).toHaveLength(1);
    expect(yotoJson.content.chapters[0].tracks[0].trackUrl).toEqual(
      "yoto:#abc123",
    );
  });

  it("handles a mix of resolved and placeholder chapters", () => {
    const yotoJson = makeYotoJson([
      {
        title: "Start",
        key: "Start",
        display: { icon16x16: "" },
        tracks: [
          {
            key: "Start",
            title: "Start",
            type: "audio",
            format: "",
            trackUrl: "yoto:#abc123",
            events: {},
          },
        ],
      },
      {
        title: "Middle",
        key: "Middle",
        display: { icon16x16: "" },
        tracks: [
          {
            key: "Middle",
            title: "Middle",
            type: "audio",
            format: "",
            trackUrl: "[placeholder]",
            events: {},
          },
        ],
      },
      {
        title: "End",
        key: "End",
        display: { icon16x16: "" },
        tracks: [
          {
            key: "End",
            title: "End",
            type: "audio",
            format: "",
            trackUrl: "[placeholder]",
            events: {},
          },
        ],
      },
    ]);

    clearPlaceholderTracks(yotoJson);

    expect(yotoJson.content.chapters[0].tracks).toHaveLength(1);
    expect(yotoJson.content.chapters[1].tracks).toEqual([]);
    expect(yotoJson.content.chapters[2].tracks).toEqual([]);
  });

  it("keeps the chapter structure intact even when tracks are cleared", () => {
    const yotoJson = makeYotoJson([
      {
        title: "NoAudio",
        key: "NoAudio",
        display: { icon16x16: "" },
        tracks: [
          {
            key: "NoAudio",
            title: "NoAudio",
            type: "audio",
            format: "",
            trackUrl: "[placeholder]",
            events: {},
          },
        ],
      },
    ]);

    clearPlaceholderTracks(yotoJson);

    expect(yotoJson.content.chapters[0].title).toEqual("NoAudio");
    expect(yotoJson.content.chapters[0].key).toEqual("NoAudio");
    expect(yotoJson.content.chapters[0].tracks).toEqual([]);
  });
});
