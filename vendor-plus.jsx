/* Bacha · vendor growth features
   Injected into the app bundle's top-level scope, so it uses the bundle's
   own helpers: v = React, to = store hook, ao = current user, oo = clock,
   $a = store mutation, po = push notification, K = ₹ format, Io = number,
   _a = CO2 per kg, ma = areas, ha = food types, Os/ks/Ds/Rs = UI, Sn = Link,
   dt = useNavigate, No = relative time, q = clock time, G = icon factory. */

var BX_DAY = 864e5;
var BXFlame = G({
  name: `flame`,
  size: 24,
  node: [[`path`, { d: `M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.29 1-3a2.5 2.5 0 0 0 2.5 2.5z`, key: `bxf1` }]],
});
var BXZap = G({
  name: `zap`,
  size: 24,
  node: [[`path`, { d: `M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z`, key: `bxz1` }]],
});

var BXTrophy = na;
var BXHead = ks;
var BXPlus = mi;
var BXPinV = ei;
var BXMeal = ua;
var BX_LEVELS = [
  { min: 0, name: `Seedling`, icon: Hi, perk: `Listed on the Bacha map` },
  { min: 100, name: `Saver`, icon: Pi, perk: `“Rescue partner” sticker for your counter` },
  { min: 300, name: `Rescuer`, icon: Rr, perk: `Priority matching with nearby NGOs` },
  { min: 700, name: `Zero-Waste Hero`, icon: Xr, perk: `Featured at the top of Browse on weekends` },
  { min: 1500, name: `Bacha Legend`, icon: na, perk: `Spotlight in the Bacha city newsletter` },
];

var bxWeekStart = (t) => {
  let d = new Date(t);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7));
  return d.getTime();
};
var bxAgo = (t) => {
  let m = Math.round((Date.now() - t) / 6e4);
  return m < 1 ? `just now` : m < 60 ? `${m}m ago` : m < 1440 ? `${Math.round(m / 60)}h ago` : `${Math.round(m / 1440)}d ago`;
};
var bxDayStart = (t) => new Date(t).setHours(0, 0, 0, 0);

/* Everything the vendor features need, computed from the shared store. */
function bxVendorStats(state, vendorId, now) {
  let { listings, reservations, users, charities, vendors } = state;
  let L = (id) => listings.find((l) => l.id === id);
  let vendor = vendors.find((x) => x.id === vendorId);
  let mine = reservations.filter((r) => r.vendorId === vendorId);
  let done = mine.filter((r) => r.status === `collected`).sort((a, b) => b.collectedAt - a.collectedAt);
  let kgOf = (r) => r.qty * (L(r.listingId)?.unitKg || 0.3);
  let totalKg = done.reduce((s, r) => s + kgOf(r), 0);
  let donations = done.filter((r) => r.channel === `donation`);
  let donatedKg = donations.reduce((s, r) => s + kgOf(r), 0);
  let donatedPortions = donations.reduce((s, r) => s + r.qty, 0);
  let portions = done.reduce((s, r) => s + r.qty, 0);
  let revenue = done.reduce((s, r) => s + r.amount, 0);
  let myListings = listings.filter((l) => l.vendorId === vendorId && l.status !== `removed`);
  let soldOut = myListings.filter((l) => l.saleQty > 0 && l.saleLeft === 0).length;
  let nightPickups = done.filter((r) => new Date(r.collectedAt).getHours() >= 21).length;
  let flashCount = vendor?.flashCount || 0;

  let xp = Math.round(totalKg * 10 + donatedKg * 15 + myListings.length * 2 + flashCount * 10);
  let li = BX_LEVELS.reduce((a, lv, i) => (xp >= lv.min ? i : a), 0);
  let level = BX_LEVELS[li];
  let next = BX_LEVELS[li + 1] || null;
  let progress = next ? (xp - level.min) / (next.min - level.min) : 1;

  // weekly streak, counting back from this week (this week counts once it has a rescue,
  // and an empty current week doesn't break the streak yet)
  let wk = bxWeekStart(now);
  let weekHas = (start) => done.some((r) => r.collectedAt >= start && r.collectedAt < start + 7 * BX_DAY);
  let streak = 0;
  let w = weekHas(wk) ? wk : wk - 7 * BX_DAY;
  while (weekHas(w) && streak < 52) { streak++; w -= 7 * BX_DAY; }

  // 35-day activity heatmap, aligned to weeks
  let start = bxWeekStart(now) - 4 * 7 * BX_DAY;
  let days = [...Array(35)].map((_, i) => {
    let d = start + i * BX_DAY;
    let kg = done.filter((r) => r.collectedAt >= d && r.collectedAt < d + BX_DAY).reduce((s, r) => s + kgOf(r), 0);
    return { d, kg, future: d > now };
  });

  let monthStart = now - 30 * BX_DAY;
  let month = done.filter((r) => r.collectedAt >= monthStart);
  let monthKg = month.reduce((s, r) => s + kgOf(r), 0);
  let monthDon = month.filter((r) => r.channel === `donation`);
  let monthDonPortions = monthDon.reduce((s, r) => s + r.qty, 0);
  let monthDonKg = monthDon.reduce((s, r) => s + kgOf(r), 0);
  let monthCharities = [...new Set(monthDon.map((r) => {
    let u = users.find((x) => x.id === r.userId);
    return charities.find((c) => c.id === u?.charityId)?.name;
  }).filter(Boolean))];

  let badges = [
    { icon: Hi, name: `First Rescue`, desc: `Hand over your first order`, cur: done.length, goal: 1 },
    { icon: Rr, name: `Generous Kitchen`, desc: `Donate 10 kg to charities`, cur: donatedKg, goal: 10, kg: true },
    { icon: Wi, name: `Sell-out Star`, desc: `Sell out 5 listings`, cur: soldOut, goal: 5 },
    { icon: na, name: `Century Club`, desc: `Rescue 100 portions`, cur: portions, goal: 100 },
    { icon: Xr, name: `Climate Champion`, desc: `Avoid 100 kg of CO₂`, cur: totalKg * _a, goal: 100, kg: true },
    { icon: oi, name: `Night Saver`, desc: `5 pickups after 9pm`, cur: nightPickups, goal: 5 },
    { icon: BXFlame, name: `Streak Keeper`, desc: `Rescue food 4 weeks in a row`, cur: streak, goal: 4 },
    { icon: BXZap, name: `Flash Master`, desc: `Run your first flash deal`, cur: flashCount, goal: 1 },
  ].map((b) => ({ ...b, done: b.cur >= b.goal, pct: Math.min(1, b.cur / b.goal) }));

  return {
    vendor, done, kgOf, L, totalKg, donatedKg, donatedPortions, portions, revenue, xp, level, li, next,
    progress, streak, days, monthKg, monthDonPortions, monthDonKg, monthCharities, badges, myListings,
  };
}

