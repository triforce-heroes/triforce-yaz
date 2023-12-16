import { program } from "commander";

import { CompressCommand } from "./commands/CompressCommand.js";
import { DecompressCommand } from "./commands/DecompressCommand.js";

program
  .command("compress")
  .description("compress to Yaz0 file")
  .argument("<input>", "file to be compressed")
  .argument("[output]", "output file")
  .option(
    "-l, --level <number>",
    "compression level (0..9)",
    Number.parseInt,
    9,
  )
  .option("-w, --width <number>", "minimum output width", Number.parseInt)
  .action(CompressCommand);

program
  .command("decompress")
  .description("decompress from Yaz0 file")
  .argument("<input>", "Yaz0 file to be decompressed")
  .argument("[output]", "output file")
  .action(DecompressCommand);

program.parse();
