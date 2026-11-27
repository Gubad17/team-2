/* Bacha · homepage (replaces the old Ws content). Calm lemon & sky design.
   Bundle helpers: oo clock, ao user, dt navigate, $o translate, to store, co isOpen,
   io login-as, xs photo, js closing chip, K ₹, Fo % off, Io number, Rs count-up,
   va base meals, Vs leaderboard, wa role info, Sn Link, Xn arrow, ma areas,
   uo distance (km), kc listings map, ei map-pin, Ai search, gi qr, Pi bag,
   oa user, Ki store, Rr hand-heart, Kr grid, Ei scale, Sr clock, Wi star. */

var BXHClosing = js;
var BXHMap = kc;
var BXHPin = ei;
var BXHPhoto = xs;
var BXLocate = G({
  name: `locate-fixed`,
  size: 24,
  node: [
    [`line`, { x1: `2`, x2: `5`, y1: `12`, y2: `12`, key: `l1` }],
    [`line`, { x1: `19`, x2: `22`, y1: `12`, y2: `12`, key: `l2` }],
    [`line`, { x1: `12`, x2: `12`, y1: `2`, y2: `5`, key: `l3` }],
    [`line`, { x1: `12`, x2: `12`, y1: `19`, y2: `22`, key: `l4` }],
    [`circle`, { cx: `12`, cy: `12`, r: `7`, key: `l5` }],
    [`circle`, { cx: `12`, cy: `12`, r: `3`, key: `l6` }],
  ],
});
var BXCheck = G({ name: `check`, size: 24, node: [[`path`, { d: `M20 6 9 17l-5-5`, key: `c1` }]] });

