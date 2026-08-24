/* FADEHOUSE demo — shared interactivity (no build step, no dependencies) */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initFaq();
  initGalleryFilter();
  initBookingWizard();
});

/* ---------------- Mobile menu ---------------- */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.mobile-menu');
  if (!toggle || !menu) return;
  toggle.addEventListener('click', () => {
    menu.classList.toggle('open');
    toggle.setAttribute('aria-expanded', menu.classList.contains('open'));
  });
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => menu.classList.remove('open')));
}

/* ---------------- FAQ accordion ---------------- */
function initFaq() {
  document.querySelectorAll('.faq-item').forEach((item) => {
    const q = item.querySelector('.faq-q');
    if (!q) return;
    q.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach((i) => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

/* ---------------- Gallery filter ---------------- */
function initGalleryFilter() {
  const tabs = document.querySelectorAll('[data-gallery-filter]');
  const items = document.querySelectorAll('.gallery-item');
  if (!tabs.length) return;
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');
      const filter = tab.dataset.galleryFilter;
      items.forEach((item) => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.display = show ? '' : 'none';
      });
    });
  });
}

/* ---------------- Booking wizard ---------------- */
const SERVICES = [
  { id: 'classic-cut', name: 'Classic Haircut', desc: 'Scissor or clipper cut, finished with a styling.', duration: 30, price: 35 },
  { id: 'skin-fade', name: 'Skin Fade', desc: 'Precision fade blended to bald, sharp lines.', duration: 40, price: 42 },
  { id: 'beard-trim', name: 'Beard Trim & Shape', desc: 'Line-up, taper, and razor-finished edges.', duration: 20, price: 22 },
  { id: 'hot-towel', name: 'Hot Towel Shave', desc: 'Classic straight-razor shave with hot towel prep.', duration: 30, price: 38 },
  { id: 'combo', name: 'Cut + Beard Combo', desc: 'Full haircut paired with a beard sculpt.', duration: 55, price: 55 },
  { id: 'kids-cut', name: 'Kids Cut (12 & under)', desc: 'Relaxed, quick cut for the younger clients.', duration: 25, price: 25 },
  { id: 'line-up', name: 'Line Up', desc: 'Clean edge-up between cuts.', duration: 15, price: 15 },
  { id: 'color', name: 'Hair Color / Grey Blend', desc: 'Full color or grey-blending treatment.', duration: 45, price: 48 },
];

const BARBERS = [
  { id: 'marcus', name: 'Marcus Reid', role: 'Master Barber · Owner', img: 'assets/img/barber-marcus.jpg' },
  { id: 'antonio', name: 'Antonio Silva', role: 'Fade Specialist', img: 'assets/img/barber-antonio.jpg' },
  { id: 'jordan', name: 'Jordan Blake', role: 'Style Consultant', img: 'assets/img/barber-jordan.jpg' },
  { id: 'diego', name: 'Diego Ramirez', role: 'Beard & Shave Expert', img: 'assets/img/barber-diego.jpg' },
];

