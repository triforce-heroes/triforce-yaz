import { readFileSync } from "node:fs";

import { describe, expect, it, vitest } from "vitest";

import { decompress } from "../src/index.js";

describe("decompressor", () => {
  const helloBuffer = Buffer.from(
    readFileSync(`${__dirname}/fixtures/hello.bin`),
  );

  const loremBuffer = Buffer.from(
    readFileSync(`${__dirname}/fixtures/lorem.bin`),
  );

  const coverage1 = readFileSync(`${__dirname}/fixtures/coverage-1.bin`);
  const coverage2 = readFileSync(`${__dirname}/fixtures/coverage-2.bin`);
  const coverage3 = readFileSync(`${__dirname}/fixtures/coverage-3.bin`);

  const samples = [
    ["empty.yaz0", Buffer.from("")],
    ["hello.yaz0", helloBuffer],
    ["hello.l1.yaz0", helloBuffer],
    ["hello.l2.yaz0", helloBuffer],
    ["hello.l3.yaz0", helloBuffer],
    ["hello.l4.yaz0", helloBuffer],
    ["hello.l5.yaz0", helloBuffer],
    ["hello.l6.yaz0", helloBuffer],
    ["hello.l7.yaz0", helloBuffer],
    ["hello.l8.yaz0", helloBuffer],
    ["hello.l9.yaz0", helloBuffer],
    ["lorem.yaz0", loremBuffer],
    ["lorem.l1.yaz0", loremBuffer],
    ["lorem.l2.yaz0", loremBuffer],
    ["lorem.l3.yaz0", loremBuffer],
    ["lorem.l4.yaz0", loremBuffer],
    ["lorem.l5.yaz0", loremBuffer],
    ["lorem.l6.yaz0", loremBuffer],
    ["lorem.l7.yaz0", loremBuffer],
    ["lorem.l8.yaz0", loremBuffer],
    ["lorem.l9.yaz0", loremBuffer],
    ["coverage-1.yaz0", coverage1],
    ["coverage-2.yaz0", coverage2],
    ["coverage-3.yaz0", coverage3],
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
