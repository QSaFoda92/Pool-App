document.addEventListener('DOMContentLoaded', ()=>{
  const pages = document.querySelectorAll('.page');
  const navButtons = document.querySelectorAll('nav button');
  const ph = document.getElementById('ph');
  const chlore = document.getElementById('chlore');
  const tac = document.getElementById('tac');
  const temperature = document.getElementById('temperature');
  const saveBtn = document.getElementById('save-btn');
  const analyseDiv = document.getElementById('analyse');
  const adviceDiv = document.getElementById('advice');
  const historyList = document.getElementById('history-list');

  function updateLabels() {
    document.getElementById('ph-val').textContent = ph.value;
    document.getElementById('chlore-val').textContent = chlore.value;
    document.getElementById('tac-val').textContent = tac.value;
    document.getElementById('temperature-val').textContent = temperature.value;
  }

  [ph, chlore, tac, temperature].forEach(el => {
    el.addEventListener('input', updateLabels);
  });
  updateLabels();

  function analyse(data) {
    let messages = [];
    if(data.ph < 7.2) messages.push('pH trop bas ⚠️');
    else if(data.ph > 7.6) messages.push('pH trop haut ⚠️');
    else messages.push('pH ok ✅');

    if(data.chlore < 1) messages.push('Chlore trop bas ⚠️');
    else if(data.chlore > 3) messages.push('Chlore trop haut ⚠️');
    else messages.push('Chlore ok ✅');

    if(data.tac < 80) messages.push('TAC trop bas ⚠️');
    else if(data.tac > 120) messages.push('TAC trop haut ⚠️');
    else messages.push('TAC ok ✅');

    if(data.temperature < 20) messages.push('Eau froide ❄️');
    else if(data.temperature > 30) messages.push('Eau chaude 🌡️');
    else messages.push('Température ok ✅');

    return messages;
  }

  saveBtn.addEventListener('click', ()=>{
    const data = {
      ph: parseFloat(ph.value),
      chlore: parseFloat(chlore.value),
      tac: parseFloat(tac.value),
      temperature: parseFloat(temperature.value),
      date: new Date().toLocaleString()
    };
    const results = analyse(data);
    analyseDiv.innerHTML = results.join('<br>');
    adviceDiv.innerHTML = results.join('<br>');

    let history = JSON.parse(localStorage.getItem('poolHistory')||'[]');
    history.unshift(data);
    localStorage.setItem('poolHistory', JSON.stringify(history));

    renderHistory();
  });

  function renderHistory() {
    let history = JSON.parse(localStorage.getItem('poolHistory')||'[]');
    historyList.innerHTML = '';
    history.forEach(item => {
      let li = document.createElement('li');
      li.textContent = `${item.date} - pH: ${item.ph}, Chlore: ${item.chlore}, TAC: ${item.tac}, Temp: ${item.temperature}°C`;
      historyList.appendChild(li);
    });
  }
  renderHistory();

  navButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      pages.forEach(p=>p.classList.remove('active'));
      document.getElementById(btn.dataset.page).classList.add('active');
    });
  });
});<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ma Piscine</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <div class="app">
    <header>
      <h1>Ma Piscine</h1>
    </header>

    <main id="page-mesures" class="page active">
      <h2>Mesures</h2>
      <label>pH: <input type="range" min="6" max="9" step="0.1" id="ph"></label>
      <span id="ph-val"></span>

      <label>Chlore libre (ppm): <input type="range" min="0" max="10" step="0.1" id="chlore"></label>
      <span id="chlore-val"></span>

      <label>TAC (mg/L): <input type="range" min="0" max="300" step="10" id="tac"></label>
      <span id="tac-val"></span>

      <label>Température (°C): <input type="range" min="0" max="40" step="0.5" id="temperature"></label>
      <span id="temperature-val"></span>

      <button id="save-btn">💾 Enregistrer & Analyser</button>
      <div id="analyse"></div>
    </main>

    <main id="page-historique" class="page">
      <h2>Historique</h2>
      <ul id="history-list"></ul>
    </main>

    <main id="page-conseils" class="page">
      <h2>Conseils</h2>
      <p>Ici s'afficheront des conseils en fonction de tes mesures.</p>
      <div id="advice"></div>
    </main>

    <nav>
      <button data-page="page-mesures">Mesures</button>
      <button data-page="page-historique">Historique</button>
      <button data-page="page-conseils">Conseils</button>
    </nav>
  </div>

  <script src="app.js"></script>
</body>
</html>
self.addEventListener('install', (e)=>{
  e.waitUntil(caches.open('pool-v2').then(c=>c.addAll([
    './','./index.html','./style.css','./app.js'
  ])));
});
self.addEventListener('fetch', (e)=>{
  e.respondWith(caches.match(e.request).then(r=> r || fetch(e.request)));
});

body {
  font-family: Arial, sans-serif;
  margin: 0; padding: 0;
  background: #f0f9ff;
  color: #003366;
}
header {
  background: #0099cc;
  color: white;
  padding: 1rem;
  text-align: center;
}
main {
  padding: 1rem;
  display: none;
}
main.active {
  display: block;
}
label {
  display: block;
  margin: 1rem 0 0.3rem;
}
input[type=range] {
  width: 100%;
}
button {
  display: block;
  margin: 1rem auto;
  padding: 1rem;
  font-size: 1rem;
  background: #0099cc;
  color: white;
  border: none;
  border-radius: 10px;
}
nav {
  position: fixed;
  bottom: 0;
  width: 100%;
  display: flex;
  background: #eee;
}
nav button {
  flex: 1;
  padding: 1rem;
  border: none;
  background: #ddd;
}


