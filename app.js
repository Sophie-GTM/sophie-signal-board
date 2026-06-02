async function loadBoard() {
  const response = await fetch("./data/signals.json", { cache: "no-store" });
  const data = await response.json();

  const updated = new Date(data.updatedAt);
  document.getElementById("freshness").textContent = data.freshness;
  document.getElementById("updatedAt").textContent =
    `Updated ${updated.toLocaleString("en-GB", { timeZone: "Europe/Vilnius" })} Vilnius time`;
  document.getElementById("briefCount").textContent = data.latestBriefs.length;
  document.getElementById("trackCount").textContent = data.trackedThemes.length;
  document.getElementById("sourceCount").textContent = data.sourceMap.length;
  document.getElementById("confidence").textContent = data.currentRead.confidence;
  document.getElementById("currentRead").textContent = data.currentRead.summary;

  renderAccountHealth(data.accountHealth);
  renderBriefs(data.latestBriefs);
  renderThemes(data.trackedThemes);
  renderActions(data.nextActions);
  renderSources(data.sourceMap);
}

function renderAccountHealth(items) {
  const root = document.getElementById("accountHealth");
  root.innerHTML = items
    .map(
      (item) => `
        <div class="health-item">
          <strong>${escapeHtml(item.account)}</strong>
          <p>${escapeHtml(item.status)}</p>
        </div>
      `,
    )
    .join("");
}

function renderBriefs(items) {
  const root = document.getElementById("briefs");
  root.innerHTML = items
    .map(
      (brief) => `
        <article class="brief">
          <div class="brief-meta">
            <strong>${escapeHtml(brief.date)}</strong>
            <div>${escapeHtml(brief.signalStrength)}</div>
          </div>
          <div>
            <strong>${escapeHtml(brief.title)}</strong>
            <p>${escapeHtml(brief.read)}</p>
            <div class="brief-links">
              ${brief.links
                .map((link) => `<a href="${link.url}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`)
                .join("")}
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderThemes(items) {
  const root = document.getElementById("themes");
  root.innerHTML = items.map((theme) => `<span>${escapeHtml(theme)}</span>`).join("");
}

function renderActions(items) {
  const root = document.getElementById("actions");
  root.innerHTML = items.map((item) => `<li>${escapeHtml(item)}</li>`).join("");
}

function renderSources(items) {
  const root = document.getElementById("sources");
  root.innerHTML = items
    .map(
      (source) => `
        <article class="source-card">
          <span class="source-type">${escapeHtml(source.type)}</span>
          <strong>${escapeHtml(source.name)}</strong>
          <p>${escapeHtml(source.why)}</p>
        </article>
      `,
    )
    .join("");
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

loadBoard().catch((error) => {
  document.getElementById("freshness").textContent = "Load error";
  console.error(error);
});