function BXHLocation({ me, now, find }) {
  let { listings, vendors } = to();
  let [area, setArea] = v.useState(me?.area && ma[me.area] ? me.area : `Koramangala`);
  let [mine, setMine] = v.useState(null); // [lat,lng] from the browser
  let [note, setNote] = v.useState(``);
  let origin = mine || ma[area];
  let rows = listings
    .filter((l) => co(l, now) && l.saleLeft > 0)
    .map((l) => {
      let vd = vendors.find((x) => x.id === l.vendorId);
      return { ...l, vendor: vd, km: uo(origin, vd.coords), left: l.saleLeft, price: l.discountedPrice, gone: false };
    })
    .sort((a, b) => a.km - b.km);
  let near = rows.filter((r) => r.km <= 5);
  let locate = () => {
    if (!navigator.geolocation) return setNote(`Location isn’t available in this browser.`);
    setNote(`Finding you…`);
    navigator.geolocation.getCurrentPosition(
      (p) => {
        let c = [p.coords.latitude, p.coords.longitude];
        if (Math.abs(c[0] - 12.97) > 0.5 || Math.abs(c[1] - 77.6) > 0.5) return setNote(`You seem to be outside Bangalore, so we’re showing ${area}.`);
        let closest = Object.entries(ma).sort((a, b) => uo(c, a[1]) - uo(c, b[1]))[0][0];
        setMine(c);
        setArea(closest);
        setNote(``);
      },
      () => setNote(`Couldn’t get your location. Pick an area instead.`),
      { timeout: 6e3 },
    );
  };
  return (
    <section className="bxh-loc" aria-label="Food near you">
      <div className="bxh-loc-head">
        <span className="bxh-loc-ic"><BXHPin /></span>
        <div className="bxh-loc-where">
          <label htmlFor="bxh-area" className="bxh-loc-k">{mine ? `Near your location` : `Showing food near`}</label>
          <div className="bxh-loc-sel">
            <select id="bxh-area" value={area} onChange={(e) => { setArea(e.target.value); setMine(null); setNote(``); }}>
              {Object.keys(ma).map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
            <span className="bxh-loc-city">, Bengaluru</span>
          </div>
        </div>
        <button type="button" className={`bxh-loc-btn ${mine ? `on` : ``}`} onClick={locate}>
          <BXLocate /> {mine ? `Located` : `Use my location`}
        </button>
      </div>
      {note && <p className="bxh-loc-note" role="status">{note}</p>}
      <div className="bxh-map">
        <BXHMap rows={near.length ? near : rows.slice(0, 6)} origin={origin} now={now} role="customer" />
      </div>
      <ul className="bxh-near">
        {(near.length ? near : rows).slice(0, 3).map((l) => (
          <li key={l.id}>
            <Sn to={me ? `/l/${l.id}` : find} className="bxh-near-row">
              <BXHPhoto src={l.photo} foodType={l.foodType} className="bxh-near-img" />
              <span className="bxh-near-body">
                <span className="bxh-near-item">{l.item}</span>
                <span className="bxh-near-meta">{l.vendor.name} · {l.km.toFixed(1)} km</span>
              </span>
              <span className="bxh-near-price">
                <b>{K(l.discountedPrice)}</b>
                <s>{K(l.originalPrice)}</s>
              </span>
            </Sn>
          </li>
        ))}
        {!rows.length && <li className="bxh-near-empty">Everything nearby has been rescued. New food is listed every evening.</li>}
      </ul>
      <Sn to={find} className="bxh-loc-all">
        {near.length ? `See all ${near.length} within 5 km` : `See all ${rows.length} listings`} <Xn />
      </Sn>
    </section>
  );
}

function BXHome() {
  let now = oo(1e3);
  let me = ao();
  let nav = dt();
  let t = $o();
  let { listings, reservations } = to();
  let open = listings.filter((l) => co(l, now) && l.saleLeft > 0);
  let done = reservations.filter((r) => r.status === `collected`);
  let kg = done.reduce((s, r) => s + r.qty * (listings.find((l) => l.id === r.listingId)?.unitKg || 0.3), 0);
  let pickups = done.reduce((s, r) => s + r.qty, 0);
  let find = me ? `/browse` : `/join?role=customer`;
  let go = (u, path) => { io(u); nav(path); };

  return (
    <div className="bxh">
      <section className="bxh-hero">
        <div className="container bxh-hero-grid">
          <div className="bxh-hero-copy">
            <p className="bxh-eyebrow"><span className="bxh-dot" /> Food rescue in Bengaluru</p>
            <h1 className="bxh-h1">{t(`home.hero`)}</h1>
            <p className="bxh-lede">
              Bakeries and kitchens list what didn’t sell before closing. You reserve it at a fraction of the price,
              collect it on your way home, and good food gets eaten instead of thrown away.
            </p>
            <div className="bxh-ctas">
              <Sn to={find} className="btn btn-primary btn-l">{t(`home.find`)} <Xn /></Sn>
              <Sn to="/join?role=vendor" className="btn btn-secondary btn-l">List your surplus</Sn>
            </div>
            <ul className="bxh-trust">
              <li><BXCheck /> 40–70% off the usual price</li>
              <li><BXCheck /> No delivery fees</li>
              <li><BXCheck /> A share goes to local charities</li>
            </ul>
          </div>
          <BXHLocation me={me} now={now} find={find} />
        </div>
      </section>

      <section className="container">
        <dl className="bxh-stats">
          {[
            [<Rs key="m" value={va + pickups} />, `Meals rescued across Bangalore`],
            [`${Io(kg)} kg`, `Food saved in this app`],
            [pickups, `Pickups collected`],
            [open.length, `Listings open right now`],
          ].map(([n, l]) => (
            <div key={l}>
              <dd>{n}</dd>
              <dt>{l}</dt>
            </div>
          ))}
        </dl>
      </section>

      <section id="how" className="bxh-sec scroll-mt-20">
        <div className="container">
          <div className="bxh-sec-head center">
            <p className="bxh-kicker">How it works</p>
            <h2 className="bxh-h2">Rescue food in three steps</h2>
            <p className="bxh-sub">No subscriptions and no delivery fees. Just good food that would otherwise be thrown away.</p>
          </div>
          <ol className="bxh-steps">
            {[
              [Ai, `Find surplus near you`, `Bakeries and kitchens list what didn’t sell. Browse the list or the map, or ask the assistant.`],
              [gi, `Reserve and pay in the app`, `You get a pickup code straight away. Prices are 40–70% below the usual.`],
              [Pi, `Pick it up before closing`, `Show your code at the counter during the pickup window. That’s it.`],
            ].map(([I, h, p], i) => (
              <li key={h} className="bxh-step">
                <div className="bxh-step-top">
                  <span className="bxh-step-ic"><I /></span>
                  <span className="bxh-step-n">0{i + 1}</span>
                </div>
                <h3>{h}</h3>
                <p>{p}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="roles" className="bxh-sec bxh-band scroll-mt-20">
        <div className="container">
          <div className="bxh-sec-head">
            <p className="bxh-kicker">Built for the whole chain</p>
            <h2 className="bxh-h2">One platform for buyers, vendors and charities</h2>
          </div>
          <div className="bxh-roles">
            {[
              [`customer`, oa, `Customers`, [`40–70% off tonight’s food`, `Track the meals you’ve rescued`]],
              [`vendor`, Ki, `Vendors`, [`List surplus in under two minutes`, `Forecasts, flash deals and rewards`]],
              [`charity`, Rr, `Charities and NGOs`, [`Free donations from nearby kitchens`, `Plan pickups with volunteers`]],
            ].map(([k, I, h, pts]) => (
              <div key={k} className={`bxh-role r-${k}`}>
                <span className="bxh-role-ic"><I /></span>
                <h3>{h}</h3>
                <p>{wa[k]?.blurb}</p>
                <ul>{pts.map((p) => <li key={p}><BXCheck /> {p}</li>)}</ul>
                <Sn to={`/join?role=${k}`} className="bxh-role-cta">Sign up as a {wa[k]?.label.toLowerCase()} <Xn /></Sn>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bxh-sec">
        <div className="container bxh-two">
          <Vs defaultArea="Indiranagar" meId={me?.id} />
          <section className="widget">
            <div className="widget-head">
              <div className="min-w-0">
                <p className="t">Jump into the demo</p>
                <p className="s">Open a second window and pick another role. Changes sync live.</p>
              </div>
            </div>
            <div className="bxh-demo-list">
              {[
                [`u_cust`, `/browse`, `Customer`, `Ananya Rao · Koramangala`, oa],
                [`u_char`, `/board`, `NGO`, `Annadana Food Bank`, Rr],
                [`u_v1`, `/vendor`, `Vendor`, `Sunrise Iyengar Bakery`, Ki],
                [`u_v3`, `/vendor`, `Vendor`, `Masala Box Kitchen`, Ki],
                [`u_admin`, `/admin`, `Admin`, `Bacha Ops`, Kr],
              ].map(([u, p, role, name, I], i) => (
                <button key={u} type="button" onClick={() => go(u, p)} className="bxh-demo-row">
                  <span className={`bxh-demo-ic ${i % 2 ? `lemon` : ``}`}><I /></span>
                  <span className="flex-1 min-w-0">
                    <span className="bxh-demo-n">{name}</span>
                    <span className="bxh-demo-r">{role}</span>
                  </span>
                  <Xn className="h-4 w-4" />
                </button>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="container bxh-cta-wrap">
        <div className="bxh-cta">
          <div>
            <h2 className="bxh-h2">Got food left at closing time?</h2>
            <p>List it in under two minutes. Sell it at a discount, donate it, or both.</p>
          </div>
          <div className="bxh-ctas">
            <Sn to="/join?role=vendor" className="btn btn-primary btn-l">List your surplus <Xn /></Sn>
            <Sn to="/join?role=charity" className="btn btn-secondary btn-l">Join as a charity</Sn>
          </div>
        </div>
      </section>
    </div>
  );
}
