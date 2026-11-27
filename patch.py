import re, sys, hashlib, pathlib
import sys; sys.path.insert(0, "/home/claude/bacha")

root = pathlib.Path('/home/claude/bacha')
js = (root / 'orig/index.js').read_text()
add = ''.join((root / f'out/{n}.js').read_text().replace('"use strict";', '', 1) for n in ['vendor-plus', 'home'])


def sub(old, new, s):
    n = s.count(old)
    if n != 1:
        sys.exit(f'anchor count {n}: {old[:80]}')
    return s.replace(old, new)


# 1. new components, top-level, before the route guard
js = sub('function dX(', add + '\nfunction dX(', js)
# 2. route
js = sub('path:`/vendor/new`,element:(0,Y.jsx)(dX,{roles:[`vendor`],children:(0,Y.jsx)(XY,{})})}),',
         'path:`/vendor/new`,element:(0,Y.jsx)(dX,{roles:[`vendor`],children:(0,Y.jsx)(XY,{})})}),'
         '(0,Y.jsx)(Nt,{path:`/vendor/growth`,element:(0,Y.jsx)(dX,{roles:[`vendor`],children:(0,Y.jsx)(BXGrowth,{})})}),', js)
# 3. nav + i18n
js = sub('vendor:[[`/vendor`,`nav.dashboard`,Kr],[`/vendor/new`,`nav.new`,mi]]',
         'vendor:[[`/vendor`,`nav.dashboard`,Kr],[`/vendor/new`,`nav.new`,mi],[`/vendor/growth`,`nav.growth`,na]]', js)
js = sub('"nav.new":`New listing`', '"nav.new":`New listing`,"nav.growth":`Growth & rewards`', js)
js = sub('"nav.new":{kn:`ಹೊಸ ಪಟ್ಟಿ`,hi:`नई लिस्टिंग`}',
         '"nav.new":{kn:`ಹೊಸ ಪಟ್ಟಿ`,hi:`नई लिस्टिंग`},"nav.growth":{kn:`ಬೆಳವಣಿಗೆ ಮತ್ತು ಬಹುಮಾನ`,hi:`ग्रोथ और इनाम`}', js)
# 4. dashboard strip + flash deal button
js = sub('T.map(e=>(0,Y.jsx)(zY,', '(0,Y.jsx)(BXVendorHero,{}),T.map(e=>(0,Y.jsx)(zY,', js)
# homepage
js = sub('function Ws(){', 'function Ws(){return(0,Y.jsx)(BXHome,{});', js)
js = sub('children:[(0,Y.jsx)(Ts,{status:n}),n===`open`&&(0,Y.jsx)(Ms,{left:e.saleLeft+e.donationLeft})]',
         'children:[(0,Y.jsx)(Ts,{status:n}),n===`open`&&(0,Y.jsx)(Ms,{left:e.saleLeft+e.donationLeft}),'
         '(n===`open`||n===`upcoming`)&&(0,Y.jsx)(BXFlash,{l:e,now:t})]', js)
# 5. customer card badge
js = sub('className:`absolute left-3 top-3 flex gap-2`,children:[a&&',
         'className:`absolute left-3 top-3 flex gap-2`,children:[e.flashAt&&!i&&(0,Y.jsxs)(`span`,'
         '{className:`badge bx-flash-badge`,children:[(0,Y.jsx)(BXZap,{}),`Flash deal −`,e.flashPct,`%`]}),a&&', js)
# 6. new-listing prefill from forecast
js = sub('function XY(){let e=ao(),t=dt(),', 'function XY(){let BXloc=ct(),e=ao(),t=dt(),', js)
js = sub('S<=x&&(S+=864e5);',
         'S<=x&&(S+=864e5);(0,v.useEffect)(()=>{BXloc.state?.prefill&&y(BXloc.state.prefill,BXloc.state.label||`Forecast`)},[]);', js)

js = js.replace('dataKey:`revenue`,fill:`#6E4FD3`,radius:[2,2,0,0]', 'dataKey:`revenue`,fill:`#7FC0E8`,radius:[8,8,2,2]')
js = js.replace('dataKey:`pickups`,fill:`#C7B3FF`,radius:[2,2,0,0]', 'dataKey:`pickups`,fill:`#F1D63F`,radius:[8,8,2,2]')
js = js.replace('dataKey:`meals`,fill:`#6E4FD3`,radius:[2,2,0,0]', 'dataKey:`meals`,fill:`#7FC0E8`,radius:[8,8,2,2]')
js = js.replace('cursor:{fill:`#6E4FD314`}', 'cursor:{fill:`#3B8FC414`,radius:8}').replace('cursor:{fill:`#C7B3FF33`}', 'cursor:{fill:`#F1D63F22`,radius:8}')
js = js.replace('t?.color||`#2A1454`', '`#0E2A3E`')
js = js.replace('cy:`17`,r:`8`,fill:`#C7B3FF`', 'cy:`17`,r:`8`,fill:`#F8E36A`')
from recolor import recolor as _rc
js = _rc(js)
h = hashlib.sha256(js.encode()).hexdigest()[:8]
out = root / 'build'
(out / 'assets').mkdir(parents=True, exist_ok=True)
(out / f'assets/index-{h}.js').write_text(js)
css = (root / 'orig/index.css').read_text() + ''.join('\n' + (root / f'src/{n}.css').read_text() for n in ['vendor-plus', 'theme', 'home'])
import importlib.util, sys as _s
_s.path.insert(0, str(root))
from recolor import recolor
css = recolor(css)
import shutil
for f in (root / 'src/fonts').iterdir():
    if 'jakarta' in f.name: shutil.copy(f, out / 'assets' / f.name)
ch = hashlib.sha256(css.encode()).hexdigest()[:8]
(out / f'assets/index-{ch}.css').write_text(css)
html = (root / 'orig/index.html').read_text().replace('#2A1454', '#0E2A3E')
html = re.sub(r'assets/index-[^"]+\.js', f'assets/index-{h}.js', html)
html = re.sub(r'assets/index-[^"]+\.css', f'assets/index-{ch}.css', html)
(out / 'index.html').write_text(html)
print(h, ch)
