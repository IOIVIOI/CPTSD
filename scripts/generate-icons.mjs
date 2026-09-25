import { deflateSync } from "node:zlib";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const outputDirectory = resolve(root, "public");

mkdirSync(outputDirectory, { recursive: true });

const COLORS = {
  terracotta: [47, 125, 246, 255],
  cream: [247, 251, 255, 255],
  honey: [217, 236, 255, 255],
  sage: [255, 255, 255, 255],
};

function crc32(buffer) {
  let crc = 0xffffffff;

  for (const byte of buffer) {
    crc ^= byte;

    for (let index = 0; index < 8; index += 1) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const typeBuffer = Buffer.from(type, "ascii");
  const payload = Buffer.concat([typeBuffer, data]);
  const chunk = Buffer.alloc(12 + data.length);
  chunk.writeUInt32BE(data.length, 0);
  payload.copy(chunk, 4);
  chunk.writeUInt32BE(crc32(payload), 8 + data.length);
  return chunk;
}

function blend(pixel, color, alpha) {
  const inverse = 1 - alpha;
  return [
    Math.round(pixel[0] * inverse + color[0] * alpha),
    Math.round(pixel[1] * inverse + color[1] * alpha),
    Math.round(pixel[2] * inverse + color[2] * alpha),
    255,
  ];
}

function ringCoverage(distance, radius, halfWidth) {
  return Math.max(0, Math.min(1, 1.2 - (Math.abs(distance - radius) - halfWidth)));
}

function segmentCoverage(value, halfWidth) {
  return Math.max(0, Math.min(1, 1.2 - (Math.abs(value) - halfWidth)));
}

function createIcon(size, maskable = false) {
  const pixels = Buffer.alloc(size * size * 4);
  const center = size / 2;
  const ringRadius = size * 0.258;
  const ringHalfWidth = size * 0.034;
  const centerRadius = size * 0.084;
  const lineHalfWidth = size * 0.034;
  const groundY = size * 0.7;
  const safeScale = maskable ? 0.82 : 1;

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      let pixel = COLORS.terracotta;
      const dx = (x + 0.5 - center) / safeScale;
      const dy = (y + 0.5 - center) / safeScale;
      const distance = Math.hypot(dx, dy);
      const groundDistance = Math.abs(y + 0.5 - groundY) / safeScale;
      const groundX = Math.abs(x + 0.5 - center) / safeScale;
      const inGround = groundX <= size * 0.32;

      pixel = blend(
        pixel,
        COLORS.cream,
        ringCoverage(distance, ringRadius, ringHalfWidth),
      );
      pixel = blend(
        pixel,
        COLORS.honey,
        Math.max(0, Math.min(1, centerRadius + 1 - distance)),
      );

      if (inGround) {
        pixel = blend(
          pixel,
          COLORS.sage,
          segmentCoverage(groundDistance, lineHalfWidth),
        );
      }

      const offset = (y * size + x) * 4;
      pixels[offset] = pixel[0];
      pixels[offset + 1] = pixel[1];
      pixels[offset + 2] = pixel[2];
      pixels[offset + 3] = pixel[3];
    }
  }

  const rows = Buffer.alloc((size * 4 + 1) * size);

  for (let y = 0; y < size; y += 1) {
    const rowOffset = y * (size * 4 + 1);
    rows[rowOffset] = 0;
    pixels.copy(rows, rowOffset + 1, y * size * 4, (y + 1) * size * 4);
  }

  const header = Buffer.alloc(13);
  header.writeUInt32BE(size, 0);
  header.writeUInt32BE(size, 4);
  header[8] = 8;
  header[9] = 6;
  header[10] = 0;
  header[11] = 0;
  header[12] = 0;

  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    pngChunk("IHDR", header),
    pngChunk("IDAT", deflateSync(rows, { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

const icons = [
  ["icon-32.png", 32, false],
  ["icon-192.png", 192, false],
  ["icon-512.png", 512, false],
  ["maskable-512.png", 512, true],
  ["apple-touch-icon.png", 180, false],
];

for (const [filename, size, maskable] of icons) {
  writeFileSync(resolve(outputDirectory, filename), createIcon(size, maskable));
}
