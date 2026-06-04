// ── STATE ──────────────────────────────────────────────────────────
let personCount = 2;
let activeTab = 'reserva';

// ── TABS ───────────────────────────────────────────────────────────
function switchTab(tab) {
  activeTab = tab;
  clearAllTooltips();

  document.querySelectorAll('.tab').forEach(el => {
    el.classList.remove('active');
    el.setAttribute('aria-selected', 'false');
  });
  document.querySelectorAll('.tab-panel').forEach(el => el.classList.remove('active'));

  document.getElementById(`tab-${tab}`).classList.add('active');
  document.getElementById(`tab-${tab}`).setAttribute('aria-selected', 'true');
  document.getElementById(`panel-${tab}`).classList.add('active');
}

// ── PERSON COUNTER ──────────────────────────────────────────────────
function changeCount(delta) {
  personCount = Math.max(1, Math.min(20, personCount + delta));
  document.getElementById('counterVal').textContent = personCount;
  document.getElementById('r-personas').value = personCount;
}

// ── PHONE: DIGITS ONLY, MAX 8 ────────────────────────────────────────
(function setupPhone() {
  const tel = document.getElementById('r-telefono');
  if (!tel) return;
  tel.addEventListener('input', function () {
    this.value = this.value.replace(/\D/g, '').substring(0, 8);
    clearTooltip(this);
  });
  tel.addEventListener('keypress', function (e) {
    if (!/\d/.test(e.key)) e.preventDefault();
  });
})();

// ── DATE: MIN = TODAY ─────────────────────────────────────────────────
(function setupDate() {
  const dateInput = document.getElementById('r-fecha');
  if (!dateInput) return;
  const today = new Date().toISOString().split('T')[0];
  dateInput.min = today;
})();

// ── VALIDATION TOOLTIPS ────────────────────────────────────────────────
function showTooltip(el, msg) {
  clearTooltip(el);
  el.classList.add('field-error');
  const tip = document.createElement('div');
  tip.className = 'validation-tooltip';
  tip.innerHTML = `<span class="tooltip-icon">!</span>${msg}`;
  el.parentNode.appendChild(tip);
}

function clearTooltip(el) {
  el.classList.remove('field-error');
  const tip = el.parentNode && el.parentNode.querySelector('.validation-tooltip');
  if (tip) tip.remove();
}

function clearAllTooltips() {
  document.querySelectorAll('.validation-tooltip').forEach(t => t.remove());
  document.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));
}

// ── VALIDATE RESERVA ──────────────────────────────────────────────────
function validateReserva() {
  const fields = [
    { id: 'r-nombre',    msg: 'Ingresa tu nombre' },
    { id: 'r-apellidos', msg: 'Ingresa tus apellidos' },
    { id: 'r-email',     msg: 'Ingresa tu correo electrónico' },
    { id: 'r-fecha',     msg: 'Selecciona la fecha de tu reserva' },
    { id: 'r-hora',      msg: 'Selecciona un horario' },
  ];

  let ok = true;
  let firstError = null;

  fields.forEach(({ id, msg }) => {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      showTooltip(el, msg);
      if (!firstError) firstError = el;
      ok = false;
    } else {
      clearTooltip(el);
    }
  });

  // Email format
  const emailEl = document.getElementById('r-email');
  if (emailEl.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
    showTooltip(emailEl, 'Ingresa un correo válido');
    if (!firstError) firstError = emailEl;
    ok = false;
  }

  // Phone
  const tel = document.getElementById('r-telefono');
  const telVal = tel.value.trim();
  if (!telVal) {
    showTooltip(tel, 'Ingresa tu teléfono');
    if (!firstError) firstError = tel;
    ok = false;
  } else if (telVal.length !== 8) {
    showTooltip(tel, 'El teléfono debe tener 8 dígitos');
    if (!firstError) firstError = tel;
    ok = false;
  } else {
    clearTooltip(tel);
  }

  if (firstError) firstError.focus();
  return ok;
}

// ── VALIDATE MENSAJE ──────────────────────────────────────────────────
function validateMensaje() {
  const fields = [
    { id: 'm-nombre',  msg: 'Ingresa tu nombre' },
    { id: 'm-email',   msg: 'Ingresa tu correo electrónico' },
    { id: 'm-asunto',  msg: 'Selecciona el asunto' },
    { id: 'm-mensaje', msg: 'Escribe tu mensaje' },
  ];

  let ok = true;
  let firstError = null;

  fields.forEach(({ id, msg }) => {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      showTooltip(el, msg);
      if (!firstError) firstError = el;
      ok = false;
    } else {
      clearTooltip(el);
    }
  });

  // Email format
  const emailEl = document.getElementById('m-email');
  if (emailEl.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
    showTooltip(emailEl, 'Ingresa un correo válido');
    if (!firstError) firstError = emailEl;
    ok = false;
  }

  if (firstError) firstError.focus();
  return ok;
}

// ── FORM SUBMIT ────────────────────────────────────────────────────────
document.getElementById('contactForm').addEventListener('submit', function (e) {
  e.preventDefault();
  clearAllTooltips();

  const valid = activeTab === 'reserva' ? validateReserva() : validateMensaje();
  if (!valid) return;

  // Simulate async send
  const btn = document.getElementById('btnSubmit');
  const btnText = document.getElementById('btnText');
  const btnIcon = document.getElementById('btnIcon');

  btn.classList.add('loading');
  btnText.textContent = 'Enviando…';
  btnIcon.textContent = '⏳';

  setTimeout(() => {
    document.getElementById('contactForm').style.display = 'none';
    document.getElementById('successMsg').style.display = 'block';
  }, 1400);
});

// ── RESET FORM ─────────────────────────────────────────────────────────
function resetForm() {
  document.getElementById('contactForm').reset();
  document.getElementById('contactForm').style.display = 'block';
  document.getElementById('successMsg').style.display = 'none';

  const btn = document.getElementById('btnSubmit');
  const btnText = document.getElementById('btnText');
  const btnIcon = document.getElementById('btnIcon');
  btn.classList.remove('loading');
  btnText.textContent = 'Enviar';
  btnIcon.textContent = '→';

  personCount = 2;
  document.getElementById('counterVal').textContent = '2';
  document.getElementById('r-personas').value = '2';

  clearAllTooltips();
  switchTab('reserva');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── CLEAR TOOLTIP ON CHANGE ────────────────────────────────────────────
document.querySelectorAll('input, select, textarea').forEach(el => {
  el.addEventListener('input', () => clearTooltip(el));
  el.addEventListener('change', () => clearTooltip(el));
});