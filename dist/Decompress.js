import{fatal as e}from"@triforce-heroes/triforce-core";export function decompress(r){["Yaz0","Yaz1"].includes(r.toString("binary",0,4))||e("Invalid Yaz0 header!");let t=r.length,o=17,f=r.readUInt32BE(4),a=Buffer.allocUnsafe(f),i=0,l=r.at(16);e:for(;o<t&&i<f;){for(let e=0;e<8;e++){if(o>=t||i>=f)break e;if(128&l)a[i]=r[o],i++,o++;else{let e=r[o++],t=i-((15&e)<<8|r[o++])-1,f=e>>4;f?f+=2:(f=r[o]+18,o++);for(let e=0;e<f;e++)a[i]=a[t],i++,t++}l<<=1}if(o>=t||i>=f)break;l=r[o],o++}return a}