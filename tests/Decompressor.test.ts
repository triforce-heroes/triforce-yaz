import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

import { decompress } from "../src/Decompress.js";

describe("decompressor", () => {
  const samples = [
    ["hello", Buffer.from("Hello".repeat(1000))],
    ["license", Buffer.from(readFileSync(`LICENSE`))],
  ] as const;

  it.each(samples)("function decompress(%s)", (name, buffer) => {
    expect(
      decompress(readFileSync(`${__dirname}/fixtures/${name}.yaz0`)),
    ).toStrictEqual(buffer);
  });
});
