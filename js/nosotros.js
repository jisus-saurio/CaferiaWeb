/* ── Sombra en la barra de navegación al hacer scroll ── */
const nav = document.getElementById("navPrincipal");
window.addEventListener("scroll", () => {
  // Agrega la clase "scrolled" cuando se baja la página más de 10px
  // Esto permite aplicar estilos diferentes al menú cuando el usuario hace scroll.
  nav.classList.toggle("scrolled", window.scrollY > 10);
});

/* ── Mostrar elementos cuando aparecen en pantalla (scroll reveal) ── */
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
        // Cuando el elemento entra en la pantalla, agrega la clase "visible"
        entry.target.classList.add("visible");
        // Ya no hace falta observarlo otra vez
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 }
);

// Observa todos los elementos que queremos animar al aparecer
revealSelectors.forEach((sel) => {
  document.querySelectorAll(sel).forEach((el) => observer.observe(el));
});

/* ── Animación de números para las estadísticas ── */
function animateCounter(el, target, suffix = "") {
  const duration = 1400; // duración de la animación en milisegundos
  const start = performance.now();

  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    // Efecto 'ease out' para que la animación sea más suave al final
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(eased * target);

    // Escribe el valor en el elemento, con el sufijo si se necesita
    el.textContent = value + suffix;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  };

  requestAnimationFrame(update);
}

const statsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Busca los elementos que muestran los números en la sección de estadísticas
        const items = entry.target.querySelectorAll(".essence-num");
        const targets = [7, 40, 12, 100];
        const suffixes = ["+", "k", "", "%"];

        items.forEach((item, i) => {
          // Inicia cada contador con un pequeño retraso para que no comiencen todos a la vez
          setTimeout(() => {
            item.innerHTML = "";
            animateCounter(
              item,
              targets[i],
              suffixes[i] === "+" ? "<sup>+</sup>" : suffixes[i] === "k" ? "<sup>k</sup>" : suffixes[i] === "%" ? "<sup>%</sup>" : ""
            );
          }, i * 120);
        });

        // Ya no observa la sección después de animar los contadores
        statsObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

const essenceInner = document.querySelector(".essence-inner");
if (essenceInner) {
  // Observa la sección de estadísticas para iniciar la animación cuando esté visible
  statsObserver.observe(essenceInner);
}