function bxLeaderboard(state, now) {
  let since = now - 30 * BX_DAY;
  let L = (id) => state.listings.find((l) => l.id === id);
  return state.vendors
    .map((vd) => ({
      id: vd.id,
      name: vd.name,
      area: vd.area,
      kg: state.reservations
        .filter((r) => r.vendorId === vd.id && r.status === `collected` && r.collectedAt >= since)
        .reduce((s, r) => s + r.qty * (L(r.listingId)?.unitKg || 0.3), 0),
    }))
    .sort((a, b) => b.kg - a.kg);
}

/* Tonight's surplus forecast from this vendor's own history. */
function bxForecast(state, vendorId, now) {
  let today = new Date(now).getDay();
  let past = state.listings.filter((l) => l.vendorId === vendorId && l.status !== `removed` && l.windowEnd < now);
  let sameDay = past.filter((l) => new Date(l.windowStart).getDay() === today);
  let sample = sameDay.length >= 2 ? sameDay : past;
  let byDay = [...Array(7)].map((_, d) => {
    let ls = past.filter((l) => new Date(l.windowStart).getDay() === d);
    return { d, avg: ls.length ? ls.reduce((s, l) => s + l.quantity, 0) / ls.length : 0, n: ls.length };
  });
  if (!sample.length) return { empty: true, byDay, today };
  let avgQty = sample.reduce((s, l) => s + l.quantity, 0) / sample.length;
  let sellThrough = sample.reduce((s, l) => s + (l.saleQty ? (l.saleQty - l.saleLeft) / l.saleQty : 1), 0) / sample.length;
  let priced = sample.filter((l) => l.discountedPrice > 0);
  let avgPrice = priced.length ? priced.reduce((s, l) => s + l.discountedPrice, 0) / priced.length : 0;
  let avgOrig = priced.length ? priced.reduce((s, l) => s + l.originalPrice, 0) / priced.length : 0;
  let hours = sample.map((l) => new Date(l.windowStart).getHours());
  let startHour = Math.round(hours.reduce((s, h) => s + h, 0) / hours.length);
  let predicted = Math.max(1, Math.round(avgQty));
  let expectSold = Math.round(predicted * Math.min(1, sellThrough));
  let fans = state.users.filter((u) => u.role === `customer` && u.favourites?.includes(vendorId)).length;
  let template =
    state.listings
      .filter((l) => l.vendorId === vendorId && l.description && l.channel !== `donation`)
      .sort((a, b) => b.createdAt - a.createdAt)[0] ||
    state.listings.filter((l) => l.vendorId === vendorId).sort((a, b) => b.createdAt - a.createdAt)[0];
  let ws = new Date(now).setHours(startHour, 0, 0, 0);
  if (ws < now + 15 * 6e4) ws = now + 15 * 6e4;
  let ft = ha.find((f) => f.id === (template?.foodType || state.vendors.find((x) => x.id === vendorId)?.type));
  return {
    empty: false,
    byDay,
    today,
    predicted,
    expectSold,
    leftover: Math.max(0, predicted - expectSold),
    sellThrough,
    price: Math.round(avgPrice / 5) * 5 || 0,
    orig: Math.round(avgOrig / 10) * 10 || 0,
    startHour,
    fans,
    confidence: sameDay.length >= 3 ? `High` : sample.length >= 3 ? `Medium` : `Low`,
    samples: sample.length,
    sameDay: sameDay.length >= 2,
    ft,
    prefill: template && {
      ...template,
      quantity: predicted,
      discountedPrice: Math.round(avgPrice / 5) * 5 || template.discountedPrice,
      originalPrice: Math.round(avgOrig / 10) * 10 || template.originalPrice,
      windowStart: ws,
      windowEnd: ws + 2 * 36e5,
    },
  };
}

