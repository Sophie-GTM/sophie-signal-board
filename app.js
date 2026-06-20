const state = {
  data: null,
  filter: "all",
};

const assetVersion = "20260620-1630";

async function loadBoard() {
  const response = await fetch(`./data/signals.json?v=${assetVersion}`, { cache: "no-store" });
  state.data = await response.json();

  hydrateChrome(state.data);
  renderOperatingLoop(state.data.operatingLoop);
  renderAccountHealth(state.data.accountHealth);
  renderInfluenceRules(state.data.influenceRules);
  renderSourceTruth(state.data.sourceTruth);
  renderResearchPlaybook(state.data.researchPlaybook);
  renderMemoryLoop(state.data.memoryLoop);
  renderBriefs();
  renderLearningLanes(state.data.learningLanes);
  renderExperiments(state.data.experiments);
  renderActions(state.data.nextActions);
  renderSources(state.data.sourceMap);
  bindFilters();
}

function hydrateChrome(data) {
  const updated = new Date(data.updatedAt);
  setText("freshness", data.freshness);
  setText("mission", data.mission);
  setText(
    "updatedAt",
    `Updated ${updated.toLocaleString("en-GB", { timeZone: "Europe/Vilnius" })} Vilnius time`,
  );
  setText("briefCount", data.latestBriefs.length);
  setText("laneCount", data.learningLanes.length);
  setText("sourceCount", data.sourceMap.length);
  setText("experimentCount", data.experiments.length);
  setText("confidence", data.currentRead.confidence);
  setText("currentRead", data.currentRead.summary);
}

function renderOperatingLoop(items) {
  document.getElementById("operatingLoop").innerHTML = items
    .map(
      (item, index) => `
        <article class="loop-card">
          <span>${String(index + 1).padStart(2, "0")}</span>
          <strong>${escapeHtml(item.stage)}</strong>
          <p>${escapeHtml(item.description)}</p>
        </article>
      `,
    )
    .join("");
}

function renderAccountHealth(items) {
  document.getElementById("accountHealth").innerHTML = items
    .map(
      (item) => `
        <article class="status-card">
          <div>
            <strong>${escapeHtml(item.account)}</strong>
            <span class="status ${escapeHtml(item.state)}">${escapeHtml(item.state)}</span>
          </div>
          <p>${escapeHtml(item.status)}</p>
        </article>
      `,
    )
    .join("");
}

function renderInfluenceRules(items) {
  document.getElementById("influenceRules").innerHTML = items
    .map(
      (rule) => `
        <article>
          <strong>${escapeHtml(rule.name)}</strong>
          <p>${escapeHtml(rule.rule)}</p>
        </article>
      `,
    )
    .join("");
}

function renderSourceTruth(items) {
  document.getElementById("sourceTruth").innerHTML = items
    .map(
      (item) => `
        <article class="truth-card">
          <span>${escapeHtml(item.rank)}</span>
          <strong>${escapeHtml(item.name)}</strong>
          <p>${escapeHtml(item.why)}</p>
          <small>${escapeHtml(item.use)}</small>
        </article>
      `,
    )
    .join("");
}

function renderResearchPlaybook(items) {
  document.getElementById("researchPlaybook").innerHTML = items
    .map(
      (item) => `
        <article class="method-card">
          <strong>${escapeHtml(item.name)}</strong>
          <p>${escapeHtml(item.process)}</p>
          <small>${escapeHtml(item.followLogic)}</small>
        </article>
      `,
    )
    .join("");
}

function renderMemoryLoop(items) {
  document.getElementById("memoryLoop").innerHTML = items
    .map(
      (item) => `
        <article class="method-card">
          <strong>${escapeHtml(item.stage)}</strong>
          <p>${escapeHtml(item.rule)}</p>
          <small>${escapeHtml(item.output)}</small>
        </article>
      `,
    )
    .join("");
}

function renderBriefs() {
  const data = state.data;
  const items =
    state.filter === "all"
      ? data.latestBriefs
      : data.latestBriefs.filter((brief) => brief.tags.includes(state.filter));

  document.getElementById("briefList").innerHTML = items
    .map(
      (brief) => `
        <article class="brief">
          <div class="brief-date">
            <strong>${escapeHtml(brief.date)}</strong>
            <span>${escapeHtml(brief.signalStrength)}</span>
          </div>
          <div class="brief-body">
            <div class="brief-title">
              <h3>${escapeHtml(brief.title)}</h3>
              <div>${brief.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
            </div>
            <section class="brief-signal">
              <strong>Signal</strong>
              <p>${escapeHtml(brief.read)}</p>
            </section>
            <section class="brief-explain brief-surface">
              <strong>Explanation to the semi-smart 18-year old</strong>
              <p>${escapeHtml(brief.explainLike18)}</p>
            </section>
            <dl>
              <div><dt>Why it matters</dt><dd>${escapeHtml(brief.whyItMatters)}</dd></div>
              <div><dt>Noise caveat</dt><dd>${escapeHtml(brief.noiseCaveat)}</dd></div>
            </dl>
            <div class="brief-links" aria-label="Sources">
              ${brief.links
                .map((link) => `<a href="${escapeAttribute(link.url)}" target="_blank" rel="noreferrer">${escapeHtml(link.label)}</a>`)
                .join("")}
            </div>
          </div>
        </article>
      `,
    )
    .join("");
}

function renderLearningLanes(items) {
  document.getElementById("learningLanes").innerHTML = items
    .map(
      (lane) => `
        <article class="lane-card">
          <div class="lane-top">
            <span>${escapeHtml(lane.cadence)}</span>
            <strong>${escapeHtml(lane.name)}</strong>
          </div>
          <p>${escapeHtml(lane.why)}</p>
          <ul>
            ${lane.questions.map((question) => `<li>${escapeHtml(question)}</li>`).join("")}
          </ul>
        </article>
      `,
    )
    .join("");
}

function renderExperiments(items) {
  document.getElementById("experimentsList").innerHTML = items
    .map(
      (experiment) => `
        <article class="experiment">
          <strong>${escapeHtml(experiment.name)}</strong>
          <p>${escapeHtml(experiment.hypothesis)}</p>
          <span>${escapeHtml(experiment.measure)}</span>
        </article>
      `,
    )
    .join("");
}

function renderActions(items) {
  document.getElementById("actions").innerHTML = items
    .map((item) => `<li>${escapeHtml(item)}</li>`)
    .join("");
}

function renderSources(items) {
  document.getElementById("sourcesGrid").innerHTML = items
    .map(
      (source) => `
        <article class="source-card">
          <div>
            <span>${escapeHtml(source.type)}</span>
            <strong>${escapeHtml(source.name)}</strong>
          </div>
          <p>${escapeHtml(source.why)}</p>
          <small>${escapeHtml(source.posture)}</small>
        </article>
      `,
    )
    .join("");
}

function bindFilters() {
  document.querySelectorAll("[data-filter]").forEach((button) => {
    button.addEventListener("click", () => {
      state.filter = button.dataset.filter;
      document
        .querySelectorAll("[data-filter]")
        .forEach((item) => item.classList.toggle("active", item === button));
      renderBriefs();
    });
  });
}

function setText(id, value) {
  document.getElementById(id).textContent = value;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "&#096;");
}

loadBoard().catch((error) => {
  setText("freshness", "Load error");
  console.error(error);
});
