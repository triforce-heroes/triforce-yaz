import fs, { existsSync, readFileSync } from "node:fs";

import { fatal } from "@triforce-heroes/triforce-core/Console";
import { normalize } from "@triforce-heroes/triforce-core/Path";

import { decompress } from "../Decompress.js";

export function DecompressCommand(input: string, output?: string) {
  if (!existsSync(input)) {
    fatal(`File not found: ${input}`);
  }

  const outputPath = normalize(output ?? `${input}.uncompressed`);

  process.stdout.write(
    `Decompressing ${normalize(input)} to ${outputPath}... `,
  );

  const now = Date.now();

  const result = decompress(readFileSync(input));

  fs.writeFileSync(outputPath, result);

  process.stdout.write(`OK (${((Date.now() - now) / 1000).toFixed(2)}s)\n`);
}
