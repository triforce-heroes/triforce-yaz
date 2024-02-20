import fs, { readFileSync } from "node:fs";

import { debugCommander } from "@triforce-heroes/triforce-core/Debugger";
import { describe, expect, it, vi } from "vitest";

import { makeProgram } from "../src/commands/Commands.js";

describe("commands", () => {
  const compressSamples = [
    [
      `${__dirname}/fixtures/hello.bin`,
      ["-l", "9", "-w", "1024"],
      Buffer.concat([
        fs.readFileSync(`${__dirname}/fixtures/hello.l9.yaz0`),
        Buffer.alloc(995),
      ]),
      `${__dirname}/fixtures/hello.bin`,
      ["-l", "0"],
      fs.readFileSync(`${__dirname}/fixtures/hello.yaz0`),
    ],
  ] as const;

  it.each(compressSamples)("compress %s %s", (input, args, output) => {
    expect.assertions(4);

    vi.spyOn(process.stdout, "write")
      .mockImplementationOnce((str) => {
        expect(str).toContain("Compressing ");

        return true;
      })
      .mockImplementationOnce((str) => {
        expect(str).toBe("OK\n");

        return true;
      });

    vi.spyOn(fs, "writeFileSync").mockImplementationOnce((path, data) => {
      expect(path).toContain("hello.bin");
      expect(data).toStrictEqual(output);

      return true;
    });

    debugCommander(makeProgram(), ["compress", input, ...args]);
  });

  it("decompress hello.yaz0", () => {
    expect.assertions(4);

    vi.spyOn(process.stdout, "write")
      .mockImplementationOnce((str) => {
        expect(str).toContain("Decompressing ");

        return true;
      })
      .mockImplementationOnce((str) => {
        expect(str).toBe("OK\n");

        return true;
      });

    vi.spyOn(fs, "writeFileSync").mockImplementationOnce((path, data) => {
      expect(path).toContain("tests/fixtures/hello.yaz0.uncompressed");
      expect(data).toStrictEqual(
        readFileSync(`${__dirname}/fixtures/hello.bin`),
      );

      return true;
    });

    debugCommander(makeProgram(), [
      "decompress",
      `${__dirname}/fixtures/hello.yaz0`,
    ]);
  });
});
