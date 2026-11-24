// =========================================================
//  CAMPUS ERP — interactive product demo (sample data)
// =========================================================
const INST = {
  school: {
    name: "Greenfield Public School", short: "Greenfield", unit: "Class", students: 1240, att: 96, fees: 82, pending: 418000,
    groups: ["6-A", "7-B", "8-A", "8-B", "9-C", "10-A"],
    subjects: ["Maths", "Science", "English", "Hindi", "Social", "Art"],
    people: ["Aarav Sharma", "Diya Kapoor", "Kabir Mehta", "Meera Rao", "Rohan Patel", "Sara Joseph", "Ishaan Gupta"],
  },
  college: {
    name: "Riverside College of Commerce", short: "Riverside", unit: "Batch", students: 3860, att: 91, fees: 76, pending: 1840000,
    groups: ["B.Com S1", "B.Com S3", "BBA S1", "BBA S5", "M.Com S2", "B.Sc S5"],
    subjects: ["Accounts", "Economics", "Tax", "Business Law", "Statistics", "Marketing"],
    people: ["Ananya Iyer", "Vikram Nair", "Priya Das", "Arjun Reddy", "Neha Singh", "Rahul Verma", "Fatima Khan"],
  },
  university: {
    name: "Northgate University", short: "Northgate", unit: "Dept.", students: 18400, att: 88, fees: 71, pending: 9620000,
    groups: ["Physics", "CSE", "Law", "Economics", "Biotech", "Design"],
    subjects: ["Quantum", "Algorithms", "Contracts", "Macro", "Genetics", "Studio"],
    people: ["Dr. Kavya Menon", "Aditya Bose", "Sneha Pillai", "Omar Sheikh", "Riya Banerjee", "Karan Malhotra", "Tara Fernandes"],
  },
};
const NAV = [
  ["dashboard", "Dashboard", "M4 13h6V4H4zM14 20h6v-9h-6zM4 20h6v-4H4zM14 4v4h6V4z"],
  ["students", "Students", "M16 19v-1a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v1M9 10a3 3 0 1 0 0-6 3 3 0 0 0 0 6Zm13 9v-1a4 4 0 0 0-3-3.9M16 4.1a3 3 0 0 1 0 5.8"],
  ["attendance", "Attendance", "M5 4h14v16H5zM9 9l2 2 4-4M9 15h6"],
  ["fees", "Fees", "M3 6h18v12H3zM3 10h18M7 15h3"],
  ["timetable", "Timetable", "M4 5h16v15H4zM4 10h16M9 5v15M8 3v4m8-4v4"],
];
const svg = (d) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${d}"/></svg>`;
const fmt = (n) => n.toLocaleString("en-IN");
const rupees = (n) => n >= 100000 ? `₹${(n / 100000).toFixed(1)}L` : `₹${fmt(n)}`;
// deterministic pseudo-random so numbers are stable per institution
const rand = (seed) => () => ((seed = (seed * 9301 + 49297) % 233280) / 233280);

