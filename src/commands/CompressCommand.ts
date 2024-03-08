import fs, { existsSync, readFileSync } from "node:fs";
import { normalize } from "node:path";

import { fatal } from "@triforce-heroes/triforce-core/Console";

import { compress } from "../Compress.js";

interface Options {
  level: number;
  width: number;
  fast: boolean;
}

export function CompressCommand(
  input: string,
  output: string | undefined,
  options: Options,
) {
  if (!existsSync(input)) {
    fatal(`File not found: ${input}`);
  }

  const outputPath = normalize(output ?? `${input}.compressed`);
  const inputContents = readFileSync(input);

  process.stdout.write(`Compressing ${normalize(input)} to ${outputPath}... `);

  const now = Date.now();
  const result = compress(inputContents, options.level, options.fast);

  process.stdout.write(`OK (${((Date.now() - now) / 1000).toFixed(2)}s)\n`);

  fs.writeFileSync(
    outputPath,
    Buffer.concat([
      result,
      Buffer.alloc(Math.max(0, options.width - result.length)),
    ]),
  );
}
