// URL pública da planilha em formato JSON
const SHEET_JSON_URL =
  "https://docs.google.com/spreadsheets/d/175CO1pQrUL2EaXitBSb8ynxzna4tj64T6n2jb5lR3hQ/gviz/tq?sheet=Dados&tqx=out:json";

const interval = 3000; // atualizar a cada 3 segundos

const tempEl = document.getElementById("temp");
const pressEl = document.getElementById("press");
const altEl = document.getElementById("alt");
const statusEl = document.getElementById("status");
const logEl = document.getElementById("log");

async function fetchData() {
  try {
    const raw = await fetch(SHEET_JSON_URL);
    const text = await raw.text();
    
    // Remove o prefixo "google.visualization.Query.setResponse(" e o ");" final
    const json = JSON.parse(text.substring(47, text.length - 2));

    const rows = json.table.rows;
    const last = rows[rows.length - 1].c;

    const temp = last[1].v;
    const press = last[2].v;
    const alt = last[3].v;

    tempEl.textContent = temp + " °C";
    pressEl.textContent = press + " hPa";
    altEl.textContent = alt + " m";

    statusEl.textContent = "Atualizado: " + new Date().toLocaleTimeString();
    addLog(`T=${temp}°C · P=${press}hPa · A=${alt}m`);

  } catch (err) {
    statusEl.textContent = "Erro ao atualizar: " + err;
  }
}

function addLog(msg) {
  const li = document.createElement("li");
  li.textContent = "[" + new Date().toLocaleTimeString() + "] " + msg;
  logEl.prepend(li);
}

document.getElementById("refreshBtn").addEventListener("click", fetchData);

fetchData();
setInterval(fetchData, interval);
