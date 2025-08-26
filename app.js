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
});
