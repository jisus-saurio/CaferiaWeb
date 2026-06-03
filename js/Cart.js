// ── STATE ──────────────────────────────────────────────────────────
const SHIPPING = 3.50;
let cart = [
  {
    id:1, name:'Frappe de Moca',
    spec:'leche: entera / toppings: oreo / extra: chantilly',
    price:11.00, qty:2,
    img:'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=200&q=80'
  },
  {
    id:2, name:'Café Helado',
    spec:'leche: deslactosada / toppings: caramelo / extra: shot',
    price:17.55, qty:1,
    img:'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=200&q=80'
  }
];
let currentScreen = 1;
let activePayTab = 'card';

// ── TOOLTIP VALIDATION ─────────────────────────────────────────────
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
  const existing = el.parentNode.querySelector('.validation-tooltip');
  if (existing) existing.remove();
}

function clearAllTooltips() {
  document.querySelectorAll('.validation-tooltip').forEach(t => t.remove());
  document.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));
}

// ── RENDER CART ────────────────────────────────────────────────────
function renderCart() {
  const box = document.getElementById('cartItemsBox');
  if (!cart.length) {
    box.innerHTML = `<div class="empty-cart"><div class="empty-cart-icon">🛒</div><p class="empty-cart-msg">Tu carrito está vacío.</p></div>`;
    updateTotals();
    return;
  }
  box.innerHTML = `
    <div style="display:grid;grid-template-columns:80px 1fr 100px 130px 100px 110px;gap:12px;
      padding:12px 24px;border-bottom:1px solid var(--beige);font-size:11px;font-weight:600;
      text-transform:uppercase;letter-spacing:.06em;color:var(--muted);">
      <div></div><div>Producto</div><div>Precio</div>
      <div>Cantidad</div><div>Subtotal</div><div></div>
    </div>
    ${cart.map(item => `
      <div class="cart-item">
        <img class="cart-item-img" src="${item.img}" alt="${item.name}"
          onerror="this.src='https://placehold.co/72x72/e8d5bc/7c4f2f?text=☕'">
        <div>
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-spec">${item.spec}</div>
        </div>
        <div>
          <div class="cart-col-label">Precio</div>
          <div class="price-val">$${item.price.toFixed(2)}</div>
        </div>
        <div>
          <div class="cart-col-label">Cantidad</div>
          <div class="qty-ctrl">
            <button class="qty-btn" onclick="changeQty(${item.id}, -1)">−</button>
            <span class="qty-num">${item.qty}</span>
            <button class="qty-btn" onclick="changeQty(${item.id}, +1)">+</button>
          </div>
        </div>
        <div>
          <div class="cart-col-label">Subtotal</div>
          <div class="price-val">$${(item.price * item.qty).toFixed(2)}</div>
        </div>
        <button class="btn-remove" title="Eliminar" onclick="removeItem(${item.id})">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"></path>
            <path d="M10 11v6"></path><path d="M14 11v6"></path>
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"></path>
          </svg>
          Eliminar
        </button>
      </div>
    `).join('')}
  `;
  updateTotals();
}

function updateTotals() {
  const sub = cart.reduce((a, i) => a + i.price * i.qty, 0);
  const total = sub + (cart.length ? SHIPPING : 0);
  document.getElementById('s1-subtotal').textContent = `$${sub.toFixed(2)}`;
  document.getElementById('s1-total').textContent    = `$${total.toFixed(2)}`;
}

function changeQty(id, delta) {
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.qty = Math.max(1, item.qty + delta);
  renderCart();
  if (currentScreen >= 2) renderSummary();
}

function removeItem(id) {
  cart = cart.filter(i => i.id !== id);
  renderCart();
  if (currentScreen >= 2) renderSummary();
}

// ── SUMMARY SIDEBAR ────────────────────────────────────────────────
function renderSummary() {
  const sub   = cart.reduce((a, i) => a + i.price * i.qty, 0);
  const total = sub + SHIPPING;
  const html  = `
    <div class="summary-title">En tu carrito</div>
    ${cart.map(item => `
      <div class="summary-item">
        <img class="summary-img" src="${item.img}" alt="${item.name}"
          onerror="this.src='https://placehold.co/50x50/e8d5bc/7c4f2f?text='">
        <div class="summary-item-info">
          <div class="summary-item-name">${item.name}</div>
          <div class="summary-item-spec">${item.spec}</div>
          <div class="summary-item-qty">${item.qty}x</div>
        </div>
        <div class="summary-item-price">$${(item.price*item.qty).toFixed(2)}</div>
      </div>
    `).join('')}
    <div class="summary-totals">
      <div class="summary-row"><span>Subtotal</span><span class="orange">$${sub.toFixed(2)}</span></div>
      <div class="summary-row"><span>Envío</span><span class="orange">$${SHIPPING.toFixed(2)}</span></div>
      <div class="summary-row total"><span>TOTAL</span><span class="orange">$${total.toFixed(2)}</span></div>
    </div>
  `;
  ['summaryS2','summaryS3'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.innerHTML = html;
  });
}

