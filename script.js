/* ---------- Logos ---------- */
const logos = {
  '3': { src: './src/img/american-express.png', alt: 'Amex logo' },
  '4': { src: './src/img/visa.png',             alt: 'Visa logo' },
  '5': { src: './src/img/mastercard.png',       alt: 'Mastercard logo' },
  '6': { src: './src/img/discover.png',         alt: 'Discover logo' }
};

/* ---------- Prefijos válidos ---------- */
const PREFIXES = ['3', '4', '5', '6'];                  // ← ahora incluye 6
const randomPrefix = () => PREFIXES[Math.floor(Math.random() * PREFIXES.length)];

/* ---------- Luhn ---------- */
function luhnChecksum(numStr) {
  let sum = 0, doubleDigit = false;
  for (let i = numStr.length - 1; i >= 0; i--) {
    let n = +numStr[i];
    if (doubleDigit) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    doubleDigit = !doubleDigit;
  }
  return sum % 10;
}
const isValidLuhn = (n) => luhnChecksum(n) === 0;

function generateLuhn(prefix = '', length = 16) {
  let num = prefix;
  while (num.length < length - 1) num += Math.floor(Math.random() * 10);
  for (let d = 0; d < 10; d++) if (isValidLuhn(num + d)) return num + d;
  throw new Error('No valid checksum found');
}

/* ---------- Render ---------- */
function renderNumber(cardEl, numStr) {
  const numberDiv = cardEl.querySelector('.card__number');
  numberDiv.innerHTML = '';
  (numStr.match(/.{1,4}/g) || []).forEach(g => {
    const span = document.createElement('span');
    span.textContent = g;
    numberDiv.appendChild(span);
  });
  const logo = logos[numStr[0]];
  if (logo) {
    const img = cardEl.querySelector('.card__logo');
    img.src = logo.src; img.alt = logo.alt;
  }
}

/* ---------- Entrada manual ---------- */
function promptManualNumber(cardEl) {
  const len    = parseInt(cardEl.dataset.length, 10) || 16;
  const prefix = cardEl.dataset.prefix || '';
  let num = prompt(`Introduce un número de ${len} dígitos${prefix ? ` que comience con ${prefix}` : ''}:`);
  if (!num) return;
  num = num.replace(/\s+/g, '');
  if (!/^\d+$/.test(num) || num.length !== len ||
      (prefix && !num.startsWith(prefix)) || !isValidLuhn(num)) {
    alert('Número inválido.'); return;
  }
  renderNumber(cardEl, num);
}

/* ---------- Lógica por tarjeta ---------- */
function attachCardLogic(cardEl) {
  const length = parseInt(cardEl.dataset.length, 10) || 16;
  renderNumber(cardEl, generateLuhn(randomPrefix(), length));
  cardEl.addEventListener('dblclick', () => promptManualNumber(cardEl));
}

/* ---------- DOM Ready ---------- */
window.addEventListener('DOMContentLoaded', () => {
  const cards      = document.querySelectorAll('.card');
  const btnGenerar = document.getElementById('btnGenerar');
  const lenSelect  = document.getElementById('lenSelect');

  const initLen = parseInt(lenSelect.value, 10);
  cards.forEach(card => attachCardLogic(card));

  btnGenerar.addEventListener('click', () => {
    const len = parseInt(lenSelect.value, 10);
    cards.forEach(card => {
      renderNumber(card, generateLuhn(randomPrefix(), len));
      card.dataset.length = len;     // para validación en doble clic
    });
  });
});
