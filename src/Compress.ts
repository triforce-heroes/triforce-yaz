// Based on: https://github.com/ThemezerNX/Yaz0Lib

import { CompressionLevel } from "./types/CompressionLevel.js";

function compressionSearch(
  buffer: Buffer,
  bufferPosition: number,
  bufferMaxLength: number,
  bufferLength: number,
  searchRange: number,
) {
  let foundLength = 1;
  let found = 0;

  if (!searchRange) {
    return { found, foundLength };
  }

  if (bufferPosition + 2 < bufferLength) {
    let search = bufferPosition - searchRange;

    if (search < 0) {
      search = 0;
    }

    let cmpEnd = bufferPosition + bufferMaxLength;

    if (cmpEnd > bufferLength) {
      cmpEnd = bufferLength;
    }

    const buffer1 = buffer[bufferPosition]!;

    while (search < bufferPosition) {
      const lastSearchRange = search;

      search = buffer.subarray(search, bufferPosition).indexOf(buffer1);

      if (search === -1) {
        break;
      }

      search += lastSearchRange;

      let cmp1 = search + 1;
      let cmp2 = bufferPosition + 1;

      while (cmp2 < cmpEnd && buffer[cmp1] === buffer[cmp2]) {
        cmp1++;
        cmp2++;
      }

      const len = cmp2 - bufferPosition;

      if (foundLength < len) {
        foundLength = len;
        found = search;

        if (foundLength === bufferMaxLength) {
          break;
        }
      }

      search++;
    }
  }

  return { found, foundLength };
}

function compressBuffer(buffer: Buffer, level: number): Buffer {
  let searchRange;

  if (!level) {
    searchRange = 0;
  } else if (level < 9) {
    searchRange = (0x10_e0 * level) / 9 - 0x0_e0;
  } else {
    searchRange = 0x10_00;
  }

  const bufferLength = buffer.length;
  let bufferPosition = 0;

  const resultArray = new Array<number>();
  let resultPosition = 0;

  const maxLen = 0x1_11;

  while (bufferPosition < bufferLength) {
    resultPosition = resultArray.length;
    resultArray.push(0);

    for (let i = 0; i < 8; i++) {
      if (bufferPosition >= bufferLength) {
        break;
      }

      const { found, foundLength } = compressionSearch(
        buffer,
        bufferPosition,
        maxLen,
        bufferLength,
        searchRange,
      );

      if (foundLength > 2) {
        const delta = bufferPosition - found - 1;

        if (foundLength < 0x12) {
          resultArray.push(
            (delta >> 8) | ((foundLength - 2) << 4),
            delta & 0xff,
          );
        } else {
          resultArray.push(
            delta >> 8,
            delta & 0xff,
            (foundLength - 0x12) & 0xff,
          );
        }

        bufferPosition += foundLength;
      } else {
        resultArray[resultPosition] |= 1 << (7 - i);
        resultArray.push(buffer[bufferPosition]!);
        bufferPosition++;
      }
    }
  }

  return Buffer.from(resultArray);
}

export function compress(
  buffer: Buffer,
  alignment = 0,
  level = CompressionLevel.L0,
): Buffer {
  const compressed = compressBuffer(buffer, level);
  const result = Buffer.allocUnsafe(16 + compressed.length);

  result.write("Yaz0", 0, 4);
  result.writeUInt32BE(buffer.length, 4);
  result.writeUInt32BE(alignment, 8);
  result.writeUInt32BE(0, 12);

  compressed.copy(result, 16);

  return result;
}