/* Flash deal: extra % off for the rest of the window, pings customers. */
function bxFlashDeal(listingId, pct) {
  $a((t) => {
    let l = t.listings.find((x) => x.id === listingId);
    let vd = t.vendors.find((x) => x.id === l.vendorId);
    if (!l || l.flashAt) return;
    let was = l.discountedPrice;
    l.prevPrice = was;
    l.discountedPrice = Math.max(1, Math.round(was * (1 - pct / 100)));
    l.flashAt = Date.now();
    l.flashPct = pct;
    vd.flashCount = (vd.flashCount || 0) + 1;
    t.users
      .filter((u) => u.role === `customer`)
      .forEach((u) =>
        po(t, u.id, `Flash deal at ${vd.name}: ${l.item} now ${K(l.discountedPrice)} (was ${K(was)})`, `alert`, `/l/${l.id}`),
      );
    po(t, vd.userId, `Flash deal live on ${l.item}. Nearby customers have been pinged.`, `collected`, `/vendor`);
  });
}

function BXFlash({ l, now }) {
  let [open, setOpen] = v.useState(false);
  let [pct, setPct] = v.useState(20);
  let customers = to((s) => s.users.filter((u) => u.role === `customer`).length);
  if (l.flashAt)
    return (
      <span className="badge bx-flash-badge" title={`Was ${K(l.prevPrice)}`}>
        <BXZap /> Flash live · {K(l.discountedPrice)}
      </span>
    );
  if (!(l.saleLeft > 0) || now > l.windowEnd) return null;
  let nextPrice = Math.max(1, Math.round(l.discountedPrice * (1 - pct / 100)));
  return (
    <span className="bx-pop-wrap">
      <button type="button" className="btn btn-secondary btn-s bx-flash-btn" onClick={() => setOpen((o) => !o)} aria-expanded={open}>
        <BXZap /> Flash deal
      </button>
      {open && (
        <div className="bx-pop" role="dialog" aria-label="Start a flash deal">
          <p className="subtitle-s">Clear {l.saleLeft} faster</p>
          <p className="body-xs muted">Extra discount for the rest of the window. Customers get a push alert right away.</p>
          <div className="bx-seg" role="radiogroup" aria-label="Extra discount">
            {[10, 20, 30].map((p) => (
              <button key={p} type="button" role="radio" aria-checked={pct === p} className={pct === p ? `on` : ``} onClick={() => setPct(p)}>
                −{p}%
              </button>
            ))}
          </div>
          <p className="bx-price-preview">
            <s>{K(l.discountedPrice)}</s> → <b>{K(nextPrice)}</b>
            <span className="body-xs muted"> · alerts {customers} customer{customers === 1 ? `` : `s`}</span>
          </p>
          <div className="flex gap-2">
            <button type="button" className="btn btn-secondary btn-s" onClick={() => setOpen(false)}>Cancel</button>
            <button type="button" className="btn btn-primary btn-s" onClick={() => { bxFlashDeal(l.id, pct); setOpen(false); }}>
              <BXZap /> Go live
            </button>
          </div>
        </div>
      )}
    </span>
  );
}

/* Small celebratory confetti burst, no dependencies. */
function bxBurst() {
  if (typeof matchMedia !== `undefined` && matchMedia(`(prefers-reduced-motion: reduce)`).matches) return;
  let host = document.createElement(`div`);
  host.className = `bx-confetti`;
  let colors = [`#6E4FD3`, `#C7B3FF`, `#2A1454`, `#F2B84B`, `#2F8F4E`];
  for (let i = 0; i < 70; i++) {
    let p = document.createElement(`i`);
    p.style.left = `${50 + (Math.random() - 0.5) * 30}%`;
    p.style.background = colors[i % colors.length];
    p.style.setProperty(`--dx`, `${(Math.random() - 0.5) * 900}px`);
    p.style.setProperty(`--dy`, `${-200 - Math.random() * 500}px`);
    p.style.setProperty(`--r`, `${Math.random() * 720}deg`);
    p.style.animationDelay = `${Math.random() * 0.15}s`;
    host.appendChild(p);
  }
  document.body.appendChild(host);
  setTimeout(() => host.remove(), 1800);
}

/* Compact strip on the vendor dashboard. */
function BXStrip() {
  let me = ao();
  let now = oo(6e4);
  let state = to();
  let s = bxVendorStats(state, me.vendorId, now);
  let board = bxLeaderboard(state, now);
  let rank = board.findIndex((x) => x.id === me.vendorId) + 1;
  return (
    <Sn to="/vendor/growth" className="bx-strip">
      <span className="bx-strip-lvl">
        <span className="bx-emoji" aria-hidden="true"><s.level.icon /></span>
        <span>
          <span className="bx-k">Level {s.li + 1}</span>
          <span className="bx-v">{s.level.name}</span>
        </span>
      </span>
      <span className="bx-strip-bar" aria-label={`${Math.round(s.progress * 100)}% to next level`}>
        <span style={{ width: `${Math.round(s.progress * 100)}%` }} />
      </span>
      <span className="bx-strip-item"><BXFlame /> {s.streak}-week streak</span>
      <span className="bx-strip-item"><BXTrophy /> #{rank} in Bangalore</span>
      <span className="bx-strip-item"><Bi /> {s.badges.filter((b) => b.done).length}/{s.badges.length} badges</span>
      <span className="bx-strip-cta">Growth & rewards <Xn /></span>
    </Sn>
  );
}

