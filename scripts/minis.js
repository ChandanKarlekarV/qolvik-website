// =========================================================
//  MINI DESIGNS — small, real, interactive UI samples.
//  Each scales to any size (CSS container units) and can be
//  mounted interactive (catalog/projects) or static (hover preview).
// =========================================================

const money = (n) => "₹" + Math.round(n).toLocaleString("en-IN");

export const MINIS = {
  // ---------- 1. Mobile wallet app (UI/UX) ----------
  finance: {
    title: "Wallet app", cat: "UI/UX", kind: "Mobile app",
    hint: "Tap the eye, switch tabs",
    html: () => `
      <div class="m-stage m-stage--beige"><div class="m-phone"><div class="m-screen fin">
        <div class="fin__top"><span class="fin__hi">Hi, Asha 👋</span><span class="m-av">A</span></div>
        <div class="fin__card">
          <small>Total balance</small><b data-bal>₹84,250.00</b>
          <button class="fin__eye" type="button" data-eye aria-label="Hide balance">◉</button>
          <div class="fin__chips"><span>+ Add</span><span>↗ Send</span></div>
        </div>
        <div class="fin__view" data-view="home">
          <div class="fin__row"><i></i><div><b>Coffee House</b><small>Today</small></div><em>−₹240</em></div>
          <div class="fin__row"><i class="d"></i><div><b>Salary</b><small>Yesterday</small></div><em class="fin__plus">+₹62,000</em></div>
          <div class="fin__row"><i></i><div><b>Electricity</b><small>Mon</small></div><em>−₹1,820</em></div>
        </div>
        <div class="fin__view fin__stats" data-view="stats" hidden>
          <small>Spending this week</small>
          <div class="fin__bars"><i style="--v:.4"></i><i style="--v:.7"></i><i style="--v:.5"></i><i style="--v:.9" class="hi"></i><i style="--v:.6"></i><i style="--v:.3"></i><i style="--v:.55"></i></div>
        </div>
        <div class="fin__view fin__cards" data-view="cards" hidden><div class="fin__cc"><span>VISA</span><b>•••• 4821</b></div><div class="fin__cc fin__cc--b"><span>RuPay</span><b>•••• 1093</b></div></div>
        <nav class="fin__tabs"><button type="button" class="is-on" data-tab="home">Home</button><button type="button" data-tab="cards">Cards</button><button type="button" data-tab="stats">Stats</button></nav>
      </div></div></div>`,
    init(el) {
      const bal = el.querySelector("[data-bal]"), eye = el.querySelector("[data-eye]");
      let hidden = false;
      eye.addEventListener("click", () => {
        hidden = !hidden;
        bal.textContent = hidden ? "₹ ••••••" : "₹84,250.00";
        eye.textContent = hidden ? "◎" : "◉";
        eye.setAttribute("aria-label", hidden ? "Show balance" : "Hide balance");
      });
      el.querySelectorAll("[data-tab]").forEach((t) => t.addEventListener("click", () => {
        el.querySelectorAll("[data-tab]").forEach((x) => x.classList.toggle("is-on", x === t));
        el.querySelectorAll("[data-view]").forEach((v) => (v.hidden = v.dataset.view !== t.dataset.tab));
      }));
    },
  },

  // ---------- 2. Analytics dashboard (Web app) ----------
  dashboard: {
    title: "Analytics dashboard", cat: "Web app", kind: "SaaS web app",
    hint: "Switch week/month, hover bars",
    html: () => `
      <div class="m-stage m-stage--dark"><div class="m-browser">
        <div class="m-bar"><i></i><i></i><i></i><span>app.pulse.io</span></div>
        <div class="dash">
          <aside class="dash__side"><b>◆</b><i class="is-on"></i><i></i><i></i><i></i></aside>
          <div class="dash__main">
            <div class="dash__head"><b>Revenue</b><div class="m-seg"><button type="button" class="is-on" data-p="w">Week</button><button type="button" data-p="m">Month</button></div></div>
            <div class="dash__kpis"><div><small>Revenue</small><b data-k1>₹4.2L</b><em>+12%</em></div><div><small>Orders</small><b data-k2>1,284</b><em>+8%</em></div><div class="is-dark"><small>Uptime</small><b>99.9%</b></div></div>
            <div class="dash__chart" data-chart>
              ${[0.5, 0.75, 0.6, 0.9, 0.8, 0.45, 0.65].map((v, i) => `<i style="--v:${v}" data-i="${i}"${i === 3 ? ' class="is-hi"' : ""}></i>`).join("")}
              <span class="dash__tip" data-tip></span>
            </div>
          </div>
        </div>
      </div></div>`,
    init(el) {
      const SETS = { w: [0.5, 0.75, 0.6, 0.9, 0.8, 0.45, 0.65], m: [0.35, 0.55, 0.7, 0.6, 0.85, 0.95, 0.8] };
      const KPI = { w: ["₹4.2L", "1,284"], m: ["₹17.8L", "5,402"] };
      const bars = [...el.querySelectorAll("[data-chart] i")], tip = el.querySelector("[data-tip]");
      let set = "w";
      el.querySelectorAll("[data-p]").forEach((b) => b.addEventListener("click", () => {
        set = b.dataset.p;
        el.querySelectorAll("[data-p]").forEach((x) => x.classList.toggle("is-on", x === b));
        bars.forEach((bar, i) => bar.style.setProperty("--v", SETS[set][i]));
        el.querySelector("[data-k1]").textContent = KPI[set][0];
        el.querySelector("[data-k2]").textContent = KPI[set][1];
      }));
      bars.forEach((bar, i) => {
        bar.addEventListener("pointerenter", () => { tip.textContent = money(SETS[set][i] * (set === "w" ? 90000 : 380000)); tip.classList.add("is-on"); });
        bar.addEventListener("pointerleave", () => tip.classList.remove("is-on"));
      });
    },
  },

  // ---------- 3. Marketing website (Website) ----------
  landing: {
    title: "SaaS landing page", cat: "Website", kind: "Marketing website",
    hint: "Toggle monthly / yearly",
    html: () => `
      <div class="m-stage m-stage--grey"><div class="m-browser">
        <div class="m-bar"><i></i><i></i><i></i><span>nimbus.app</span></div>
        <div class="land">
          <nav><b>◐ Nimbus</b><span>Product</span><span>Pricing</span><span>Blog</span><em>Sign up</em></nav>
          <div class="land__hero"><small>New · v2.0 is live</small><h4>Plan less. <em>Ship more.</em></h4><p>The calm workspace for small teams.</p><button type="button" class="land__cta" data-cta>Start free →</button></div>
          <div class="land__price">
            <div class="m-seg"><button type="button" class="is-on" data-bill="m">Monthly</button><button type="button" data-bill="y">Yearly −20%</button></div>
            <div class="land__plans"><div><small>Starter</small><b data-price="499">₹499</b><span>/mo</span></div><div class="is-pop"><small>Pro</small><b data-price="1299">₹1,299</b><span>/mo</span></div><div><small>Team</small><b data-price="2999">₹2,999</b><span>/mo</span></div></div>
          </div>
        </div>
      </div></div>`,
    init(el) {
      el.querySelectorAll("[data-bill]").forEach((b) => b.addEventListener("click", () => {
        el.querySelectorAll("[data-bill]").forEach((x) => x.classList.toggle("is-on", x === b));
        el.querySelectorAll("[data-price]").forEach((p) => {
          const v = +p.dataset.price * (b.dataset.bill === "y" ? 0.8 : 1);
          p.textContent = money(v);
          p.animate?.([{ transform: "translateY(40%)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 350, easing: "cubic-bezier(.22,1,.36,1)" });
        });
      }));
      const cta = el.querySelector("[data-cta]");
      cta.addEventListener("click", () => { cta.textContent = "You're in ✓"; setTimeout(() => (cta.textContent = "Start free →"), 1600); });
    },
  },

  // ---------- 4. E-commerce product (MVP) ----------
  shop: {
    title: "Online store", cat: "MVP", kind: "E-commerce MVP",
    hint: "Pick colour & size, add to bag",
    html: () => `
      <div class="m-stage m-stage--beige"><div class="m-browser">
        <div class="m-bar"><i></i><i></i><i></i><span>kiln.store</span><b class="shop__bag" data-bag>Bag <em data-count>0</em></b></div>
        <div class="shop">
          <div class="shop__img"><div class="shop__obj" data-obj></div><div class="shop__shadow"></div><span class="shop__new">New</span></div>
          <div class="shop__info">
            <small>Kiln & Co. · Handmade</small>
            <h4>Everyday Mug</h4>
            <b class="shop__price">₹899</b>
            <div class="shop__label">Colour · <span data-cname>Charcoal</span></div>
            <div class="shop__sw">${[["#141414", "Charcoal"], ["#E8853D", "Sand"], ["#9A9A9A", "Stone"]].map(([c, n], i) => `<button type="button" style="--c:${c}" data-color="${c}" data-name="${n}" aria-label="${n}"${i === 0 ? ' class="is-on"' : ""}></button>`).join("")}</div>
            <div class="shop__sizes">${["S", "M", "L"].map((s, i) => `<button type="button" data-size${i === 1 ? ' class="is-on"' : ""}>${s}</button>`).join("")}</div>
            <button type="button" class="shop__add" data-add>Add to bag</button>
          </div>
        </div>
      </div></div>`,
    init(el) {
      const obj = el.querySelector("[data-obj]");
      el.querySelectorAll("[data-color]").forEach((b) => b.addEventListener("click", () => {
        el.querySelectorAll("[data-color]").forEach((x) => x.classList.toggle("is-on", x === b));
        obj.style.setProperty("--c", b.dataset.color);
        el.querySelector("[data-cname]").textContent = b.dataset.name;
      }));
      el.querySelectorAll("[data-size]").forEach((b) => b.addEventListener("click", () => el.querySelectorAll("[data-size]").forEach((x) => x.classList.toggle("is-on", x === b))));
      let n = 0;
      const add = el.querySelector("[data-add]"), count = el.querySelector("[data-count]");
      add.addEventListener("click", () => {
        count.textContent = ++n;
        count.animate?.([{ transform: "scale(1.6)" }, { transform: "scale(1)" }], { duration: 400, easing: "cubic-bezier(.34,1.56,.64,1)" });
        add.textContent = "Added ✓";
        add.classList.add("is-done");
        setTimeout(() => { add.textContent = "Add to bag"; add.classList.remove("is-done"); }, 1200);
      });
    },
  },

  // ---------- 5. Campus ERP attendance (ERP) ----------
  erp: {
    title: "ERP attendance", cat: "ERP", kind: "Campus ERP module",
    hint: "Mark students, then submit",
    html: () => `
      <div class="m-stage m-stage--dark"><div class="m-browser">
        <div class="m-bar"><i></i><i></i><i></i><span>campus.school.edu</span></div>
        <div class="att">
          <header><div><b>Class 8-B</b><small>Attendance · Today</small></div><span data-present>5 / 6 present</span></header>
          <ul>${["Aarav S", "Diya K", "Kabir M", "Meera R", "Rohan P", "Sara J"].map((n, i) => `
            <li><button type="button" data-stu class="${i === 3 ? "is-absent" : ""}"><span class="m-av">${n[0]}</span><b>${n}</b><em>${i === 3 ? "Absent" : "Present"}</em></button></li>`).join("")}</ul>
          <footer><small data-note>Parents of absent students are notified.</small><button type="button" class="att__submit" data-submit>Submit</button></footer>
        </div>
      </div></div>`,
    init(el) {
      const stus = [...el.querySelectorAll("[data-stu]")];
      const sync = () => { el.querySelector("[data-present]").textContent = `${stus.filter((s) => !s.classList.contains("is-absent")).length} / ${stus.length} present`; };
      stus.forEach((s) => s.addEventListener("click", () => {
        s.classList.toggle("is-absent");
        s.querySelector("em").textContent = s.classList.contains("is-absent") ? "Absent" : "Present";
        sync();
      }));
      const submit = el.querySelector("[data-submit]");
      submit.addEventListener("click", () => {
        const absent = stus.filter((s) => s.classList.contains("is-absent")).length;
        submit.textContent = "Submitted ✓";
        submit.classList.add("is-done");
        el.querySelector("[data-note]").textContent = absent ? `${absent} parent${absent > 1 ? "s" : ""} notified by SMS.` : "Full attendance today 🎉";
        setTimeout(() => { submit.textContent = "Submit"; submit.classList.remove("is-done"); el.querySelector("[data-note]").textContent = "Parents of absent students are notified."; }, 2000);
      });
    },
  },

  // ---------- 6. Mobile onboarding (MVP) ----------
  onboard: {
    title: "App onboarding", cat: "UI/UX", kind: "Mobile MVP",
    hint: "Tap Next to swipe through",
    html: () => `
      <div class="m-stage m-stage--sand"><div class="m-phone"><div class="m-screen onb" data-slide="0">
        <div class="onb__skip">Skip</div>
        <div class="onb__art"><i class="a"></i><i class="b"></i><i class="c"></i></div>
        <div class="onb__txt"><h5 data-h>Track every class</h5><p data-p>Attendance and timetables in one place.</p></div>
        <div class="onb__foot"><div class="onb__dots"><i class="is-on"></i><i></i><i></i></div><button type="button" class="onb__next" data-next>Next</button></div>
      </div></div></div>`,
    init(el) {
      const S = [["Track every class", "Attendance and timetables in one place."], ["Pay fees in seconds", "Secure payments with instant receipts."], ["Stay in the loop", "Notices and results, right on your phone."]];
      const screen = el.querySelector(".onb"), next = el.querySelector("[data-next]");
      let i = 0;
      next.addEventListener("click", () => {
        i = (i + 1) % S.length;
        screen.dataset.slide = i;
        el.querySelector("[data-h]").textContent = S[i][0];
        el.querySelector("[data-p]").textContent = S[i][1];
        el.querySelectorAll(".onb__dots i").forEach((d, k) => d.classList.toggle("is-on", k === i));
        next.textContent = i === S.length - 1 ? "Get started" : "Next";
        el.querySelector(".onb__txt").animate?.([{ transform: "translateX(20%)", opacity: 0 }, { transform: "none", opacity: 1 }], { duration: 400, easing: "cubic-bezier(.22,1,.36,1)" });
      });
    },
  },
};

// Mount a mini into a host element. interactive=false → a static screenshot-like preview.
// stage: optional backdrop (beige | sand | grey | dark) so projects that share a design still look distinct.
export function mountMini(host, key, { interactive = true, stage } = {}) {
  const m = MINIS[key];
  if (!m) return;
  host.innerHTML = `<div class="mini${interactive ? " is-live" : ""}" data-mini="${key}">${m.html()}</div>`;
  const root = host.firstElementChild;
  const st = stage && root.querySelector(".m-stage");
  if (st) st.className = st.className.replace(/m-stage--\w+/, `m-stage--${stage}`);
  if (interactive) m.init(root);
  else root.setAttribute("inert", "");
  return root;
}
