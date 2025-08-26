function showSection(id) {
  document.querySelectorAll('.section').forEach(sec => sec.style.display = "none");
  document.getElementById(id).style.display = "block";

  if (id === "historique") loadHistory();
  if (id === "mesures") showLastMeasure();
}

function saveMeasure() {
  const date = document.getElementById("date").value || new Date().toLocaleDateString();
  const ph = document.getElementById("ph").value;
  const chlore = document.getElementById("chlore").value;

  if (!ph || !chlore) {
    alert("Merci de remplir le pH et le chlore");
    return;
  }

  const measure = { date, ph, chlore };
  let history = JSON.parse(localStorage.getItem("poolHistory")) || [];
  history.push(measure);
  localStorage.setItem("poolHistory", JSON.stringify(history));

  alert("Mesure enregistrée !");
}

function loadHistory() {
  let history = JSON.parse(localStorage.getItem("poolHistory")) || [];
  const list = history.map(m => `<p>${m.date} → pH: ${m.ph}, Chlore: ${m.chlore} ppm</p>`).join("");
  document.getElementById("historyList").innerHTML = list || "Aucune mesure enregistrée";
}

function showLastMeasure() {
  let history = JSON.parse(localStorage.getItem("poolHistory")) || [];
  if (history.length === 0) {
    document.getElementById("lastMeasure").innerText = "Aucune donnée encore";
  } else {
    let last = history[history.length - 1];
    document.getElementById("lastMeasure").innerText =
      `${last.date} → pH: ${last.ph}, Chlore: ${last.chlore} ppm`;
  }
}

// Charger la première section par défaut
showSection('enregistrer');