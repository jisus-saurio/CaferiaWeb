/* ── Nav scroll shadow ── */
const nav = document.getElementById("navPrincipal");
window.addEventListener("scroll", () => {
  nav.classList.toggle("scrolled", window.scrollY > 10);
});

/* ── Scroll reveal (IntersectionObserver) ── */
const revealSelectors = [
  ".essence-item",
  ".origin-img-main",
  ".origin-img-secondary",
  ".origin-img-deco",
  ".origin-text-col",
  ".value-card",
  ".team-card",
  ".process-step",
  ".about-cta-inner",
  ".reveal"
];

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

revealSelectors.forEach((sel) => {
  document.querySelectorAll(sel).forEach((el) => observer.observe(el));
});

/* ── Contador animado para las stats ── */
function animateCounter(el, target, suffix = "") {
  const duration = 1400;
  const start = performance.now();
  const isFloat = target % 1 !== 0;
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);
    el.textContent = value + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const items = entry.target.querySelectorAll(".essence-num");
        const targets = [7, 40, 12, 100];
        const suffixes = ["+", "k", "", "%"];
        items.forEach((item, i) => {
          setTimeout(() => {
            item.innerHTML = "";
            animateCounter(item, targets[i], suffixes[i] === "+" ? "<sup>+</sup>" : suffixes[i] === "k" ? "<sup>k</sup>" : suffixes[i] === "%" ? "<sup>%</sup>" : "");
          }, i * 120);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

const essenceInner = document.querySelector(".essence-inner");
if (essenceInner) statsObserver.observe(essenceInner);
