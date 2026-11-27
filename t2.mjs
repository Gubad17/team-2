import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: 1360, height: 900 } });
const p = await ctx.newPage();
const errs = [];
p.on('pageerror', e => errs.push('PAGEERR ' + e.message));
p.on('console', m => { if (m.type() === 'error' && !/404|TUNNEL|bad HTTP/.test(m.text())) errs.push('CONSOLE ' + m.text()); });
await p.addInitScript(() => { try { sessionStorage.setItem('bacha.session', 'u_v3'); } catch {} });
await p.goto('http://localhost:8765/index.html#/vendor/growth');
await p.waitForTimeout(2500);
await p.screenshot({ path: 's2.png', fullPage: true });
// flash deal
await p.evaluate(() => { location.hash = '#/vendor'; });
await p.waitForTimeout(1000);
const fb = p.locator('button:has-text("Flash deal")').first();
console.log('flash buttons', await p.locator('button:has-text("Flash deal")').count());
if (await fb.count()) { await fb.click(); await p.waitForTimeout(300); await p.locator('.bx-pop').screenshot({ path: 's3.png' }); await p.locator('button:has-text("Go live")').click(); await p.waitForTimeout(500); }
console.log('flash live badges', await p.locator('.bx-flash-badge').count());
// forecast prefill
await p.evaluate(() => { location.hash = '#/vendor/growth'; });
await p.waitForTimeout(1000);
await p.locator('button:has-text("Pre-fill tonight")').click();
await p.waitForTimeout(1200);
console.log('URL', p.url());
await p.screenshot({ path: 's4.png' });
// customer view sees flash badge
const c = await ctx.newPage();
await c.addInitScript(() => { try { sessionStorage.setItem('bacha.session', 'u_cust'); } catch {} });
await c.goto('http://localhost:8765/index.html#/browse');
await c.waitForTimeout(2500);
console.log('customer flash badges', await c.locator('.bx-flash-badge').count());
const card = c.locator('.bx-flash-badge').first();
if (await card.count()) { await card.scrollIntoViewIfNeeded(); await c.screenshot({ path: 's5.png' }); }
console.log(errs.join('\n'));
await b.close();
