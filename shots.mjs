import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [,, prefix='base', w='1360'] = process.argv;
const b = await chromium.launch();
const errs = [];
async function shot(user, hash, name, full=false) {
  const ctx = await b.newContext({ viewport: { width: +w, height: 900 } });
  const p = await ctx.newPage();
  p.on('pageerror', e => errs.push(name + ' PAGEERR ' + e.message));
  await p.addInitScript(([u]) => { try { if (u) sessionStorage.setItem('bacha.session', u); localStorage.setItem('bacha.onboarded','1'); } catch {} }, [user]);
  await p.goto('http://localhost:8765/index.html#' + hash);
  await p.waitForTimeout(2200);
  const skip = p.locator('button:has-text("Skip")'); if (await skip.count()) { await skip.first().click(); await p.waitForTimeout(300); }
  await p.screenshot({ path: `shots/${prefix}-${name}.png`, fullPage: full });
  await ctx.close();
}
await shot(null, '/', 'home', true);
await shot('u_v3', '/vendor', 'vendor', true);
await shot('u_cust', '/browse', 'browse');
await shot('u_cust', '/impact', 'impact', true);
await shot('u_v3', '/vendor/growth', 'growth');
console.log(errs.join('\n') || 'no errors');
await b.close();
