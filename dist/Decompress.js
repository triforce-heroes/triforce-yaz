import { BufferConsumer, fatal, } from "@triforce-heroes/triforce-core";
// Based on: https://github.com/ThemezerNX/Yaz0Lib
export function decompress(buffer) {
    const bufferConsumer = new BufferConsumer(buffer, undefined, 1 /* ByteOrder.BIG_ENDIAN */);
    const yazMagic = bufferConsumer.readString(4);
    if (!["Yaz0", "Yaz1"].includes(yazMagic)) {
        fatal("Invalid Yaz0 header!");
    }
    const bufferLength = buffer.length;
    let bufferPosition = 17;
    const resultLength = bufferConsumer.readUnsignedInt32();
    const resultBuffer = Buffer.allocUnsafe(resultLength);
    let resultPosition = 0;
    let bufferCode = buffer.at(16);
    while (bufferPosition < bufferLength && resultPosition < resultLength) {
        let found = false;
        for (let i = 0; i < 8; i++) {
            if (bufferPosition >= bufferLength || resultPosition >= resultLength) {
                found = true;
                break;
            }
            if (bufferCode & 0x80) {
                resultBuffer[resultPosition] = buffer[bufferPosition];
                resultPosition += 1;
                bufferPosition += 1;
            }
            else {
                const buffer1 = buffer[bufferPosition++];
                const buffer2 = buffer[bufferPosition++];
                let copySrc = resultPosition - (((buffer1 & 0x0f) << 8) | buffer2) - 1;
                let n = buffer1 >> 4;
                if (n) {
                    n += 2;
                }
                else {
                    n = buffer[bufferPosition] + 0x12;
                    bufferPosition += 1;
                }
                for (let _ = 0; _ < n; _++) {
                    resultBuffer[resultPosition] = resultBuffer[copySrc];
                    resultPosition += 1;
                    copySrc += 1;
                }
            }
            bufferCode <<= 1;
        }
        if (!found) {
            if (bufferPosition >= bufferLength || resultPosition >= resultLength) {
                break;
            }
            bufferCode = buffer[bufferPosition];
            bufferPosition += 1;
        }
    }
    return resultBuffer;
}
