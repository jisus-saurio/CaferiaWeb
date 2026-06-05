/* BREW & BLOOM — main.js
   Controla el carrusel principal, animaciones al hacer scroll y la barra de navegación */

document.addEventListener("DOMContentLoaded", () => {
  /* 1. Carrusel principal (hero) */
  let currentSlide = 0;
  const TOTAL_SLIDES = 3;
  let autoplayTimer = null;

  // Elementos del carrusel
  const heroBg = document.getElementById("heroBg"); // fondo del hero cambia según el slide
  const slides = Array.from(document.querySelectorAll(".slide"));
  const dots = Array.from(document.querySelectorAll(".dot"));
  const bgClasses = ["slide-0", "slide-1", "slide-2"];

  // Muestra el slide n y actualiza estados activos
  function goToSlide(n) {
    slides[currentSlide].classList.remove("active");
    dots[currentSlide].classList.remove("active");

    // Asegura que n siempre esté dentro del rango 0..TOTAL_SLIDES-1
    currentSlide = ((n % TOTAL_SLIDES) + TOTAL_SLIDES) % TOTAL_SLIDES;

    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");

    // Cambia la clase del fondo para mantener el estilo visual
    heroBg.className = "hero-bg " + bgClasses[currentSlide];

    // Reinicia el autoplay cada vez que el usuario cambia de slide manualmente
    resetAutoplay();
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  function resetAutoplay() {
    clearInterval(autoplayTimer);
    autoplayTimer = setInterval(nextSlide, 5500);
  }

  // Botones para mover el carrusel hacia adelante/atrás
  document.getElementById("nextBtn").addEventListener("click", nextSlide);
  document.getElementById("prevBtn").addEventListener("click", prevSlide);

  // Puntos del carrusel que permiten ir directamente a un slide
  dots.forEach((dot) => {
    dot.addEventListener("click", () => goToSlide(Number(dot.dataset.slide)));
  });

  // Swipe táctil para navegar el carrusel en móviles
  let touchStartX = 0;
  const hero = document.querySelector(".heroe");
  if (hero) {
    hero.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.touches[0].clientX;
      },
      { passive: true },
    );

    hero.addEventListener("touchend", (e) => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 48) {
        diff > 0 ? nextSlide() : prevSlide();
      }
    });
  }

  // Navegación con teclado: flecha derecha e izquierda
  document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") nextSlide();
    if (e.key === "ArrowLeft") prevSlide();
  });

  resetAutoplay();

  /* 1.b Efecto de inclinación 3D según el movimiento del ratón */
  const heroSection = document.querySelector(".heroe");
  let targetRY = -6,
    targetRX = 2,
    currentRY = -6,
    currentRX = 2;

  if (heroSection) {
    heroSection.addEventListener("mousemove", (e) => {
      const rect = heroSection.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);

      // El movimiento se traduce en grados de rotación
      targetRY = dx * 18;
      targetRX = -dy * 10;
    });

    heroSection.addEventListener("mouseleave", () => {
      // Cuando el mouse sale de la sección, regresa a la posición inicial
      targetRY = -6;
      targetRX = 2;
    });
  }

  // Función que actualiza suavemente la inclinación con interpolación
  (function lerpTilt() {
    currentRY += (targetRY - currentRY) * 0.07;
    currentRX += (targetRX - currentRX) * 0.07;

    const activeImg = document.querySelector(".slide.active .drink-img-3d");
    if (activeImg) {
      activeImg.style.transform = `rotateY(${currentRY}deg) rotateX(${currentRX}deg)`;
    }

    requestAnimationFrame(lerpTilt);
  })();

  /* 2. Observador de scroll: hace aparecer elementos con animación */
  const scrollObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
        }
      });
    },
    { threshold: 0.12 },
  );

  document.querySelectorAll(".drink-card, .fade-up").forEach((el) => scrollObserver.observe(el));

  /* 3. Sombra en la barra de navegación al hacer scroll */
  const nav = document.getElementById("navPrincipal");
  if (nav) {
    window.addEventListener(
      "scroll",
      () => {
        nav.classList.toggle("scrolled", window.scrollY > 60);
      },
      { passive: true },
    );
  }
});