export function initErpApp(root, { M, useMotion, ease } = {}) {
  let inst = "school", view = "dashboard";

  root.innerHTML = `
    <aside class="ea__side">
      <div class="ea__brand"><span class="ea__logo"><i></i><i></i><i></i><i></i></span><b data-ea-short></b></div>
      <nav class="ea__nav">${NAV.map(([k, l, d], i) => `<button type="button" data-v="${k}" class="${i === 0 ? "is-on" : ""}" aria-label="${l}">${svg(d)}<span>${l}</span></button>`).join("")}</nav>
      <div class="ea__me"><span class="ea__av">P</span><div><b>Principal</b><small>Admin</small></div></div>
    </aside>
    <div class="ea__main">
      <header class="ea__top">
        <div><small data-ea-name></small><b data-ea-title>Dashboard</b></div>
        <label class="ea__search">${svg("M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.3-4.3")}<input type="text" placeholder="Search students…" data-ea-search aria-label="Search students" /></label>
        <span class="ea__bell" aria-hidden="true">${svg("M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9M10 21h4")}<i></i></span>
      </header>
      <div class="ea__view" data-ea-view></div>
    </div>`;

  const $ = (s) => root.querySelector(s);
  const body = $("[data-ea-view]");

  const VIEWS = {
    dashboard(d) {
      const r = rand(d.students);
      const week = Array.from({ length: 7 }, () => d.att - 8 + Math.round(r() * 10));
      const max = 100, min = 70, W = 300, H = 110;
      const pts = week.map((v, i) => [i * (W / 6), H - ((v - min) / (max - min)) * H]);
      const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
      const groupsAtt = d.groups.slice(0, 4).map(() => 78 + Math.round(r() * 20));
      return `
        <div class="ea-kpis">
          <div class="ea-kpi"><small>Total students</small><b data-num="${d.students}">${fmt(d.students)}</b><em class="up">+4.2% this term</em></div>
          <div class="ea-kpi"><small>Attendance today</small><b>${d.att}%</b><em class="up">+1.8% vs last week</em></div>
          <div class="ea-kpi"><small>Fees collected</small><b>${d.fees}%</b><em>Term 2</em></div>
          <div class="ea-kpi ea-kpi--dark"><small>Pending fees</small><b>${rupees(d.pending)}</b><em>${Math.round(d.students * (1 - d.fees / 100))} students</em></div>
        </div>
        <div class="ea-grid">
          <div class="ea-card ea-card--chart">
            <div class="ea-card__head"><b>Attendance this week</b><span class="ea-pill">Live</span></div>
            <svg class="ea-area" viewBox="0 0 ${W} ${H + 10}" preserveAspectRatio="none">
              <defs><linearGradient id="eaG" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#E8853D" stop-opacity=".55"/><stop offset="1" stop-color="#E8853D" stop-opacity="0"/></linearGradient></defs>
              <path d="${line} L${W} ${H + 10} L0 ${H + 10}Z" fill="url(#eaG)"/>
              <path class="ea-area__line" d="${line}" />
              ${pts.map((p) => `<circle cx="${p[0]}" cy="${p[1]}" r="3.2"/>`).join("")}
            </svg>
            <div class="ea-days"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div>
          </div>
          <div class="ea-card ea-card--donut">
            <div class="ea-card__head"><b>Fee collection</b></div>
            <div class="ea-donut"><svg viewBox="0 0 42 42"><circle cx="21" cy="21" r="15.9"/><circle class="ea-donut__arc" cx="21" cy="21" r="15.9" style="--p:${d.fees}"/></svg><div><b>${d.fees}%</b><small>collected</small></div></div>
            <div class="ea-legend"><span><i></i>Paid</span><span><i class="g"></i>Pending</span></div>
          </div>
          <div class="ea-card">
            <div class="ea-card__head"><b>By ${d.unit.toLowerCase()}</b></div>
            <div class="ea-hbars">${d.groups.slice(0, 4).map((g, i) => `<div><span>${g}</span><i style="--w:${groupsAtt[i]}%"></i><b>${groupsAtt[i]}%</b></div>`).join("")}</div>
          </div>
          <div class="ea-card">
            <div class="ea-card__head"><b>Recent activity</b></div>
            <ul class="ea-feed">
              <li><i>✓</i><div><b>${d.unit} ${d.groups[3]} attendance marked</b><small>2 min ago</small></div></li>
              <li><i class="b">₹</i><div><b>${d.people[0]} paid term fee</b><small>18 min ago</small></div></li>
              <li><i class="g">✉</i><div><b>Circular sent to all parents</b><small>1 hr ago</small></div></li>
            </ul>
          </div>
        </div>`;
    },
    students(d) {
      const r = rand(d.students + 7);
      return `
        <div class="ea-card ea-table">
          <div class="ea-card__head"><b>${fmt(d.students)} students</b><span class="ea-pill" data-ea-count>Showing ${d.people.length}</span></div>
          <div class="ea-row ea-row--head"><span>Name</span><span>${d.unit}</span><span>Attendance</span><span>Fees</span></div>
          ${d.people.map((p, i) => { const a = 80 + Math.round(r() * 19); const paid = r() > 0.3; return `
          <div class="ea-row" data-name="${p.toLowerCase()}"><span><i class="ea-av2">${p.replace("Dr. ", "")[0]}</i>${p}</span><span>${d.groups[i % d.groups.length]}</span><span><em class="ea-meter"><i style="--w:${a}%"></i></em>${a}%</span><span><em class="ea-tag ${paid ? "" : "ea-tag--due"}">${paid ? "Paid" : "Due"}</em></span></div>`; }).join("")}
          <p class="ea-empty" data-ea-empty hidden>No students match your search.</p>
        </div>`;
    },
    attendance(d) {
      const r = rand(d.students + 3);
      return `
        <div class="ea-card">
          <div class="ea-card__head"><b>Attendance heatmap · this week</b><div class="ea-legend"><span><i class="g"></i>&lt;85%</span><span><i class="m"></i>85–94%</span><span><i></i>95%+</span></div></div>
          <div class="ea-heat">
            <span></span>${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((x) => `<span class="ea-heat__d">${x}</span>`).join("")}
            ${d.groups.map((g) => `<span class="ea-heat__g">${g}</span>${Array.from({ length: 6 }, () => { const v = 78 + Math.round(r() * 22); return `<i class="${v >= 95 ? "hi" : v >= 85 ? "mid" : "lo"}" title="${v}%">${v}</i>`; }).join("")}`).join("")}
          </div>
        </div>`;
    },
    fees(d) {
      const r = rand(d.students + 11);
      return `
        <div class="ea-kpis ea-kpis--3">
          <div class="ea-kpi"><small>Collected</small><b>${rupees(d.pending * (d.fees / (100 - d.fees)))}</b><em class="up">${d.fees}% of target</em></div>
          <div class="ea-kpi"><small>Pending</small><b>${rupees(d.pending)}</b><em>Due in 12 days</em></div>
          <div class="ea-kpi ea-kpi--dark"><small>Paid online</small><b>74%</b><em>UPI · cards · netbanking</em></div>
        </div>
        <div class="ea-card">
          <div class="ea-card__head"><b>Pending payments</b><button type="button" class="ea-btn" data-remind-all>Remind all</button></div>
          ${d.people.slice(0, 5).map((p, i) => `<div class="ea-fee"><span><i class="ea-av2">${p.replace("Dr. ", "")[0]}</i><b>${p}</b><small>${d.unit} ${d.groups[i]}</small></span><b>₹${fmt(4000 + Math.round(r() * 20) * 500)}</b><button type="button" class="ea-btn ea-btn--ghost" data-remind>Remind</button></div>`).join("")}
        </div>`;
    },
    timetable(d) {
      const tones = ["t1", "t2", "t3", "t4", "t5", "t6"];
      const r = rand(d.students + 5);
      return `
        <div class="ea-card">
          <div class="ea-card__head"><b>${d.unit} ${d.groups[3]} · weekly timetable</b><span class="ea-pill">Clash-free ✓</span></div>
          <div class="ea-tt">
            <span></span>${["Mon", "Tue", "Wed", "Thu", "Fri"].map((x) => `<span class="ea-tt__d">${x}</span>`).join("")}
            ${["9:00", "10:00", "11:30", "1:30"].map((t) => `<span class="ea-tt__t">${t}</span>${Array.from({ length: 5 }, () => { const k = Math.floor(r() * d.subjects.length); return `<i class="${tones[k]}">${d.subjects[k]}</i>`; }).join("")}`).join("")}
          </div>
        </div>`;
    },
  };

  function render(animate = true) {
    const d = INST[inst];
    $("[data-ea-short]").textContent = d.short;
    $("[data-ea-name]").textContent = d.name;
    $("[data-ea-title]").textContent = NAV.find((n) => n[0] === view)[1];
    body.innerHTML = VIEWS[view](d);
    $("[data-ea-search]").value = "";
    wire();
    if (animate && useMotion) {
      M.animate([...body.children], { opacity: [0, 1], transform: ["translateY(14px)", "translateY(0px)"] }, { duration: 0.5, ease, delay: M.stagger(0.06) });
      const cells = body.querySelectorAll(".ea-kpi, .ea-card, .ea-heat i, .ea-tt i, .ea-row:not(.ea-row--head)");
      if (cells.length > 12) M.animate([...cells].slice(0, 60), { opacity: [0, 1], scale: [0.94, 1] }, { duration: 0.4, ease, delay: M.stagger(0.012) });
    }
  }

  function wire() {
    body.querySelectorAll("[data-remind]").forEach((b) => b.addEventListener("click", () => { b.textContent = "Sent ✓"; b.classList.add("is-done"); }));
    const all = body.querySelector("[data-remind-all]");
    all?.addEventListener("click", () => { body.querySelectorAll("[data-remind]").forEach((b) => b.click()); all.textContent = "All reminded ✓"; all.classList.add("is-done"); });
  }

  // Search: jumps to Students and filters live
  $("[data-ea-search]").addEventListener("input", (e) => {
    const q = e.target.value.trim().toLowerCase();
    if (view !== "students") { view = "students"; setNav(); const keep = e.target.value; render(false); $("[data-ea-search]").value = keep; }
    let n = 0;
    body.querySelectorAll(".ea-row[data-name]").forEach((row) => { const ok = row.dataset.name.includes(q); row.hidden = !ok; if (ok) n++; });
    body.querySelector("[data-ea-empty]").hidden = n > 0;
    body.querySelector("[data-ea-count]").textContent = `Showing ${n}`;
  });

  const setNav = () => root.querySelectorAll("[data-v]").forEach((b) => b.classList.toggle("is-on", b.dataset.v === view));
  root.querySelectorAll("[data-v]").forEach((b) => b.addEventListener("click", () => { if (b.dataset.v === view) return; view = b.dataset.v; setNav(); render(); }));

  render(false);
  return {
    setInstitution(key) { if (!INST[key] || key === inst) return; inst = key; render(); },
    data: () => INST[inst],
  };
}
