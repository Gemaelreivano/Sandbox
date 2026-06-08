// Simple calculator logic with effects
(() => {
  const displayEl = document.getElementById('display');
  let value = '0';          // shown value / current entry
  let expression = '';      // full expression string to evaluate
  let lastWasOperator = false;
  let justEvaluated = false;

  // Fungsi updateDisplay diperbarui agar mendukung efek animasi angka & guncangan
  function updateDisplay() {
    if (!displayEl) return;
    displayEl.textContent = value;

    // Picu animasi pop setiap kali angka berubah
    displayEl.classList.remove('pop-display');
    void displayEl.offsetWidth; // Trik memicu ulang animasi CSS (reflow)
    displayEl.classList.add('pop-display');

    // Jika hasilnya Error, jalankan efek guncangan (shake) pada kalkulator
    if (value === 'Error') {
      const calcContainer = document.querySelector('.calculator');
      calcContainer.classList.add('shake');
      setTimeout(() => calcContainer.classList.remove('shake'), 400);
    }
  }

  function inputNumber(n) {
    if (justEvaluated) {
      expression = '';
      value = '0';
      justEvaluated = false;
    }
    if (n === '.' && value.includes('.')) return;
    if (value === '0' && n !== '.') value = n;
    else if (value === '-' && n !== '.') value = value + n;
    else value = value + n;
    lastWasOperator = false;
    updateDisplay();
  }

  function inputOperator(op) {
    if (expression === '' && value === '0' && op === '-') {
      value = '-';
      lastWasOperator = false;
      updateDisplay();
      return;
    }

    if (lastWasOperator) {
      expression = expression.slice(0, -1) + op;
    } else {
      expression += value + op;
      value = '0';
    }
    lastWasOperator = true;
    justEvaluated = false;
    updateDisplay();
  }

  function clearAll() {
    value = '0';
    expression = '';
    lastWasOperator = false;
    justEvaluated = false;
    updateDisplay();
  }

  function backspace() {
    if (justEvaluated) {
      value = '0';
      justEvaluated = false;
      updateDisplay();
      return;
    }

    if (lastWasOperator) {
      if (expression.length > 0) {
        expression = expression.slice(0, -1);
        const parts = expression.split(/[\+\-\*\/]/).filter(Boolean);
        const last = parts.length ? parts[parts.length - 1] : '0';
        value = last;
      } else {
        value = '0';
      }
      lastWasOperator = false;
    } else {
      if (value.length <= 1) value = '0';
      else value = value.slice(0, -1);
    }
    updateDisplay();
  }

  function percent() {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      value = String(num / 100);
      updateDisplay();
    }
  }

  function evaluateExpression() {
    const finalExpr = expression + value;
    if (!finalExpr) return;
    const safeExpr = finalExpr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');

    try {
      const raw = Function('"use strict"; return (' + safeExpr + ')')();
      if (!Number.isFinite(raw) || isNaN(raw)) {
        value = 'Error';
      } else {
        const rounded = Math.round((raw + Number.EPSILON) * 1e12) / 1e12;
        value = String(rounded);
      }
      expression = '';
      justEvaluated = true;
      lastWasOperator = false;
      updateDisplay();
    } catch (e) {
      value = 'Error';
      expression = '';
      justEvaluated = true;
      updateDisplay();
    }
  }

  // Click handling diperbarui untuk memicu Ripple Effect (Riak Air)
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      // --- LOGIKA RIPPLE EFFECT ---
      const circle = document.createElement('span');
      const diameter = Math.max(btn.clientWidth, btn.clientHeight);
      const radius = diameter / 2;

      const rect = btn.getBoundingClientRect();
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;
      circle.classList.add('ripple');

      const ripple = btn.querySelector('.ripple');
      if (ripple) ripple.remove();
      btn.appendChild(circle);
      // ----------------------------

      const n = btn.dataset.number;
      const action = btn.dataset.action;

      if (n !== undefined) {
        inputNumber(n);
        return;
      }
      if (action) {
        if (action === 'clear') clearAll();
        else if (action === 'back') backspace();
        else if (action === '%') percent();
        else if (action === '=') evaluateExpression();
        else if (['+','-','*','/'].includes(action)) inputOperator(action);
      }
    });
  });

  // Keyboard support
  window.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
      inputNumber(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
      e.preventDefault();
      evaluateExpression();
    } else if (e.key === 'Backspace') {
      backspace();
    } else if (e.key === 'Escape') {
      clearAll();
    } else if (['+','-','*','/'].includes(e.key)) {
      inputOperator(e.key);
    } else if (e.key === '%') {
      percent();
    }
  });

  // init
  updateDisplay();
})();