function BXLevelCard({ s }) {
  return (
    <section className="bx-hero">
      <div className="bx-hero-main">
        <span className="bx-hero-emoji" aria-hidden="true"><s.level.icon /></span>
        <div className="min-w-0">
          <p className="bx-hero-k">Kitchen level {s.li + 1} of {BX_LEVELS.length}</p>
          <p className="bx-hero-name">{s.level.name}</p>
          <p className="bx-hero-xp">
            <Rs value={s.xp} /> XP
            {s.next && <span> · {s.next.min - s.xp} XP to {s.next.name}</span>}
          </p>
        </div>
      </div>
      <div className="bx-hero-bar"><span style={{ width: `${Math.round(s.progress * 100)}%` }} /></div>
      <ol className="bx-ladder">
        {BX_LEVELS.map((lv, i) => (
          <li key={lv.name} className={i <= s.li ? `on` : ``}>
            <span className="bx-ladder-e" aria-hidden="true"><lv.icon /></span>
            <span className="bx-ladder-n">{lv.name}</span>
            <span className="bx-ladder-p">{lv.perk}</span>
          </li>
        ))}
      </ol>
      <p className="bx-hero-foot">XP: 10 per kg rescued, +15 per kg donated, +2 per listing, +10 per flash deal.</p>
    </section>
  );
}

function BXStreak({ s, now }) {
  let max = Math.max(1, ...s.days.map((d) => d.kg));
  let tone = (kg) => (kg <= 0 ? 0 : kg < max * 0.25 ? 1 : kg < max * 0.5 ? 2 : kg < max * 0.75 ? 3 : 4);
  return (
    <section className="widget">
      <BXHead title="Rescue streak" sub="Weeks in a row with food rescued" />
      <div className="bx-streak">
        <span className="bx-streak-fire" aria-hidden="true"><BXFlame /></span>
        <span className="bx-streak-n"><Rs value={s.streak} /></span>
        <span className="bx-streak-l">week{s.streak === 1 ? `` : `s`}</span>
      </div>
      <div className="bx-heat" role="img" aria-label="Food rescued per day, last 5 weeks">
        {[`M`, `T`, `W`, `T`, `F`, `S`, `S`].map((d, i) => <span key={i} className="bx-heat-h">{d}</span>)}
        {s.days.map((d) => (
          <span
            key={d.d}
            className={`bx-heat-c t${d.future ? `x` : tone(d.kg)} ${bxDayStart(now) === d.d ? `today` : ``}`}
            title={`${new Date(d.d).toLocaleDateString(`en-IN`, { day: `numeric`, month: `short` })}: ${Io(d.kg)} kg`}
          />
        ))}
      </div>
      <p className="body-xs muted">Darker = more kg rescued that day. Keep one rescue a week to hold the streak.</p>
    </section>
  );
}

