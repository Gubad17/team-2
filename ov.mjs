import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 800 } });
await p.goto('http://localhost:8765/index.html#/'); await p.waitForTimeout(1500);
console.log(await p.evaluate(() => { const W = document.documentElement.clientWidth; const out=[];
 document.querySelectorAll('body *').forEach(e => { const r = e.getBoundingClientRect(); if (r.right > W + 1 && r.width > 0) out.push((e.className?.baseVal ?? e.className) + ' ' + e.tagName + ' ' + Math.round(r.right)); });
 return [document.documentElement.scrollWidth, ...out.slice(0, 15)].join('\n'); }));
await b.close();
