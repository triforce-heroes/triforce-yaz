import fs, { existsSync, readFileSync } from "node:fs";
import { normalize } from "node:path";

import { fatal } from "@triforce-heroes/triforce-core/Console";

import { compress } from "../Compress.js";

interface Options {
  level: number;
  width: number;
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

  process.stdout.write(`Compressing ${normalize(input)} to ${outputPath}... `);

  const result = compress(readFileSync(input), options.level);

  fs.writeFileSync(
    outputPath,
    Buffer.concat([
      result,
      Buffer.alloc(Math.max(0, options.width - result.length)),
    ]),
  );

  process.stdout.write("OK\n");
}
