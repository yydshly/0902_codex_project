document.documentElement.dataset.enhanced = "true";

const caseCards = [...document.querySelectorAll("[data-case-status]")];
const filterButtons = [...document.querySelectorAll("[data-case-filter]")];
const caseCount = document.querySelector("#case-count");
const emptyState = document.querySelector("#case-empty");

function applyCaseFilter(filter, activeButton) {
  let visible = 0;
  caseCards.forEach((card) => {
    const filtered = filter !== "all" && card.dataset.caseStatus !== filter;
    card.dataset.filtered = String(filtered);
    if (!filtered) visible += 1;
  });

  document.querySelector("#case-grid").dataset.visibleCount = String(visible);
  filterButtons.forEach((button) => {
    button.setAttribute("aria-pressed", String(button === activeButton));
  });
  caseCount.textContent = String(visible).padStart(2, "0");
  emptyState.hidden = visible !== 0;
}

filterButtons.forEach((button) => {
  button.addEventListener("click", () => applyCaseFilter(button.dataset.caseFilter, button));
});

document.querySelector("#case-grid").dataset.visibleCount = String(caseCards.length);

const evidenceItems = [...document.querySelectorAll("#evidence-ledger > details")];
document.querySelectorAll("[data-ledger-action]").forEach((button) => {
  button.addEventListener("click", () => {
    const expand = button.dataset.ledgerAction === "expand";
    evidenceItems.forEach((item) => { item.open = expand; });
    const firstSummary = evidenceItems[0]?.querySelector("summary");
    if (firstSummary) firstSummary.focus({ preventScroll: true });
  });
});

const sectionLinks = [...document.querySelectorAll(".chapter-rail [data-section]")];
const sections = sectionLinks.map((link) => document.querySelector(`#${link.dataset.section}`)).filter(Boolean);

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver((entries) => {
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    sectionLinks.forEach((link) => {
      const active = link.dataset.section === visible.target.id;
      link.classList.toggle("is-active", active);
      if (active) link.setAttribute("aria-current", "location");
      else link.removeAttribute("aria-current");
    });
  }, { rootMargin: "-22% 0px -62%", threshold: [0, 0.12, 0.35] });
  sections.forEach((section) => sectionObserver.observe(section));
}

let scrollFrame = 0;
function updateScrollProgress() {
  scrollFrame = 0;
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? Math.min(Math.max(window.scrollY / scrollable, 0), 1) : 0;
  document.documentElement.style.setProperty("--scroll-progress", progress.toFixed(4));
}

window.addEventListener("scroll", () => {
  if (!scrollFrame) scrollFrame = requestAnimationFrame(updateScrollProgress);
}, { passive: true });
updateScrollProgress();
