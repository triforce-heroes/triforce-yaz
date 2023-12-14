import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { compress } from "../src/Compress.js";

describe("compressor", () => {
  const samples = [
    ["hello", Buffer.from("Hello".repeat(1000))],
    ["license", Buffer.from(readFileSync(`LICENSE`))],
  ] as const;

  it.each(samples)("function compress(%s)", (name, buffer) => {
    expect(compress(buffer)).toStrictEqual(
      readFileSync(`${__dirname}/fixtures/${name}.yaz0`),
    );
  });
});
