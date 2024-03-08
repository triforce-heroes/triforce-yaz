interface Options {
    level: number;
    searchRange?: number;
    width: number;
    fast: boolean;
}
export declare function CompressCommand(input: string, output: string | undefined, options: Options): void;
export {};
