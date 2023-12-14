import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { normalize } from "node:path";

import { fatal } from "@triforce-heroes/triforce-core";

import { decompress } from "../Decompress.js";

export function DecompressCommand(input: string, output?: string) {
  if (!existsSync(input)) {
    fatal(`File not found: ${input}`);
  }

  const outputPath = normalize(output ?? `${input}.uncompressed`);

  process.stdout.write(
    `Decompressing ${normalize(input)} to ${outputPath}... `,
  );

  const result = decompress(readFileSync(input));

  writeFileSync(outputPath, result);

  process.stdout.write("OK\n");
}
