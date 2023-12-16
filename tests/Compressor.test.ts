import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { compress } from "../src/Compress.js";
import { CompressionLevel } from "../src/types/CompressionLevel.js";

describe("compressor", () => {
  const helloBuffer = Buffer.from("Hello".repeat(1000));
  const licenseBuffer = readFileSync(`LICENSE`);

  const samples = [
    ["hello", CompressionLevel.L0, helloBuffer],
    ["hello.l1", CompressionLevel.L1, helloBuffer],
    ["hello.l2", CompressionLevel.L2, helloBuffer],
    ["hello.l3", CompressionLevel.L3, helloBuffer],
    ["hello.l4", CompressionLevel.L4, helloBuffer],
    ["hello.l5", CompressionLevel.L5, helloBuffer],
    ["hello.l6", CompressionLevel.L6, helloBuffer],
    ["hello.l7", CompressionLevel.L7, helloBuffer],
    ["hello.l8", CompressionLevel.L8, helloBuffer],
    ["hello.l9", CompressionLevel.L9, helloBuffer],
    ["license", CompressionLevel.L0, licenseBuffer],
    ["license.l1", CompressionLevel.L1, licenseBuffer],
    ["license.l2", CompressionLevel.L2, licenseBuffer],
    ["license.l3", CompressionLevel.L3, licenseBuffer],
    ["license.l4", CompressionLevel.L4, licenseBuffer],
    ["license.l5", CompressionLevel.L5, licenseBuffer],
    ["license.l6", CompressionLevel.L6, licenseBuffer],
    ["license.l7", CompressionLevel.L7, licenseBuffer],
    ["license.l8", CompressionLevel.L8, licenseBuffer],
    ["license.l9", CompressionLevel.L9, licenseBuffer],
  ] as const;

  it.each(samples)("function compress(%s)", (name, level, buffer) => {
    expect(compress(buffer, level)).toStrictEqual(
      readFileSync(`${__dirname}/fixtures/${name}.yaz0`),
    );
  });
});
