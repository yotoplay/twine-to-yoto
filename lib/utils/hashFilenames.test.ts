import { generateSha256Base64Filename } from "./hashFilenames.js";
import { promises as fs } from "node:fs";
import fsPath from "node:path";

describe("sha256Hash", () => {
  it("should generate sha256 hash in base64url format from buffer", async () => {
    const buffer = Buffer.from(
      await fs.readFile(fsPath.resolve("./", "./__tests__/data/jokes.mp3")),
    );
    const hash = await generateSha256Base64Filename(buffer);

    expect(hash).toEqual("CDL3g1M0VI-uQluLIPpC9_buEHD3M773g6p033TLJbA");
  });
});
