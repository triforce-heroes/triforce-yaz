import o,{existsSync as e,readFileSync as t}from"node:fs";import{normalize as r}from"node:path";import{fatal as s}from"@triforce-heroes/triforce-core/Console";import{compress as i}from"../Compress.js";export function CompressCommand(m,n,f){e(m)||s(`File not found: ${m}`);let p=r(n??`${m}.compressed`);process.stdout.write(`Compressing ${r(m)} to ${p}... `);let c=Date.now(),l=i(t(m),f.level);o.writeFileSync(p,Buffer.concat([l,Buffer.alloc(Math.max(0,f.width-l.length))])),process.stdout.write(`OK (${((Date.now()-c)/1e3).toFixed(2)}s)
`)}