// ── NAVIGATION ────────────────────────────────────────────────────
function goScreen(n) {
  document.getElementById(`screen${currentScreen}`).classList.remove('active');
  document.getElementById(`screen${n}`).classList.add('active');
  currentScreen = n;
  updateStepper(n);
  if (n === 2 || n === 3) renderSummary();
  clearAllTooltips();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateStepper(n) {
  document.getElementById('stepper').style.display = n === 4 ? 'none' : 'flex';
  [1,2,3].forEach(i => {
    const el = document.getElementById(`st${i}`);
    el.classList.remove('active','done');
    if (i === n) el.classList.add('active');
    else if (i < n) el.classList.add('done');
  });
  ['line12','line23'].forEach((id, idx) => {
    document.getElementById(id).classList.toggle('done', n > idx + 1);
  });
}

function goBack() {
  window.history.back();
}

// ── SHIPPING VALIDATION ───────────────────────────────────────────
function validateShipping() {
  clearAllTooltips();
  let firstError = null;
  let ok = true;

  const requiredFields = [
    { id: 'dpto',      msg: 'Selecciona un departamento' },
    { id: 'municipio', msg: 'Ingresa el municipio' },
    { id: 'direccion', msg: 'Ingresa la dirección de entrega' },
    { id: 'nombre',    msg: 'Ingresa tu nombre' },
    { id: 'apellidos', msg: 'Ingresa tus apellidos' },
  ];

  requiredFields.forEach(({ id, msg }) => {
    const el = document.getElementById(id);
    if (!el.value.trim()) {
      showTooltip(el, msg);
      if (!firstError) firstError = el;
      ok = false;
    } else {
      clearTooltip(el);
    }
  });

  // Phone: required + digits only + exactly 8 digits
  const tel = document.getElementById('telefono');
  const telVal = tel.value.trim();
  if (!telVal) {
    showTooltip(tel, 'Ingresa tu teléfono de contacto');
    if (!firstError) firstError = tel;
    ok = false;
  } else if (!/^\d+$/.test(telVal)) {
    showTooltip(tel, 'Solo se permiten números');
    if (!firstError) firstError = tel;
    ok = false;
  } else if (telVal.length !== 8) {
    showTooltip(tel, 'El teléfono debe tener 8 dígitos');
    if (!firstError) firstError = tel;
    ok = false;
  } else {
    clearTooltip(tel);
  }

  if (!ok) {
    if (firstError) firstError.focus();
    return;
  }
  goScreen(3);
}

// ── PHONE INPUT: only allow digits ───────────────────────────────
function setupPhoneInput() {
  const tel = document.getElementById('telefono');
  if (!tel) return;
  tel.addEventListener('input', function() {
    const pos = this.selectionStart;
    const clean = this.value.replace(/\D/g, '').substring(0, 8);
    this.value = clean;
    clearTooltip(this);
  });
  tel.addEventListener('keypress', function(e) {
    if (!/\d/.test(e.key)) e.preventDefault();
  });
}

// ── PAYMENT ───────────────────────────────────────────────────────
function setPayTab(tab) {
  activePayTab = tab;
  document.getElementById('tabCard').classList.toggle('active', tab === 'card');
  document.getElementById('tabCash').classList.toggle('active', tab === 'cash');
  document.getElementById('panelCard').classList.toggle('active', tab === 'card');
  document.getElementById('panelCash').classList.toggle('active', tab === 'cash');
}

function formatCC(input) {
  let v = input.value.replace(/\D/g,'').substring(0,16);
  input.value = v.replace(/(.{4})/g,'$1 ').trim();
  const raw = v.replace(/\D/g,'');
  document.getElementById('ccDisplay').textContent =
    raw.length >= 4 ? `**** **** **** ${raw.slice(-4)}` : '**** **** **** ****';
}

function formatExp(input) {
  let v = input.value.replace(/\D/g,'');
  if (v.length >= 3) v = v.slice(0,2) + '/' + v.slice(2,4);
  input.value = v;
  document.getElementById('ccExpDisplay').textContent = input.value || 'MM/AA';
}

// Card holder name: no numbers allowed
function setupCardNameInput() {
  const ccName = document.getElementById('ccName');
  if (!ccName) return;
  ccName.addEventListener('input', function() {
    const clean = this.value.replace(/[0-9]/g, '');
    if (this.value !== clean) {
      const pos = this.selectionStart - (this.value.length - clean.length);
      this.value = clean;
      this.setSelectionRange(pos, pos);
    }
    document.getElementById('ccNameDisplay').textContent = this.value || 'Titular';
    clearTooltip(this);
  });
  ccName.addEventListener('keypress', function(e) {
    if (/[0-9]/.test(e.key)) e.preventDefault();
  });
}

function finalizarCompra() {
  clearAllTooltips();
  if (activePayTab === 'card') {
    let ok = true;
    let firstError = null;

    const cardFields = [
      { id: 'ccName', msg: 'Ingresa el nombre del titular' },
      { id: 'ccNum',  msg: 'Ingresa el número de tarjeta' },
      { id: 'ccExp',  msg: 'Ingresa la fecha de vencimiento' },
      { id: 'ccCvv',  msg: 'Ingresa el CVV' },
    ];

    cardFields.forEach(({ id, msg }) => {
      const el = document.getElementById(id);
      if (!el.value.trim()) {
        showTooltip(el, msg);
        if (!firstError) firstError = el;
        ok = false;
      } else {
        clearTooltip(el);
      }
    });

    // Extra: card name must have no numbers (redundant but safety net)
    const ccName = document.getElementById('ccName');
    if (ccName.value.trim() && /[0-9]/.test(ccName.value)) {
      showTooltip(ccName, 'El nombre no puede contener números');
      if (!firstError) firstError = ccName;
      ok = false;
    }

    if (!ok) {
      if (firstError) firstError.focus();
      return;
    }
  }
  const num = '#CL-' + Math.floor(100000 + Math.random()*900000);
  document.getElementById('orderNum').textContent = num;
  goScreen(4);
}

function resetCart() {
  cart = [];
  currentScreen = 1;
  goScreen(1);
  document.getElementById('stepper').style.display = 'flex';
}

// ── INIT ──────────────────────────────────────────────────────────
renderCart();
// Setup inputs after DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  setupPhoneInput();
  setupCardNameInput();
});
// Also try immediately (if script runs after DOM)
setupPhoneInput();
setupCardNameInput();