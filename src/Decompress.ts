import { fatal } from "@triforce-heroes/triforce-core/Console";

// Based on: https://github.com/ThemezerNX/Yaz0Lib

export function decompress(buffer: Buffer) {
  const yazMagic = buffer.toString("binary", 0, 4);

  if (!["Yaz0", "Yaz1"].includes(yazMagic)) {
    fatal("Invalid Yaz0 header!");
  }

  const bufferLength = buffer.length;
  let bufferPosition = 17;

  const resultLength = buffer.readUInt32BE(4);
  const resultBuffer = Buffer.allocUnsafe(resultLength);
  let resultPosition = 0;

  let bufferCode = buffer.at(16)!;

  loop: while (bufferPosition < bufferLength && resultPosition < resultLength) {
    for (let i = 0; i < 8; i++) {
      if (bufferPosition >= bufferLength || resultPosition >= resultLength) {
        break loop;
      }

      if (bufferCode & 0x80) {
        resultBuffer[resultPosition] = buffer[bufferPosition]!;
        resultPosition++;
        bufferPosition++;
      } else {
        const buffer1 = buffer[bufferPosition++]!;
        const buffer2 = buffer[bufferPosition++]!;

        let copySrc = resultPosition - (((buffer1 & 0x0f) << 8) | buffer2) - 1;
        let bufferNumber = buffer1 >> 4;

        if (bufferNumber) {
          bufferNumber += 2;
        } else {
          bufferNumber = buffer[bufferPosition]! + 0x12;
          bufferPosition++;
        }

        for (let j = 0; j < bufferNumber; j++) {
          resultBuffer[resultPosition] = resultBuffer[copySrc]!;
          resultPosition++;
          copySrc++;
        }
      }

      bufferCode <<= 1;
    }

    if (bufferPosition >= bufferLength || resultPosition >= resultLength) {
      break;
    }

    bufferCode = buffer[bufferPosition]!;
    bufferPosition++;
  }

  return resultBuffer;
}
