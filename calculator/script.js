:root {
  --bg-dark: #2a2d32; /* Latar belakang utama */
  --display-text-expression: #9e9e9e; /* Warna teks perhitungan */
  --display-text-value: #f5f5f5; /* Warna teks hasil/angka */
  --btn-text-num: #f5f5f5; /* Warna angka pada tombol */
  --btn-text-action: #4db6ac; /* Warna simbol operator/fungsi */
  --btn-border: #3c4045; /* Warna garis pembatas */
  --accent-red: #ff5252; /* Warna tombol sama dengan */
}

* { box-sizing: border-box; }
html, body { height: 100%; margin: 0; }

body {
  font-family: 'Inter', Roboto, Arial, sans-serif; /* Menggunakan font modern */
  background-color: var(--bg-dark);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  color: var(--display-text-value);
}

.calculator {
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
}

/* Display diperbarui untuk dua baris teks */
.display {
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  text-align: right;
  min-height: 150px;
}

.display-expression {
  color: var(--display-text-expression);
  font-size: 24px;
  font-weight: 300;
  margin-bottom: 10px;
  overflow: hidden;
  word-break: break-all;
}

.display-value {
  color: var(--display-text-value);
  font-size: 64px;
  font-weight: 300;
  overflow: hidden;
  word-break: break-all;
}

/* Container tombol */
.buttons {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--btn-border);
  border-left: 1px solid var(--btn-border);
}

.btn {
  height: 90px;
  background: transparent;
  border: 0;
  border-right: 1px solid var(--btn-border);
  border-bottom: 1px solid var(--btn-border);
  font-size: 28px;
  font-weight: 300;
  color: var(--btn-text-num);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Menyamakan tinggi tombol baris terakhir agar tetap 90px */
.buttons > :nth-last-child(-n+3) {
  height: 90px;
}

/* Gaya teks khusus untuk simbol */
.btn.operator,
.btn.function {
  color: var(--btn-text-action);
}

/* Gaya khusus untuk tombol AC */
.btn.ac-btn {
  color: var(--btn-text-num);
}

/* Gaya khusus untuk tombol sama dengan */
.btn.equals {
  background-color: var(--accent-red);
  color: #fff;
  border-color: var(--accent-red);
  grid-column: 3 / 5; /* Menggabungkan dua kolom terakhir */
}

/* Media query diperbarui agar display-value tidak terlalu besar di layar kecil */
@media (max-width: 360px) {
  .display-value { font-size: 48px; }
  .btn { height: 75px; font-size: 24px; }
  .buttons > :nth-last-child(-n+3) { height: 75px; }
}
