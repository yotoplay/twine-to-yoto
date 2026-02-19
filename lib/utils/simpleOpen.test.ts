import { vi } from "vitest";
import { exec } from "child_process";

vi.mock("child_process", () => ({
  exec: vi.fn((_cmd: string, callback: Function) => callback(null, "", "")),
}));

const mockedExec = vi.mocked(exec);

describe("simpleOpen", () => {
  const url = "https://example.com/auth?code=123";

  beforeEach(() => {
    vi.resetModules();
    mockedExec.mockClear();
  });

  it("uses 'open' on macOS", async () => {
    vi.stubGlobal("process", { ...process, platform: "darwin" });
    const { simpleOpen } = await import("./simpleOpen.js");
    await simpleOpen(url);
    expect(mockedExec).toHaveBeenCalledWith(
      `open "${url}"`,
      expect.any(Function),
    );
  });

  it("uses 'start' with empty title on Windows", async () => {
    vi.stubGlobal("process", { ...process, platform: "win32" });
    const { simpleOpen } = await import("./simpleOpen.js");
    await simpleOpen(url);
    expect(mockedExec).toHaveBeenCalledWith(
      `start "" "${url}"`,
      expect.any(Function),
    );
  });

  it("uses 'xdg-open' on Linux", async () => {
    vi.stubGlobal("process", { ...process, platform: "linux" });
    const { simpleOpen } = await import("./simpleOpen.js");
    await simpleOpen(url);
    expect(mockedExec).toHaveBeenCalledWith(
      `xdg-open "${url}"`,
      expect.any(Function),
    );
  });

  it("does not throw if exec fails", async () => {
    vi.stubGlobal("process", { ...process, platform: "darwin" });
    mockedExec.mockImplementation(
      // @ts-expect-error exec overload types are complex, simplified for test
      (_cmd: string, callback: (err: Error | null) => void) =>
        callback(new Error("fail")),
    );
    const { simpleOpen } = await import("./simpleOpen.js");
    await expect(simpleOpen(url)).resolves.toBeUndefined();
  });
});