function initBookingWizard() {
  const wizard = document.querySelector('[data-wizard]');
  if (!wizard) return;

  const state = {
    step: 1,
    services: new Set(),
    barber: null,
    date: null,
    time: null,
    name: '', phone: '', email: '', notes: '',
  };

  const params = new URLSearchParams(location.search);
  if (params.get('service') && SERVICES.some((s) => s.id === params.get('service'))) {
    state.services.add(params.get('service'));
  }
  if (params.get('barber') && BARBERS.some((b) => b.id === params.get('barber'))) {
    state.barber = params.get('barber');
  }

  renderServiceList();
  renderBarberGrid();
  renderDateStrip();
  renderTimeGrid();
  goToStep(1, true);

  document.querySelectorAll('[data-next]').forEach((btn) => btn.addEventListener('click', () => attemptNext()));
  document.querySelectorAll('[data-back]').forEach((btn) => btn.addEventListener('click', () => goToStep(state.step - 1)));

  const form = document.querySelector('[data-details-form]');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      state.name = form.name.value.trim();
      state.phone = form.phone.value.trim();
      state.email = form.email.value.trim();
      state.notes = form.notes.value.trim();
      if (!state.name || !state.phone) return;
      renderSummary();
      goToStep(5);
    });
  }

  function attemptNext() {
    if (state.step === 1 && state.services.size === 0) return shake('[data-panel="1"]');
    if (state.step === 2 && !state.barber) return shake('[data-panel="2"]');
    if (state.step === 3 && (!state.date || !state.time)) return shake('[data-panel="3"]');
    goToStep(state.step + 1);
  }

  function shake(sel) {
    const el = document.querySelector(sel);
    if (!el) return;
    el.animate(
      [{ transform: 'translateX(0)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(6px)' }, { transform: 'translateX(0)' }],
      { duration: 260 }
    );
  }

  function goToStep(n, silent) {
    state.step = Math.max(1, Math.min(5, n));
    document.querySelectorAll('.wizard-panel').forEach((p) => p.classList.toggle('active', Number(p.dataset.panel) === state.step));
    document.querySelectorAll('.step').forEach((s) => {
      const idx = Number(s.dataset.step);
      s.classList.toggle('active', idx === state.step);
      s.classList.toggle('done', idx < state.step);
    });
    updateStickyTotal();
    if (!silent) window.scrollTo({ top: document.querySelector('.booking-shell').offsetTop - 100, behavior: 'smooth' });
  }

  function renderServiceList() {
    const list = document.querySelector('[data-service-list]');
    if (!list) return;
    list.innerHTML = SERVICES.map((s) => `
      <div class="select-service-row${state.services.has(s.id) ? ' picked' : ''}" data-service-id="${s.id}">
        <div>
          <div class="ssr-name">${s.name}</div>
          <div class="ssr-meta">${s.duration} min &middot; ${s.desc}</div>
        </div>
        <div style="display:flex;align-items:center;">
          <span class="ssr-price">$${s.price}</span>
          <span class="checkbox-circle">${state.services.has(s.id) ? checkIcon() : ''}</span>
        </div>
      </div>
    `).join('');
    list.querySelectorAll('[data-service-id]').forEach((row) => {
      row.addEventListener('click', () => {
        const id = row.dataset.serviceId;
        if (state.services.has(id)) state.services.delete(id); else state.services.add(id);
        renderServiceList();
        updateStickyTotal();
      });
    });
  }

  function renderBarberGrid() {
    const grid = document.querySelector('[data-barber-grid]');
    if (!grid) return;
    grid.innerHTML = BARBERS.map((b) => `
      <div class="barber-pick${state.barber === b.id ? ' picked' : ''}" data-barber-id="${b.id}">
        <img src="${b.img}" alt="${b.name}">
        <div>
          <div class="bp-name">${b.name}</div>
          <div class="bp-role">${b.role}</div>
        </div>
      </div>
    `).join('');
    grid.querySelectorAll('[data-barber-id]').forEach((card) => {
      card.addEventListener('click', () => {
        state.barber = card.dataset.barberId;
        renderBarberGrid();
      });
    });
  }

  function renderDateStrip() {
    const strip = document.querySelector('[data-date-strip]');
    if (!strip) return;
    const days = [];
    const today = new Date();
    for (let i = 0; i < 10; i++) {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      days.push(d);
    }
    if (!state.date) state.date = days[1].toDateString();
    strip.innerHTML = days.map((d) => {
      const key = d.toDateString();
      const dow = d.toLocaleDateString(undefined, { weekday: 'short' });
      return `<div class="date-pill${state.date === key ? ' picked' : ''}" data-date="${key}">
        <div class="dow">${dow}</div>
        <div class="dnum">${d.getDate()}</div>
      </div>`;
    }).join('');
    strip.querySelectorAll('[data-date]').forEach((pill) => {
      pill.addEventListener('click', () => {
        state.date = pill.dataset.date;
        renderDateStrip();
      });
    });
  }

  function renderTimeGrid() {
    const grid = document.querySelector('[data-time-grid]');
    if (!grid) return;
    const slots = ['09:00 AM', '09:45 AM', '10:30 AM', '11:15 AM', '12:00 PM', '01:00 PM', '02:00 PM', '02:45 PM', '03:30 PM', '04:15 PM', '05:00 PM', '05:45 PM'];
    const taken = new Set(['11:15 AM', '02:00 PM', '04:15 PM']);
    grid.innerHTML = slots.map((t) => `
      <div class="time-pill${state.time === t ? ' picked' : ''}${taken.has(t) ? ' disabled' : ''}" data-time="${t}">${t}</div>
    `).join('');
    grid.querySelectorAll('[data-time]:not(.disabled)').forEach((pill) => {
      pill.addEventListener('click', () => {
        state.time = pill.dataset.time;
        renderTimeGrid();
      });
    });
  }

  function selectedServices() { return SERVICES.filter((s) => state.services.has(s.id)); }
  function total() { return selectedServices().reduce((sum, s) => sum + s.price, 0); }
  function totalDuration() { return selectedServices().reduce((sum, s) => sum + s.duration, 0); }

  function updateStickyTotal() {
    const bar = document.querySelector('[data-sticky-total]');
    if (!bar) return;
    const show = state.step <= 3 && state.services.size > 0;
    bar.style.display = show ? 'flex' : 'none';
    bar.querySelector('[data-total-amount]').textContent = `$${total()}`;
    bar.querySelector('[data-total-count]').textContent = `${state.services.size} service${state.services.size === 1 ? '' : 's'} selected`;
  }

  function renderSummary() {
    const box = document.querySelector('[data-summary]');
    if (!box) return;
    const barber = BARBERS.find((b) => b.id === state.barber);
    const services = selectedServices();
    const code = 'FH-' + Math.random().toString(36).slice(2, 7).toUpperCase();
    box.innerHTML = `
      <div class="summary-row"><span>Services</span><strong>${services.map((s) => s.name).join(', ')}</strong></div>
      <div class="summary-row"><span>Barber</span><strong>${barber ? barber.name : ''}</strong></div>
      <div class="summary-row"><span>Date &amp; time</span><strong>${state.date}, ${state.time}</strong></div>
      <div class="summary-row"><span>Duration</span><strong>${totalDuration()} min</strong></div>
      <div class="summary-row total"><span>Total due at shop</span><strong>$${total()}</strong></div>
    `;
    const codeEl = document.querySelector('[data-confirm-code]');
    if (codeEl) codeEl.textContent = code;
    const nameEl = document.querySelector('[data-confirm-name]');
    if (nameEl) nameEl.textContent = state.name.split(' ')[0] || 'there';
  }

  function checkIcon() {
    return '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 6L9 17l-5-5" stroke="white" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }
}
