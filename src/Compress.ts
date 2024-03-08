import { CompressionLevel } from "./types/CompressionLevel.js";

const YAZ_HEADER = Buffer.from("Yaz0\0\0\0\0\0\0\0\0\0\0\0\0", "binary");

function compressBufferZero(buffer: Buffer) {
  let resultPosition = 0;
  const resultBuffer = Buffer.alloc(
    Math.ceil(buffer.length / 8) + buffer.length,
  );

  let bufferPosition = 0;

  while (bufferPosition < buffer.length) {
    if (bufferPosition % 8 === 0) {
      resultBuffer[resultPosition++] =
        bufferPosition + 7 < buffer.length
          ? 0xff
          : 0xff << (8 - (buffer.length - bufferPosition));
    }

    for (
      let bufferPositionIndex = 0;
      bufferPositionIndex < 8 && bufferPosition < buffer.length;
      bufferPositionIndex++
    ) {
      resultBuffer[resultPosition++] = buffer[bufferPosition++]!;
    }
  }

  return resultBuffer;
}

function compressBuffer(buffer: Buffer, searchRange: number): Buffer {
  const resultBytes: number[][] = [];

  let bufferPosition = buffer.length - 1;

  bufferAdvance: while (bufferPosition >= 0) {
    const bufferPosition2 = bufferPosition - 2;

    if (bufferPosition2 > 0) {
      const bufferPosition1 = bufferPosition - 1;

      for (
        let foundDistance = 1;
        foundDistance <= searchRange;
        foundDistance++
      ) {
        if (bufferPosition - foundDistance < 0) {
          break;
        }

        if (
          buffer[bufferPosition] === buffer[bufferPosition - foundDistance] &&
          buffer[bufferPosition1] === buffer[bufferPosition1 - foundDistance] &&
          buffer[bufferPosition2] === buffer[bufferPosition2 - foundDistance]
        ) {
          let foundLength = 3;

          bufferPosition -= 3;

          for (; foundLength < 273; foundLength++) {
            if (
              bufferPosition === 0 ||
              buffer[bufferPosition] !== buffer[bufferPosition - foundDistance]
            ) {
              break;
            }

            bufferPosition--;
          }

          foundDistance--;

          if (foundLength < 0x12) {
            resultBytes.push([
              (foundDistance >> 8) | ((foundLength - 2) << 4),
              foundDistance & 0xff,
            ]);
          } else {
            resultBytes.push([
              foundDistance >> 8,
              foundDistance & 0xff,
              foundLength - 0x12,
            ]);
          }

          continue bufferAdvance;
        }
      }
    }

    resultBytes.push([buffer[bufferPosition--]!]);
  }

  const resultArray: number[] = [];
  let resultHeaderPosition = 0;

  for (let resultByte = 1; resultByte <= resultBytes.length; resultByte++) {
    if (resultByte % 8 === 1) {
      resultArray[(resultHeaderPosition = resultArray.length)] = 0;
    }

    const bytes = resultBytes[resultBytes.length - resultByte]!;

    resultArray.push(...bytes);

    if (bytes.length === 1) {
      resultArray[resultHeaderPosition] |= 1 << (7 - ((resultByte + 7) % 8));
    }
  }

  return Buffer.from(resultArray);
}

export function compress(buffer: Buffer, level = CompressionLevel.L9): Buffer {
  const bufferHeader = Buffer.from(YAZ_HEADER);

  if (buffer.length === 0) {
    return bufferHeader;
  }

  bufferHeader.writeUInt32BE(buffer.length, 4);

  if (buffer.length < 4) {
    return Buffer.concat([
      bufferHeader,
      Buffer.from([0xff << (8 - buffer.length)]),
      buffer,
    ]);
  }

  return Buffer.concat([
    bufferHeader,
    +level
      ? compressBuffer(
          buffer,
          +level < 9 ? (0x10_e0 * level) / 9 - 0xe0 : 0x10_00,
        )
      : compressBufferZero(buffer),
  ]);
}
