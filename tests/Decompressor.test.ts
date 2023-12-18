import { readFileSync } from "node:fs";

import { describe, expect, it, vitest } from "vitest";

import { decompress } from "../src/index.js";

describe("decompressor", () => {
  const samples = [
    ["empty.yaz0", Buffer.from("")],
    [
      "hello.yaz0",
      Buffer.from(readFileSync(`${__dirname}/fixtures/hello.bin`)),
    ],
    [
      "lorem.yaz0",
      Buffer.from(readFileSync(`${__dirname}/fixtures/lorem.bin`)),
    ],
    ["coverage-1.yaz0", Buffer.from("\0\0\0\0")],
    ["coverage-2.yaz0", Buffer.from("\0".repeat(19))],
    ["coverage-3.yaz0", Buffer.from("\0".repeat(8))],
  ] as const;

  it.each(samples)("function decompress(%j)", (name, buffer) => {
    expect(
      decompress(readFileSync(`${__dirname}/fixtures/${name}`)),
    ).toStrictEqual(buffer);
  });

  it('function decompress("fake.yaz0")', () => {
    expect.assertions(2);

    vitest.spyOn(process.stderr, "write").mockImplementationOnce((message) => {
      expect(message).toContain("Invalid Yaz0 header!");

      return undefined as never;
    });

    vitest.spyOn(process, "exit").mockImplementationOnce((code) => {
      expect(code).toBe(-1);

      return undefined as never;
    });

    decompress(readFileSync(`${__dirname}/fixtures/fake.yaz0`));
  });
});
