import { readFileSync } from "node:fs";

import { describe, expect, it } from "vitest";

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
  const coverage4 = readFileSync(`${__dirname}/fixtures/coverage-4.bin`);

  const fileSamples = [
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
    ["coverage-4.yaz0", coverage4],
  ] as const;

  it.each(fileSamples)("function decompress(file: %j)", (name, buffer) => {
    expect(
      decompress(readFileSync(`${__dirname}/fixtures/${name}`)),
    ).toStrictEqual(buffer);
  });

  const directSamples = [
    ["", ""],
    ["\u00801", "1"],
    ["\u00C012", "12"],
    ["\u00E0123", "123"],
    ["\u00F01234", "1234"],
    [
      "\u00A0\u0000\u0010\u0000\u0001\u0030\u0003\u0010\u0008",
      "\u0000\u0000\u0000\u0000\u0001\u0000\u0000\u0000\u0001\u0000\u0000\u0000\u0000",
    ],
    [
      "\u00A0\u0000\u0010\u0000\u0001\u0030\u0003\u0010\u0000",
      "\u0000\u0000\u0000\u0000\u0001\u0000\u0000\u0000\u0001\u0000\u0000\u0000\u0000",
    ],
    [
      "\u00A4\u0000\u0010\u0000\u0001\u0030\u0003\u0010\u0000\u0002",
      "\u0000\u0000\u0000\u0000\u0001\u0000\u0000\u0000\u0001\u0000\u0000\u0000\u0000\u0002",
    ],
    [
      "\u00A8\u0000\u0010\u0000\u0001\u0050\u0003\u0000",
      "\u0000\u0000\u0000\u0000\u0001\u0000\u0000\u0000\u0001\u0000\u0000\u0000\u0000",
    ],
    [
      "\u00FF\u0000\u0000\u0000\u0001\u0002\u0002\u0000\u0002\u00D0\u0002\u0002\u0040\u0009\u0002",
      "\u0000\u0000\u0000\u0001\u0002\u0002\u0000\u0002\u0002\u0002\u0000\u0000\u0000\u0001\u0002\u0002\u0002",
    ],
    [
      "\u00E0\u0001\u0000\u0000\u0020\u0002",
      "\u0001\u0000\u0000\u0001\u0000\u0000\u0001",
    ],
    [
      "\u00E8\u0001\u0000\u0000\u0010\u0002\u0001",
      "\u0001\u0000\u0000\u0001\u0000\u0000\u0001",
    ],
  ] as const;

  it.each(directSamples)(
    "function decompress(buffer: %j, %j)",
    (buffer, expected) => {
      const bufferYaz = Buffer.allocUnsafe(16 + buffer.length);

      bufferYaz.write("Yaz0\0\0\0\0\0\0\0\0\0\0\0\0");
      bufferYaz.writeUInt32BE(expected.length, 4);
      bufferYaz.write(buffer, 16, "binary");

      expect(decompress(bufferYaz)).toStrictEqual(
        Buffer.from(expected, "binary"),
      );
    },
  );
});
