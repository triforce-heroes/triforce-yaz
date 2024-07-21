import { CompressionLevel } from "./types/CompressionLevel.js";
interface CompressOptions {
    level?: CompressionLevel;
    searchRange?: number;
    fast?: boolean;
}
export declare function compress(buffer: Buffer, options?: CompressOptions): Buffer;
export {};
