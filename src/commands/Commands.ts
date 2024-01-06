import { Command } from "commander";

import { CompressCommand } from "./CompressCommand.js";
import { DecompressCommand } from "./DecompressCommand.js";

export function makeProgram() {
  const program = new Command();

  program
    .command("compress")
    .description("compress to Yaz0 file")
    .argument("<input>", "file to be compressed")
    .argument("[output]", "output file")
    .option("-l, --level <number>", "compression level (0..9)", Number, 9)
    .option("-w, --width <number>", "minimum output width", Number, 0)
    .action(CompressCommand);

  program
    .command("decompress")
    .description("decompress from Yaz0 file")
    .argument("<input>", "Yaz0 file to be decompressed")
    .argument("[output]", "output file")
    .action(DecompressCommand);

  return program;
}
