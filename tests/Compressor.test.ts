import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { compress } from "../src/index.js";
import { CompressionLevel } from "../src/types/CompressionLevel.js";

describe("compressor", () => {
  const helloBuffer = readFileSync(`${__dirname}/fixtures/hello.bin`);
  const loremBuffer = readFileSync(`${__dirname}/fixtures/lorem.bin`);

  const coverage1 = readFileSync(`${__dirname}/fixtures/coverage-1.bin`);
  const coverage2 = readFileSync(`${__dirname}/fixtures/coverage-2.bin`);
  const coverage3 = readFileSync(`${__dirname}/fixtures/coverage-3.bin`);
  const coverage4 = readFileSync(`${__dirname}/fixtures/coverage-4.bin`);

  const fileSamples = [
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
    ["coverage-1.yaz0", CompressionLevel.L9, coverage1],
    ["coverage-2.yaz0", CompressionLevel.L9, coverage2],
    ["coverage-3.yaz0", CompressionLevel.L0, coverage3],
    ["coverage-4.yaz0", CompressionLevel.L9, coverage4],
  ] as const;

  it.each(fileSamples)(
    "function compress(file: %j, %j)",
    (name, level, buffer) => {
      expect(compress(buffer, level)).toStrictEqual(
        readFileSync(`${__dirname}/fixtures/${name}`),
      );
    },
  );

  const directSamples = [
    ["", CompressionLevel.L9, ""],
    ["1", CompressionLevel.L9, "\u00801"],
    ["12", CompressionLevel.L9, "\u00C012"],
    ["123", CompressionLevel.L9, "\u00E0123"],
    ["1234", CompressionLevel.L9, "\u00F01234"],
    [
      "\u0000\u0000\u0000\u0000\u0001\u0000\u0000\u0000\u0001\u0000\u0000\u0000\u0000",
      CompressionLevel.L9,
      "\u00A0\u0000\u0010\u0000\u0001\u0020\u0003\u0020\u0008",
    ],
  ] as const;

  it.each(directSamples)(
    "function compress(buffer: %j, %j)",
    (buffer, level, expected) => {
      expect(
        compress(Buffer.from(buffer, "binary"), level).subarray(16),
      ).toStrictEqual(Buffer.from(expected, "binary"));
    },
  );
});