function BXBadges({ s }) {
  return (
    <section className="widget">
      <BXHead title="Vendor badges" sub={`${s.badges.filter((b) => b.done).length} of ${s.badges.length} unlocked`} />
      <ul className="bx-badges">
        {s.badges.map((b) => (
          <li key={b.name} className={b.done ? `on` : ``}>
            <span className={`icon-box lg ${b.done ? `` : `!bg-gray-100 !text-gray-400`}`}><b.icon /></span>
            <div className="min-w-0 flex-1">
              <p className={`subtitle-s ${b.done ? `` : `text-gray-500`}`}>{b.name}</p>
              <p className="body-xs muted mt-1">{b.done ? `Unlocked` : b.desc}</p>
              {!b.done && (
                <div className="bx-mini">
                  <span style={{ width: `${Math.round(b.pct * 100)}%` }} />
                  <em>{b.kg ? Io(b.cur) : Math.floor(b.cur)}/{b.goal}</em>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

function BXBoard({ me, now }) {
  let state = to();
  let vd = state.vendors.find((x) => x.id === me.vendorId);
  let [scope, setScope] = v.useState(`city`);
  let all = bxLeaderboard(state, now);
  let list = scope === `city` ? all : all.filter((x) => x.area === vd.area);
  let idx = list.findIndex((x) => x.id === vd.id);
  let ahead = idx > 0 ? list[idx - 1] : null;
  return (
    <section className="widget">
      <BXHead title="Vendor leaderboard" sub="Kg rescued, last 30 days">
        <div className="bx-seg sm" role="radiogroup" aria-label="Leaderboard scope">
          <button type="button" role="radio" aria-checked={scope === `city`} className={scope === `city` ? `on` : ``} onClick={() => setScope(`city`)}>Bangalore</button>
          <button type="button" role="radio" aria-checked={scope === `area`} className={scope === `area` ? `on` : ``} onClick={() => setScope(`area`)}>{vd.area}</button>
        </div>
      </BXHead>
      <p className="bx-gap">
        {idx === 0
          ? `You’re #1${scope === `area` ? ` in ${vd.area}` : ` in Bangalore`}. Hold the top spot!`
          : ahead
            ? `You’re #${idx + 1}. Rescue ${Io(ahead.kg - list[idx].kg + 0.1)} kg more to pass ${ahead.name}.`
            : ``}
      </p>
      <ol className="-mx-5 border-y border-gray-100">
        {list.slice(0, 6).map((x, i) => (
          <li key={x.id} className={`list-item !min-h-14 !px-5 ${x.id === vd.id ? `bg-brand-50` : ``}`}>
            <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${i < 3 ? `bg-brand-900 text-white` : `bg-gray-100 text-gray-700`}`}>{i + 1}</span>
            <span className="t flex-1 truncate">
              {x.name}{x.id === vd.id ? ` (you)` : ``}
              <span className="body-xs muted"> · {x.area}</span>
            </span>
            <span className="body-s font-medium">{Io(x.kg)} kg</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function BXForecast({ me, now }) {
  let nav = dt();
  let state = to();
  let f = bxForecast(state, me.vendorId, now);
  let names = [`Sun`, `Mon`, `Tue`, `Wed`, `Thu`, `Fri`, `Sat`];
  let max = Math.max(1, ...f.byDay.map((d) => d.avg));
  let order = [1, 2, 3, 4, 5, 6, 0];
  let hh = (h) => `${h % 12 || 12}${h < 12 ? `am` : `pm`}`;
  return (
    <section className="widget bx-forecast">
      <BXHead title="Tonight’s surplus forecast" sub={f.empty ? `Needs a few days of history` : `From your last ${f.samples} ${f.sameDay ? names[f.today] + ` ` : ``}listings`}>
        {!f.empty && <span className={`badge ${f.confidence === `High` ? `badge-success` : f.confidence === `Medium` ? `badge-brand` : ``}`}>{f.confidence} confidence</span>}
      </BXHead>
      {f.empty ? (
        <p className="body-s muted">List for a few evenings and Bacha will predict tonight’s surplus, the best price and the best time to open pickups.</p>
      ) : (
        <>
          <div className="bx-fc-big">
            <span className="bx-fc-emoji" aria-hidden="true"><BXMeal /></span>
            <div>
              <p className="bx-fc-n">~{f.predicted} portions</p>
              <p className="body-s muted">of {(f.ft?.label || `food`).toLowerCase()} likely left tonight</p>
            </div>
          </div>
          <ul className="bx-fc-facts">
            <li><Sr /> Open pickup around <b>{hh(f.startHour)}</b></li>
            {f.price > 0 && <li><Hr /> Price at <b>{K(f.price)}</b>{f.orig ? ` (was ${K(f.orig)})` : ``}</li>}
            <li><Pi /> Expect <b>{f.expectSold}</b> to sell ({Math.round(f.sellThrough * 100)}% sell-through)</li>
            {f.leftover > 0 && <li><Rr /> Plan to donate <b>{f.leftover}</b> to an NGO</li>}
            <li><Br /> <b>{f.fans}</b> customer{f.fans === 1 ? `` : `s`} favourite you and get an alert</li>
          </ul>
          <div className="bx-week" role="img" aria-label="Average portions listed by weekday">
            {order.map((d) => (
              <div key={d} className={`bx-week-col ${d === f.today ? `on` : ``}`}>
                <span className="bx-week-bar" style={{ height: `${Math.max(6, (f.byDay[d].avg / max) * 100)}%` }} title={`${names[d]}: ${f.byDay[d].avg.toFixed(1)} avg`} />
                <span className="bx-week-l">{names[d][0]}</span>
              </div>
            ))}
          </div>
          {f.prefill && (
            <button type="button" className="btn btn-primary" onClick={() => nav(`/vendor/new`, { state: { prefill: f.prefill, label: `Tonight’s forecast` } })}>
              <Bi /> Pre-fill tonight’s listing
            </button>
          )}
        </>
      )}
    </section>
  );
}

function BXFeed({ s, state }) {
  let items = s.done.slice(0, 7).map((r) => {
    let u = state.users.find((x) => x.id === r.userId);
    let l = s.L(r.listingId);
    let item = l?.item || `food`;
    if (r.channel === `donation`) {
      let c = state.charities.find((x) => x.id === u?.charityId);
      let vol = c?.volunteers?.find((x) => x.id === r.volunteerId);
      return {
        id: r.id, icon: Rr, tone: `don`, at: r.deliveredAt || r.collectedAt,
        text: `${c?.name || `A charity`} ${vol ? `(${vol.name})` : ``} picked up ${r.qty} × ${item}`,
        sub: `≈ ${r.qty} ${r.qty === 1 ? `person` : `people`} fed · ${Io(s.kgOf(r))} kg kept from the bin`,
      };
    }
    let who = u && u.role === `customer` ? `${u.name.split(` `)[0]} ${(u.name.split(` `)[1] || ``).slice(0, 1)}.` : `A walk-in customer`;
    let saved = r.qty * (l?.originalPrice || 0) - r.amount;
    return {
      id: r.id, icon: Pi, tone: `sale`, at: r.collectedAt,
      text: `${who} rescued ${r.qty} × ${item}`,
      sub: `You recovered ${K(r.amount)}${saved > 0 ? ` · they saved ${K(saved)}` : ``}`,
    };
  });
  return (
    <section className="widget">
      <BXHead title="Where your food went" sub="Every rescue, as it happens" />
      {items.length ? (
        <ol className="bx-feed">
          {items.map((it) => (
            <li key={it.id} className={it.tone}>
              <span className="icon-box"><it.icon /></span>
              <div className="min-w-0 flex-1">
                <p className="body-s font-medium">{it.text}</p>
                <p className="body-xs muted mt-0.5">{it.sub}</p>
              </div>
              <span className="body-xs muted whitespace-nowrap">{bxAgo(it.at)}</span>
            </li>
          ))}
        </ol>
      ) : (
        <p className="body-s muted">Your first handover will show up here.</p>
      )}
    </section>
  );
}

/* Shareable impact card + donation certificate, drawn on a canvas. */
function bxRound(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
function bxWrap(ctx, text, x, y, maxW, lh) {
  let words = text.split(` `), line = ``;
  for (let w of words) {
    let t = line ? line + ` ` + w : w;
    if (ctx.measureText(t).width > maxW && line) { ctx.fillText(line, x, y); line = w; y += lh; } else line = t;
  }
  ctx.fillText(line, x, y);
  return y;
}
function bxDrawCard(c, s, vd, mode) {
  let ctx = c.getContext(`2d`);
  let F = `"Roboto Variable", Roboto, "Helvetica Neue", Arial, sans-serif`;
  let month = new Date().toLocaleDateString(`en-IN`, { month: `long`, year: `numeric` });
  if (mode === `card`) {
    c.width = 1080; c.height = 1350;
    let g = ctx.createLinearGradient(0, 0, 1080, 1350);
    g.addColorStop(0, `#EEF7FC`); g.addColorStop(1, `#BFE2F4`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, 1080, 1350);
    ctx.fillStyle = `rgba(248,227,106,0.55)`;
    ctx.beginPath(); ctx.arc(980, 120, 260, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(60, 1300, 200, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = `#0E2A3E`; ctx.font = `700 40px ${F}`; ctx.fillText(`bacha`, 80, 120);
    ctx.fillStyle = `#2C76A8`; ctx.font = `600 34px ${F}`; ctx.fillText(`Last 30 days · ${month}`, 80, 200);
    ctx.fillStyle = `#0E2A3E`; ctx.font = `700 76px ${F}`; let y = bxWrap(ctx, vd.name, 80, 300, 920, 86);
    ctx.font = `400 38px ${F}`; ctx.fillStyle = `#4E5965`; ctx.fillText(`rescued good food from the bin`, 80, y + 70);
    let stats = [
      [`${Io(s.monthKg)} kg`, `food rescued`],
      [`${Math.round(s.monthKg / 0.35)}`, `meals' worth`],
      [`${Io(s.monthKg * _a)} kg`, `CO₂ avoided`],
      [`${s.monthDonPortions}`, `portions donated`],
    ];
    stats.forEach(([n, l], i) => {
      let x = 80 + (i % 2) * 470, yy = y + 150 + Math.floor(i / 2) * 270;
      ctx.fillStyle = i === 1 ? `#F8E36A` : `#FFFFFF`; bxRound(ctx, x, yy, 440, 230, 28); ctx.fill();
      ctx.fillStyle = `#0E2A3E`; ctx.font = `700 84px ${F}`; ctx.fillText(n, x + 36, yy + 120);
      ctx.fillStyle = `#4E5965`; ctx.font = `500 34px ${F}`; ctx.fillText(l, x + 36, yy + 180);
    });
    ctx.fillStyle = `#0E2A3E`; bxRound(ctx, 80, 1150, 920, 110, 55); ctx.fill();
    ctx.fillStyle = `#FFFFFF`; ctx.font = `600 40px ${F}`;
    ctx.fillText(`Level ${s.li + 1} · ${s.level.name}  ·  ${s.streak}-week streak`, 130, 1218);
  } else {
    c.width = 1400; c.height = 990;
    ctx.fillStyle = `#FFFFFF`; ctx.fillRect(0, 0, 1400, 990);
    ctx.strokeStyle = `#0E2A3E`; ctx.lineWidth = 6; ctx.strokeRect(36, 36, 1328, 918);
    ctx.strokeStyle = `#BFE2F4`; ctx.lineWidth = 2; ctx.strokeRect(54, 54, 1292, 882);
    ctx.textAlign = `center`;
    ctx.fillStyle = `#2C76A8`; ctx.font = `700 34px ${F}`; ctx.fillText(`bacha`, 700, 140);
    ctx.fillStyle = `#0E2A3E`; ctx.font = `700 64px ${F}`; ctx.fillText(`Certificate of Food Donation`, 700, 230);
    ctx.fillStyle = `#4E5965`; ctx.font = `400 30px ${F}`; ctx.fillText(`This certifies that`, 700, 320);
    ctx.fillStyle = `#111A22`; ctx.font = `700 56px ${F}`; ctx.fillText(vd.name, 700, 395);
    ctx.fillStyle = `#4E5965`; ctx.font = `400 30px ${F}`; ctx.fillText(vd.address || vd.area, 700, 445);
    ctx.fillStyle = `#222A33`; ctx.font = `400 34px ${F}`;
    let to = s.monthCharities.length ? s.monthCharities.join(`, `) : `verified charities`;
    let y = bxWrap(ctx, `donated ${s.monthDonPortions} portions (about ${Io(s.monthDonKg)} kg) of safe surplus food to ${to} through Bacha in the last 30 days, avoiding about ${Io(s.monthDonKg * _a)} kg of CO₂.`, 700, 535, 1080, 50);
    ctx.font = `400 26px ${F}`; ctx.fillStyle = `#6A7582`;
    ctx.fillText(`Issued ${new Date().toLocaleDateString(`en-IN`, { day: `numeric`, month: `long`, year: `numeric` })} · FSSAI ${String(vd.licence || ``).replace(/^FSSAI\s*/, ``)}`, 700, y + 90);
    ctx.textAlign = `left`; ctx.strokeStyle = `#A5AFB9`; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(180, 850); ctx.lineTo(560, 850); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(840, 850); ctx.lineTo(1220, 850); ctx.stroke();
    ctx.fillStyle = `#0E2A3E`; ctx.font = `italic 500 36px ${F}`; ctx.fillText(`Bacha Ops`, 280, 835);
    ctx.font = `400 24px ${F}`; ctx.fillStyle = `#6A7582`;
    ctx.fillText(`Bacha, Bengaluru`, 290, 885);
    ctx.fillText(`For CSR / ESG reporting. Not a tax receipt.`, 820, 885);
    ctx.fillStyle = `#F8E36A`; ctx.beginPath(); ctx.arc(1030, 790, 46, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = `#0E2A3E`; ctx.font = `700 40px ${F}`; ctx.textAlign = `center`; ctx.fillText(`B`, 1030, 805);
    ctx.textAlign = `left`;
  }
}

function BXShare({ s, vd }) {
  let [mode, setMode] = v.useState(`card`);
  let [url, setUrl] = v.useState(``);
  let [msg, setMsg] = v.useState(``);
  let ref = v.useRef(null);
  let key = `${mode}-${Io(s.monthKg)}-${s.monthDonPortions}-${s.level.name}-${s.streak}`;
  v.useEffect(() => {
    let alive = true;
    let draw = () => {
      if (!alive || !ref.current) return;
      bxDrawCard(ref.current, s, vd, mode);
      setUrl(ref.current.toDataURL(`image/png`));
    };
    (document.fonts?.ready || Promise.resolve()).then(draw);
    return () => { alive = false; };
  }, [key]);
  let file = `${vd.name.replace(/[^a-z0-9]+/gi, `-`).toLowerCase()}-${mode === `card` ? `impact` : `donation-certificate`}.png`;
  let share = async () => {
    try {
      let blob = await (await fetch(url)).blob();
      let f = new File([blob], file, { type: `image/png` });
      if (navigator.canShare?.({ files: [f] })) {
        await navigator.share({ files: [f], title: `${vd.name} on Bacha`, text: `We rescued ${Io(s.monthKg)} kg of food this month with Bacha.` });
      } else {
        await navigator.clipboard.writeText(`We rescued ${Io(s.monthKg)} kg of food this month with @bacha. That's ${Math.round(s.monthKg / 0.35)} meals and ${Io(s.monthKg * _a)} kg of CO₂ avoided.`);
        setMsg(`Caption copied. Download the image to post it.`);
      }
    } catch {}
  };
  return (
    <section className="widget">
      <BXHead title="Share your impact" sub="Ready for Instagram, WhatsApp or your CSR report">
        <div className="bx-seg sm" role="radiogroup" aria-label="Format">
          <button type="button" role="radio" aria-checked={mode === `card`} className={mode === `card` ? `on` : ``} onClick={() => setMode(`card`)}>Impact card</button>
          <button type="button" role="radio" aria-checked={mode === `cert`} className={mode === `cert` ? `on` : ``} onClick={() => setMode(`cert`)}>Certificate</button>
        </div>
      </BXHead>
      <canvas ref={ref} hidden />
      <div className={`bx-share-prev ${mode}`}>
        {url ? <img src={url} alt={mode === `card` ? `Impact card preview` : `Donation certificate preview`} /> : <span className="muted body-s">Drawing…</span>}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <a className="btn btn-primary btn-s" href={url || undefined} download={file}><Mr /> Download PNG</a>
        {mode === `card` && <button type="button" className="btn btn-secondary btn-s" onClick={share}><Pr /> Share</button>}
        {msg && <span className="body-xs muted">{msg}</span>}
      </div>
    </section>
  );
}

function BXGrowth() {
  let me = ao();
  let now = oo(3e4);
  let state = to();
  let vd = state.vendors.find((x) => x.id === me.vendorId);
  let s = bxVendorStats(state, me.vendorId, now);
  return (
    <div className="page">
      <Os title="Growth & rewards" sub={`${vd.name} · every rescue earns XP, badges and a spot on the leaderboard`}>
        <Sn to="/vendor" className="btn btn-secondary"><Kr /> Dashboard</Sn>
      </Os>
      <BXLevelCard s={s} />
      <div className="grid-stats">
        <Ds icon={Ei} label="Food rescued, all time" value={<><Rs value={s.totalKg} format={(x) => Io(x)} /> kg</>} />
        <Ds icon={ua} label="Portions rescued" value={<Rs value={s.portions} />} />
        <Ds icon={Rr} label="Donated to NGOs" value={<><Rs value={s.donatedPortions} /> portions</>} />
        <Ds icon={Hr} label="Revenue recovered" value={<Rs value={s.revenue} format={(x) => K(x)} />} />
      </div>
      <div className="bx-grid">
        <BXForecast me={me} now={now} />
        <BXStreak s={s} now={now} />
      </div>
      <BXBadges s={s} />
      <div className="bx-grid">
        <BXBoard me={me} now={now} />
        <BXFeed s={s} state={state} />
      </div>
      <BXShare s={s} vd={vd} />
    </div>
  );
}

/* Vendor dashboard hero: greeting, today at a glance, quick actions, level ring. */
function BXVendorHero() {
  let me = ao();
  let now = oo(3e4);
  let state = to();
  let s = bxVendorStats(state, me.vendorId, now);
  let vd = s.vendor;
  let rank = bxLeaderboard(state, now).findIndex((x) => x.id === me.vendorId) + 1;
  let live = state.listings.filter((l) => l.vendorId === me.vendorId && so(l, now) === `open`);
  let soon = state.listings.filter((l) => l.vendorId === me.vendorId && so(l, now) === `upcoming`);
  let waiting = state.reservations.filter((r) => r.vendorId === me.vendorId && r.status === `pending`).length;
  let left = live.reduce((a, l) => a + l.saleLeft + l.donationLeft, 0);
  let todayStart = bxDayStart(now);
  let todayKg = s.done.filter((r) => r.collectedAt >= todayStart).reduce((a, r) => a + s.kgOf(r), 0);
  let h = new Date(now).getHours();
  let hello = h < 12 ? `Good morning` : h < 17 ? `Good afternoon` : `Good evening`;
  let pct = Math.round(s.progress * 100);
  let R = 46, C = 2 * Math.PI * R;
  let tip =
    waiting > 0
      ? `${waiting} ${waiting === 1 ? `customer is` : `customers are`} on the way. Keep their pickup codes handy.`
      : left > 0
        ? `${left} portions are still available. A flash deal could help clear them before closing.`
        : live.length || soon.length
          ? `Everything listed is spoken for. Nicely done.`
          : `Nothing listed yet today. Check tonight’s forecast on Growth & rewards.`;
  return (
    <section className="bxv-hero">
      <div className="bxv-main">
        <p className="bxv-hello">{hello}</p>
        <h1 className="bxv-name">{vd.name}</h1>
        <p className="bxv-meta"><BXPinV /> {vd.address || vd.area}</p>
        <p className="bxv-tip"><Bi /> {tip}</p>
        <div className="bxv-chips">
          <span className="bxv-chip"><b>{live.length}</b><span>Live now</span></span>
          <span className="bxv-chip"><b>{soon.length}</b><span>Opening soon</span></span>
          <span className="bxv-chip"><b>{waiting}</b><span>Pickups waiting</span></span>
          <span className="bxv-chip"><b>{Io(todayKg)} kg</b><span>Rescued today</span></span>
        </div>
        <div className="bxv-actions">
          <Sn to="/vendor/new" className="btn btn-primary"><BXPlus /> New listing</Sn>
          <Sn to="/vendor/growth" className="btn btn-secondary"><BXTrophy /> Growth & rewards</Sn>
        </div>
      </div>
      <Sn to="/vendor/growth" className="bxv-level" aria-label={`Level ${s.li + 1}, ${s.level.name}, ${pct}% to next level`}>
        <span className="bxv-ring">
          <svg viewBox="0 0 104 104" aria-hidden="true">
            <circle cx="52" cy="52" r={R} className="trk" />
            <circle cx="52" cy="52" r={R} className="val" strokeDasharray={C} strokeDashoffset={C * (1 - s.progress)} />
          </svg>
          <span className="bxv-ring-ic" aria-hidden="true"><s.level.icon /></span>
        </span>
        <span className="bxv-lvl-k">Level {s.li + 1}</span>
        <span className="bxv-lvl-n">{s.level.name}</span>
        <span className="bxv-lvl-x">{s.next ? `${s.next.min - s.xp} XP to ${s.next.name}` : `Top level reached`}</span>
        <span className="bxv-mini">
          <span title="Weekly streak"><BXFlame /> {s.streak} wk</span>
          <span title="City rank"><BXTrophy /> #{rank}</span>
          <span title="Badges"><Bi /> {s.badges.filter((b) => b.done).length}/{s.badges.length}</span>
        </span>
      </Sn>
    </section>
  );
}
