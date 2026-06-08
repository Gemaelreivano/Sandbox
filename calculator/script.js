// Simple calculator logic
(() => {
  const displayEl = document.getElementById('display');
  let value = '0';          // shown value / current entry
  let expression = '';      // full expression string to evaluate
  let lastWasOperator = false;
  let justEvaluated = false;

  function updateDisplay() {
    if (!displayEl) return;
    displayEl.textContent = value;
  }

  function inputNumber(n) {
    if (justEvaluated) {
      // start new expression after result if a number is pressed
      expression = '';
      value = '0';
      justEvaluated = false;
    }
    if (n === '.' && value.includes('.')) return;
    // allow building negative numbers when value is '-'
    if (value === '0' && n !== '.') value = n;
    else if (value === '-' && n !== '.') value = value + n;
    else value = value + n;
    lastWasOperator = false;
    updateDisplay();
  }

  function inputOperator(op) {
    // allow starting negative number when no expression yet and user presses '-'
    if (expression === '' && value === '0' && op === '-') {
      value = '-';
      lastWasOperator = false;
      updateDisplay();
      return;
    }

    if (lastWasOperator) {
      // replace the last operator
      expression = expression.slice(0, -1) + op;
    } else {
      expression += value + op;
      // keep the displayed value until user starts typing next number
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
      // clear the result
      value = '0';
      justEvaluated = false;
      updateDisplay();
      return;
    }

    if (lastWasOperator) {
      // remove trailing operator and try to restore previous operand
      if (expression.length > 0) {
        expression = expression.slice(0, -1);
        // Extract last operand from expression
        // Note: this is a simple approach and may not handle all negative-number edge cases
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
    // apply percent to current value
    const num = parseFloat(value);
    if (!isNaN(num)) {
      value = String(num / 100);
      updateDisplay();
    }
  }

  function evaluateExpression() {
    // Build final expression
    const finalExpr = expression + value;
    if (!finalExpr) return;
    // Replace × and ÷ if present (UI uses symbols but data-action uses * and / already)
    const safeExpr = finalExpr.replace(/×/g, '*').replace(/÷/g, '/').replace(/−/g, '-');

    try {
      // Use Function constructor instead of eval for slightly safer evaluation
      // This is still only for a local calculator UI and not for untrusted input execution in production.
      const raw = Function('"use strict"; return (' + safeExpr + ')')();
      if (!Number.isFinite(raw) || isNaN(raw)) {
        value = 'Error';
      } else {
        // round to reasonable precision (12 decimal places)
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

  // Click handling
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
        else if (action === 'percent') percent();
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
