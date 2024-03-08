export function decompress(buffer: Buffer) {
  const bufferLength = buffer.length;
  let bufferPosition = 16;
  let bufferHeader;

  const resultArray: number[] = [];

  while (bufferPosition < bufferLength) {
    bufferHeader = buffer[bufferPosition++]!;

    for (
      let bufferHeaderPosition = 0;
      bufferHeaderPosition < 8 && bufferPosition < bufferLength;
      bufferHeaderPosition++
    ) {
      if ((bufferHeader << bufferHeaderPosition) & 0x80) {
        resultArray[resultArray.length] = buffer[bufferPosition++]!;

        continue;
      }

      const byte1 = buffer[bufferPosition++]!;
      const byte2 = buffer[bufferPosition++]!;

      const copyDistance = (((byte1 & 0x0f) << 8) | byte2) + 1;
      let copyLength = (byte1 >> 4) + 2;

      if (copyLength < 3) {
        copyLength = buffer[bufferPosition++]! + 0x12;
      }

      while (copyLength--) {
        resultArray[resultArray.length] =
          resultArray[resultArray.length - copyDistance]!;
      }
    }
  }

  return Buffer.from(resultArray);
}
