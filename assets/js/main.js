// ── NAV scroll shadow
window.addEventListener('scroll', () => {
  document.getElementById('main-nav').classList.toggle('scrolled', window.scrollY > 10);
});

// ── Dynamic seat counter
// Starts at 47 on March 25 at 9:00 AM CST, drops ~1 place every 8 hours, floor at 3
function getDynamicCount() {
  const BASE_COUNT = 47;
  const BASE_DATE = new Date('2026-03-25T15:00:00Z'); // March 25 9:00 AM CST (UTC-6)
  const HOURS_PER_SEAT = 8;
  const MIN_COUNT = 3;
  const hoursElapsed = Math.max(0, (Date.now() - BASE_DATE.getTime()) / 3600000);
  return Math.max(MIN_COUNT, Math.round(BASE_COUNT - hoursElapsed / HOURS_PER_SEAT));
}

function updateCounts() {
  const count = getDynamicCount();
  document.querySelectorAll('.lugares-count').forEach(el => { el.textContent = count; });
}

// ── Scroll to form
function scrollToForm() {
  document.getElementById('registro-form').scrollIntoView({ behavior: 'smooth' });
}

// ── Level pills
const niveles = ['Preescolar', 'Primaria Baja', 'Primaria Alta', 'Secundaria', 'Bachillerato'];
const selectedH = new Set();
const selectedR = new Set();

function buildPills(containerId, selectedSet) {
  const wrap = document.getElementById(containerId);
  wrap.innerHTML = '';
  niveles.forEach(n => {
    const pill = document.createElement('button');
    pill.type = 'button';
    pill.className = 'pill' + (selectedSet.has(n) ? ' checked' : '');
    const checkIcon = selectedSet.has(n)
      ? '<svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M1 6l4 4 6-6" stroke="#00659D" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
      : '';
    pill.innerHTML = checkIcon + n;
    pill.onclick = () => {
      if (selectedSet.has(n)) selectedSet.delete(n);
      else selectedSet.add(n);
      buildPills(containerId, selectedSet);
    };
    wrap.appendChild(pill);
  });
}

// ── Checkboxes
const cbState = {};
function toggleCb(id) {
  cbState[id] = !cbState[id];
  const box = document.getElementById(id + '-box');
  box.classList.toggle('checked', !!cbState[id]);
  box.innerHTML = cbState[id]
    ? '<svg width="10" height="10" viewBox="0 0 12 12" fill="none"><path d="M1 6l4 4 6-6" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'
    : '';
}

// ── Form validation & submit
function submitForm(e, prefix) {
  e.preventDefault();
  const p = prefix === 'hero' ? 'h' : 'r';
  const selected = prefix === 'hero' ? selectedH : selectedR;
  let valid = true;

  const setErr = (id, msg) => {
    const el = document.getElementById(p + '-' + id + '-err');
    if (el) { el.textContent = msg; }
    if (msg) valid = false;
  };

  const nombre   = document.getElementById(p + '-nombre').value.trim();
  const email    = document.getElementById(p + '-email').value.trim();
  const tel      = document.getElementById(p + '-tel').value.replace(/\s/g, '');
  const enterado = document.getElementById(p + '-enterado').value;
  const privacy  = cbState[p + '-privacy'];

  setErr('nombre',   nombre ? '' : 'Ingresa tu nombre');
  setErr('email',    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? '' : 'Correo inválido, ej: nombre@gmail.com');
  setErr('tel',      /^\d{10}$/.test(tel) ? '' : '10 dígitos, sin espacios');
  setErr('enterado', enterado ? '' : 'Selecciona cómo te enteraste');

  const nivelesErr = document.getElementById(p + '-niveles-err');
  if (nivelesErr) { nivelesErr.textContent = selected.size ? '' : 'Selecciona al menos un nivel'; }
  if (!selected.size) valid = false;

  const privErr = document.getElementById(p + '-privacy-err');
  if (privErr) { privErr.textContent = privacy ? '' : 'Debes aceptar el Aviso de Privacidad'; }
  if (!privacy) valid = false;

  if (!valid) return;

  const wrapId = prefix === 'hero' ? 'hero-form-wrap' : 'reg-form-wrap';
  document.getElementById(wrapId).innerHTML = `
    <div class="success-card">
      <div class="success-icon">
        <svg width="32" height="32" viewBox="0 0 36 36" fill="none">
          <circle cx="18" cy="18" r="18" fill="#8DBA38"/>
          <path d="M10 18.5l5.5 5.5 10.5-11" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>
      <h3 style="font-size:20px;font-weight:700;color:#111827;margin-bottom:8px">¡Tu lugar está reservado!</h3>
      <p style="font-size:14px;color:#6B7280;line-height:1.6;margin-bottom:16px">Revisa tu correo — te enviamos el link de Zoom en minutos.</p>
      <div style="background:#F7F8FA;border-radius:10px;padding:12px 16px;text-align:left">
        <p style="font-size:12px;font-weight:500;color:#374151;margin:4px 0">📅 Viernes 28 de marzo · 6:30 PM CDMX</p>
        <p style="font-size:12px;font-weight:500;color:#374151;margin:4px 0">💻 Plataforma Zoom · link en tu correo</p>
        <p style="font-size:12px;font-weight:500;color:#374151;margin:4px 0">🎓 Certificado descargable al finalizar</p>
      </div>
    </div>`;
}

// ── FAQ accordion
const faqs = [
  ['¿El masterclass es realmente gratis?', 'Sí, completamente gratis. No hay costos ocultos ni compromisos posteriores. Solo regístrate y asiste.'],
  ['¿Necesito ser papá de un alumno de Innova Schools?', 'No. El masterclass es abierto para cualquier papá o mamá interesado en mejorar la educación de sus hijos, sin importar en qué escuela estén actualmente.'],
  ['¿Qué pasa si no puedo conectarme en vivo?', 'Recibirás acceso a la grabación por 30 días. Puedes verlo cuando tengas tiempo. El certificado se emite al finalizar el video.'],
  ['¿Qué necesito para conectarme?', 'Solo una computadora, tablet o celular con internet. La sesión es en Zoom — no necesitas cuenta. El link llega a tu correo al registrarte.'],
  ['¿Habrá oportunidad de hacer preguntas?', 'Sí. El último módulo es un Q&A en vivo de 30 minutos donde puedes hacer preguntas directamente a la expositora.'],
  ['¿Cómo obtengo el certificado de participación?', 'Al finalizar el masterclass recibirás un email con tu certificado personalizado en PDF, listo para descargar.'],
];

const faqList = document.getElementById('faq-list');
faqs.forEach(([q, a], i) => {
  faqList.innerHTML += `
    <div class="faq-item" id="faq-${i}">
      <button class="faq-btn" onclick="toggleFaq(${i})">
        <span>${q}</span>
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 7.5l5 5 5-5" stroke="#C9CDD4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="faq-answer">
        <div class="faq-divider"></div>
        <p style="font-size:14px;color:#6B7280;line-height:1.7;margin:0">${a}</p>
      </div>
    </div>`;
});

let openFaq = null;
function toggleFaq(i) {
  if (openFaq !== null) document.getElementById('faq-' + openFaq).classList.remove('open');
  openFaq = openFaq === i ? null : i;
  if (openFaq !== null) document.getElementById('faq-' + openFaq).classList.add('open');
}

// ── Init on load
document.addEventListener('DOMContentLoaded', () => {
  buildPills('h-pills', selectedH);
  buildPills('r-pills', selectedR);
  updateCounts();
});
