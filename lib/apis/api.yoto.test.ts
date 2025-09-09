import MockAdapter from "axios-mock-adapter";
import {
  client,
  uploadIcon,
} from "./api.yoto.js";

const YOTO_API_URL = "https://api.yotoplay.com";
const YOTO_AUTH_URL = "https://login.yotoplay.com";

// Use the custom axios client instance for all tests
const mock = new MockAdapter(client);


describe("uploadIcon", () => {
  // Remove the duplicate mock declaration and reuse the one above
  beforeEach(() => {
    mock.reset();
  });

  afterEach(() => {
    mock.reset();
  });

  it("uploads the icon successfully and return data for a PNG image", async () => {
    const access_token = "mock-token";
    const iconFile = Buffer.from("mock-image-data");
    const mimetype = "image/png";
    const responseData = { success: true };

    mock
      .onPost(
        `${YOTO_API_URL}/media/displayIcons/user/me/upload?autoConvert=true`,
      )
      .reply(200, responseData);

    const result = await uploadIcon(access_token, iconFile, mimetype);

    expect(result).toEqual(responseData);
    const postHistory = mock.history.post[0];
    expect(postHistory).toBeDefined();
    expect(postHistory.url).toBe(
      "https://api.yotoplay.com/media/displayIcons/user/me/upload?autoConvert=true",
    );
    const headers = postHistory.headers as Record<string, string>;
    expect(headers.Authorization).toBe(`Bearer ${access_token}`);
    expect(headers["Content-Type"]).toBe(mimetype);
  });

  it("uploads the icon successfully and return data for a GIF image", async () => {
    const access_token = "mock-token";
    const iconFile = Buffer.from("mock-image-data");
    const mimetype = "image/gif";
    const responseData = { success: true };

    mock
      .onPost(
        `${YOTO_API_URL}/media/displayIcons/user/me/upload?autoConvert=false`,
      )
      .reply(200, responseData);

    const result = await uploadIcon(access_token, iconFile, mimetype);

    expect(result).toEqual(responseData);
    const postHistory = mock.history.post[0];
    expect(postHistory).toBeDefined();
    expect(postHistory.url).toBe(
      "https://api.yotoplay.com/media/displayIcons/user/me/upload?autoConvert=false",
    );
    const headers = postHistory.headers as Record<string, string>;
    expect(headers.Authorization).toBe(`Bearer ${access_token}`);
    expect(headers["Content-Type"]).toBe(mimetype);
  });

  it("throws an error if the API request fails", async () => {
    const access_token = "mock-token";
    const iconFile = Buffer.from("mock-image-data");
    const mimetype = "image/png";

    mock
      .onPost(
        `${YOTO_API_URL}/media/displayIcons/user/me/upload?autoConvert=true`,
      )
      .reply(500, { message: "Internal Server Error" });

    await expect(
      uploadIcon(access_token, iconFile, mimetype),
    ).rejects.toThrow();
  });
});
