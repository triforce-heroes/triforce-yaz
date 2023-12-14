import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { normalize } from "node:path";
import { fatal } from "@triforce-heroes/triforce-core";
import { compress } from "../Compress.js";
export function CompressCommand(input, output, options) {
    if (!existsSync(input)) {
        fatal(`File not found: ${input}`);
    }
    const outputPath = normalize(output ?? `${input}.compressed`);
    process.stdout.write(`Compressing ${normalize(input)} to ${outputPath}... `);
    const result = compress(readFileSync(input), Number(options?.level ?? 10 /* CompressionLevel.L10 */));
    writeFileSync(outputPath, result);
    process.stdout.write("OK\n");
}
