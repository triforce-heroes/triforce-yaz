import { CompressionLevel } from "./types/CompressionLevel.js";

const YAZ_HEADER = Buffer.from("Yaz0\0\0\0\0\0\0\0\0\0\0\0\0", "binary");

function bufferPush(
  resultBytes: number[][],
  foundDistance: number,
  foundLength: number,
) {
  const byte1 = foundDistance >> 8;
  const byte2 = foundDistance & 0xff;

  resultBytes.push(
    foundLength < 0x12
      ? [byte1 | ((foundLength - 2) << 4), byte2]
      : [byte1, byte2, foundLength - 0x12],
  );

  return foundLength;
}

function compressSearch(
  buffer: Buffer,
  bufferPosition: number,
  searchRange: number,
): [foundDistance: number, foundLength: number] {
  const bufferPosition2 = bufferPosition - 2;
  const bufferPosition1 = bufferPosition - 1;

  let bestFoundDistance = 0;
  let bestFoundLength = 0;

  for (
    let foundDistance = 1;
    foundDistance <= searchRange && bufferPosition - foundDistance;
    foundDistance++
  ) {
    if (
      buffer[bufferPosition] !== buffer[bufferPosition - foundDistance] ||
      buffer[bufferPosition1] !== buffer[bufferPosition1 - foundDistance] ||
      buffer[bufferPosition2] !== buffer[bufferPosition2 - foundDistance]
    ) {
      continue;
    }

    let foundLength = 3;

    while (
      foundLength < 273 &&
      bufferPosition - foundLength &&
      buffer[bufferPosition - foundLength] ===
        buffer[bufferPosition - foundLength - foundDistance]
    ) {
      foundLength++;
    }

    if (foundLength > bestFoundLength) {
      bestFoundLength = foundLength;
      bestFoundDistance = foundDistance - 1;

      if (foundLength === 273) {
        break;
      }
    }
  }

  return [bestFoundDistance, bestFoundLength];
}

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

function compressBuffer(
  buffer: Buffer,
  searchRange: number,
  fast: boolean,
): Buffer {
  const resultBytes: number[][] = [];

  let bufferPosition = buffer.length - 1;

  while (bufferPosition >= 0) {
    if (bufferPosition < 3) {
      resultBytes.push([buffer[bufferPosition--]!]);

      if (bufferPosition >= 0) {
        resultBytes.push([buffer[bufferPosition--]!]);

        if (bufferPosition >= 0) {
          resultBytes.push([buffer[bufferPosition--]!]);
        }
      }

      break;
    }

    const [foundDistance, foundLength] = compressSearch(
      buffer,
      bufferPosition,
      searchRange,
    );

    if (foundLength) {
      if (!fast) {
        const [slideFoundDistance, slideFoundLength] = compressSearch(
          buffer,
          bufferPosition - 1,
          searchRange,
        );

        if (slideFoundLength > foundLength) {
          resultBytes.push([buffer[bufferPosition--]!]);

          bufferPosition -= bufferPush(
            resultBytes,
            slideFoundDistance,
            slideFoundLength,
          );

          continue;
        }
      }

      bufferPosition -= bufferPush(resultBytes, foundDistance, foundLength);

      continue;
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

export function compress(
  buffer: Buffer,
  level = CompressionLevel.L9,
  fast = false,
): Buffer {
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
          fast,
        )
      : compressBufferZero(buffer),
  ]);
}
