import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { compress } from "../src/index.js";
import { CompressionLevel } from "../src/types/CompressionLevel.js";

describe("compressor", () => {
  const helloBuffer = readFileSync(`${__dirname}/fixtures/hello.bin`);
  const loremBuffer = readFileSync(`${__dirname}/fixtures/lorem.bin`);

  const samples = [
    ["empty.yaz0", CompressionLevel.L0, Buffer.from("")],
    ["hello.yaz0", CompressionLevel.L0, helloBuffer],
    ["hello.l1.yaz0", CompressionLevel.L1, helloBuffer],
    ["hello.l2.yaz0", CompressionLevel.L2, helloBuffer],
    ["hello.l3.yaz0", CompressionLevel.L3, helloBuffer],
    ["hello.l4.yaz0", CompressionLevel.L4, helloBuffer],
    ["hello.l5.yaz0", CompressionLevel.L5, helloBuffer],
    ["hello.l6.yaz0", CompressionLevel.L6, helloBuffer],
    ["hello.l7.yaz0", CompressionLevel.L7, helloBuffer],
    ["hello.l8.yaz0", CompressionLevel.L8, helloBuffer],
    ["hello.l9.yaz0", CompressionLevel.L9, helloBuffer],
    ["lorem.yaz0", CompressionLevel.L0, loremBuffer],
    ["lorem.l1.yaz0", CompressionLevel.L1, loremBuffer],
    ["lorem.l2.yaz0", CompressionLevel.L2, loremBuffer],
    ["lorem.l3.yaz0", CompressionLevel.L3, loremBuffer],
    ["lorem.l4.yaz0", CompressionLevel.L4, loremBuffer],
    ["lorem.l5.yaz0", CompressionLevel.L5, loremBuffer],
    ["lorem.l6.yaz0", CompressionLevel.L6, loremBuffer],
    ["lorem.l7.yaz0", CompressionLevel.L7, loremBuffer],
    ["lorem.l8.yaz0", CompressionLevel.L8, loremBuffer],
    ["lorem.l9.yaz0", CompressionLevel.L9, loremBuffer],
    ["coverage-1.yaz0", CompressionLevel.L9, Buffer.from("\0\0\0\0")],
    ["coverage-2.yaz0", CompressionLevel.L9, Buffer.from("\0".repeat(19))],
    ["coverage-3.yaz0", CompressionLevel.L0, Buffer.from("\0".repeat(8))],
  ] as const;

  it.each(samples)("function compress(%s)", (name, level, buffer) => {
    expect(compress(buffer, level)).toStrictEqual(
      readFileSync(`${__dirname}/fixtures/${name}`),
    );
  });
});
