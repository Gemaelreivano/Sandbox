// Logika kalkulator sederhana
(() => {
  // Hubungkan ke elemen display yang baru
  const displayExprEl = document.getElementById('display-expression');
  const displayValueEl = document.getElementById('display-value');

  let value = '0';          // nilai yang ditampilkan / entri saat ini
  let expression = '';      // string ekspresi lengkap untuk dievaluasi
  let lastWasOperator = false;
  let justEvaluated = false;

  // Fungsi updateDisplay diperbarui untuk dua baris teks
  function updateDisplay() {
    if (!displayExprEl || !displayValueEl) return;

    // Perbarui teks perhitungan di baris atas
    displayExprEl.textContent = expression;
    // Perbarui teks hasil di baris bawah
    displayValueEl.textContent = value;
  }

  function inputNumber(n) {
    if (justEvaluated) {
      // mulai ekspresi baru setelah hasil jika angka ditekan
      expression = '';
      value = '0';
      justEvaluated = false;
    }
    if (n === '.' && value.includes('.')) return;
    // izinkan membangun angka negatif saat nilai adalah '-'
    if (value === '0' && n !== '.') {
      if (n === '00') return; // abaikan '00' jika nilai awal '0'
      value = n;
    } else if (value === '-' && n !== '.') {
      if (n === '00') n = '0'; // perlakukan '00' sebagai '0' setelah '-'
      value = value + n;
    } else {
      value = value + n;
    }
    lastWasOperator = false;
    updateDisplay();
  }

  function inputOperator(op) {
    // izinkan memulai angka negatif ketika belum ada ekspresi dan pengguna menekan '-'
    if (expression === '' && value === '0' && op === '-') {
      value = '-';
      lastWasOperator = false;
      updateDisplay();
      return;
    }

    if (lastWasOperator) {
      // ganti operator terakhir
      expression = expression.slice(0, -1) + op;
    } else {
      expression += value + op;
      // simpan nilai yang ditampilkan sampai pengguna mulai mengetik angka berikutnya
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
      // bersihkan hasil
      value = '0';
      justEvaluated = false;
      updateDisplay();
      return;
    }

    if (lastWasOperator) {
      // hapus operator di akhir dan coba pulihkan operand sebelumnya
      if (expression.length > 0) {
        expression = expression.slice(0, -1);
        // Ekstrak operand terakhir dari ekspresi
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
    // terapkan persen ke nilai saat ini
    const num = parseFloat(value);
    if (!isNaN(num)) {
      value = String(num / 100);
      updateDisplay();
    }
  }

  function evaluateExpression() {
    // Bangun ekspresi final
    const finalExpr = expression + value;
    if (!finalExpr) return;
    // Ganti simbol ×, ÷, dan − dengan operator yang valid
    const safeExpr = finalExpr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');

    try {
      // Gunakan konstruktor Function daripada eval untuk evaluasi yang sedikit lebih aman
      const raw = Function('"use strict"; return (' + safeExpr + ')')();
      if (!Number.isFinite(raw) || isNaN(raw)) {
        value = 'Error';
      } else {
        // bulatkan ke presisi yang masuk akal (12 tempat desimal)
        const rounded = Math.round((raw + Number.EPSILON) * 1e12) / 1e12;
        value = String(rounded);
      }
      expression = ''; // bersihkan ekspresi setelah evaluasi
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

  // Penanganan klik
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => {
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

  // Dukungan keyboard
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

  // inisialisasi
  updateDisplay();
})();
