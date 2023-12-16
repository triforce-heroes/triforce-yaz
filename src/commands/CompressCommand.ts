import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { normalize } from "node:path";

import { fatal } from "@triforce-heroes/triforce-core";

import { compress } from "../Compress.js";

interface Options {
  level: number;
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

  writeFileSync(outputPath, result);

  process.stdout.write("OK\n");
}
