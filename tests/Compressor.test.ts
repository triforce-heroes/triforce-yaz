import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { compress } from "../src/Compress.js";
import { CompressionLevel } from "../src/types/CompressionLevel.js";

describe("compressor", () => {
  const samples = [
    ["hello", Buffer.from("Hello")],
    ["license", Buffer.from(readFileSync(`LICENSE`))],
  ] as const;

  it.each(samples)("function compress(%s)", (name, buffer) => {
    expect(compress(buffer, CompressionLevel.L9)).toStrictEqual(
      readFileSync(`${__dirname}/fixtures/${name}.yaz0`),
    );
  });
});
