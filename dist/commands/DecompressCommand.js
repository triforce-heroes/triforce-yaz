import o,{existsSync as e,readFileSync as r}from"node:fs";import{fatal as t,normalize as s}from"@triforce-heroes/triforce-core";import{decompress as i}from"../Decompress.js";export function DecompressCommand(m,c){e(m)||t(`File not found: ${m}`);let n=s(c??`${m}.uncompressed`);process.stdout.write(`Decompressing ${s(m)} to ${n}... `);let p=i(r(m));o.writeFileSync(n,p),process.stdout.write("OK\n")}