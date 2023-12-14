import { program } from "commander";
import { CompressCommand } from "./commands/CompressCommand.js";
import { DecompressCommand } from "./commands/DecompressCommand.js";
program
    .command("compress")
    .description("compress to Yaz0 file")
    .argument("<input>", "file to be compressed")
    .argument("[output]", "output file")
    .option("-l, --level", "compression level (0 to 10, default: 10)")
    .action(CompressCommand);
program
    .command("decompress")
    .description("decompress from Yaz0 file")
    .argument("<input>", "Yaz0 file to be decompressed")
    .argument("[output]", "output file")
    .action(DecompressCommand);
program.parse();
