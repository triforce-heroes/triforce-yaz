import { CompressionLevel } from "./types/CompressionLevel.js";

function compressBufferZero(buffer: Buffer) {
  const resultCycles = Math.ceil(buffer.length / 8);
  const resultBuffer = Buffer.alloc(resultCycles + buffer.length, 0xff);

  for (let resultCycle = 0; resultCycle < resultCycles; resultCycle++) {
    buffer.copy(
      resultBuffer,
      resultCycle * 9 + 1,
      resultCycle * 8,
      (resultCycle + 1) * 8,
    );
  }

  const resultMissing = resultCycles * 8 - buffer.length;

  if (resultMissing) {
    resultBuffer[(resultCycles - 1) * 9] = 0xff << resultMissing;
  }

  return resultBuffer;
}

function compressBuffer(buffer: Buffer, searchRange: number): Buffer {
  const resultInstances: number[][] = [];
  let resultBytes = 0;

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
            resultBytes += 2;
            resultInstances.push([
              (foundDistance >> 8) | ((foundLength - 2) << 4),
              foundDistance & 0xff,
            ]);
          } else {
            resultBytes += 3;
            resultInstances.push([
              foundDistance >> 8,
              foundDistance & 0xff,
              foundLength - 0x12,
            ]);
          }

          continue bufferAdvance;
        }
      }
    }

    resultBytes++;
    resultInstances.push([buffer[bufferPosition--]!]);
  }

  let resultPosition = 0;
  let resultHeaderPosition = 0;

  const resultBuffer = Buffer.allocUnsafe(
    Math.ceil(resultInstances.length / 8) + resultBytes,
  );

  for (
    let resultInstancesIndex = 0;
    resultInstancesIndex < resultInstances.length;
    resultInstancesIndex++
  ) {
    const resultInstance =
      resultInstances[resultInstances.length - resultInstancesIndex - 1]!;
    const resultHeader = resultInstancesIndex % 8 === 0;

    if (resultHeader) {
      resultBuffer.writeUInt8(0, resultPosition);
      resultHeaderPosition = resultPosition++;
    }

    if (resultInstance.length === 1) {
      resultBuffer.writeUInt8(resultInstance[0]!, resultPosition);
      resultBuffer[resultHeaderPosition] |=
        1 << (7 - (resultInstancesIndex % 8));
    } else if (resultInstance.length === 2) {
      resultBuffer.writeUInt16BE(
        (resultInstance[0]! << 8) | resultInstance[1]!,
        resultPosition,
      );
    } else {
      resultBuffer.writeUIntBE(
        (resultInstance[0]! << 16) |
          (resultInstance[1]! << 8) |
          resultInstance[2]!,
        resultPosition,
        3,
      );
    }

    resultPosition += resultInstance.length;
  }

  return resultBuffer;
}

export function compress(buffer: Buffer, level = CompressionLevel.L9): Buffer {
  if (buffer.length === 0) {
    return Buffer.from("Yaz0\0\0\0\0\0\0\0\0\0\0\0\0");
  }

  const compressedLength = Buffer.allocUnsafe(4);

  compressedLength.writeUInt32BE(buffer.length);

  if (buffer.length < 4) {
    return Buffer.concat([
      Buffer.from("Yaz0"),
      compressedLength,
      Buffer.alloc(8),
      Buffer.from([0xff << (8 - buffer.length)]),
      buffer,
    ]);
  }

  const compressed = +level
    ? compressBuffer(
        buffer,
        +level < 9 ? (0x10_e0 * level) / 9 - 0xe0 : 0x10_00,
      )
    : compressBufferZero(buffer);

  return Buffer.concat([
    Buffer.from("Yaz0"),
    compressedLength,
    Buffer.alloc(8),
    compressed,
  ]);
}
