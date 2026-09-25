import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

function readPublicFile(path: string): string {
  return readFileSync(
    fileURLToPath(new URL(`../public/${path}`, import.meta.url)),
    "utf8",
  );
}

describe("mobile PWA assets", () => {
  it("defines an installable standalone manifest", () => {
    const manifest = JSON.parse(
      readPublicFile("manifest.webmanifest"),
    ) as {
      display: string;
      start_url: string;
      icons: Array<{ sizes: string; purpose?: string }>;
    };

    expect(manifest.display).toBe("standalone");
    expect(manifest.start_url).toBe("/cptsd/");
    expect(manifest.icons.some((icon) => icon.sizes === "192x192")).toBe(true);
    expect(manifest.icons.some((icon) => icon.sizes === "512x512")).toBe(true);
    expect(
      manifest.icons.some((icon) => icon.purpose?.includes("maskable")),
    ).toBe(true);
  });

  it("pre-caches the app shell for offline use", () => {
    const serviceWorker = readPublicFile("sw.js");

    expect(serviceWorker).toContain('const CACHE_NAME = "cptsd-self-help-v2"');
    expect(serviceWorker).toContain(
      'const APP_BASE = new URL(self.registration.scope).pathname',
    );
    expect(serviceWorker).toContain('request.mode === "navigate"');
    expect(serviceWorker).toContain("self.skipWaiting()");
  });

  it("keeps the iOS and Android icon set in sync", () => {
    for (const icon of [
      "icon-32.png",
      "icon-192.png",
      "icon-512.png",
      "maskable-512.png",
      "apple-touch-icon.png",
    ]) {
      const bytes = readFileSync(
        fileURLToPath(new URL(`../public/${icon}`, import.meta.url)),
      );
      expect(bytes.subarray(0, 8)).toEqual(
        Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
      );
    }
  });
});
