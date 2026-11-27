import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import fs from 'fs';
const svg = fs.readFileSync('/home/claude/bacha/build/favicon.svg','utf8').replace('rx="8"','rx="0"');
const b = await chromium.launch();
for (const n of [192, 512]) {
  const p = await b.newPage({ viewport: { width: n, height: n } });
  await p.setContent(`<style>html,body{margin:0}svg{width:${n}px;height:${n}px;display:block}</style>${svg}`);
  await p.screenshot({ path: `/home/claude/bacha/build/icon-${n}.png` });
}
await b.close();
