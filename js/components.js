/* ── Determina la raíz del sitio para armar las rutas ── */
function rootPath() {
  // El código calcula cuántos niveles de carpeta hay en la URL actual,
  // pero aquí simplemente retorna la raíz del sitio como cadena vacía.
  // Si tuvieras rutas más profundas, podrías usar "../" según el depth.
  const depth = window.location.pathname.split("/").filter(Boolean).length;
  return "";
}

/* ══════════════════════════════════════════════════════
   <nav-bar>
   Atributo opcional: page="menu" para marcar el link activo
   ══════════════════════════════════════════════════════ */
class NavBar extends HTMLElement {
  connectedCallback() {
    // Lee el atributo page para saber cuál enlace está activo
    const currentPage = this.getAttribute("page") || "";

    // Lista de enlaces que aparecerán en la barra de navegación
    const links = [
      { label: "Inicio",   href: "/index.html",    key: "inicio"   },
      { label: "Menú",     href: "/pages/productos.html",      key: "menu"     },
      { label: "Nosotros", href: "/pages/nosotros.html",  key: "nosotros" },
      { label: "Contacto", href: "/pages/Contact.html",  key: "contacto" },
      { label: "Carrito",  href: "/pages/Cart.html",   key: "carrito"  },
    ];

    // Crea el HTML de cada enlace, agregando la clase activa si corresponde
    const liItems = links
      .map(
        ({ label, href, key }) =>
          `<li><a href="${href}" ${key === currentPage ? 'class="nav-active"' : ""}>${label}</a></li>`
      )
      .join("\n          ");

    // Construye la barra de navegación principal y el menú móvil
    this.innerHTML = `
      <nav id="navPrincipal">
        <a href="/index.html" class="nav-logo">
          <img class="nav-logo-img" src="/img/logo.png" alt="Coffe Lawhore logo">
          <div class="nav-logo-text">Coffe Lawhore</div>
        </a>

        <ul class="nav-links">
          ${liItems}
        </ul>

        <button class="nav-hamburger" aria-label="Abrir menú" aria-expanded="false" aria-controls="navMobile">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      <div class="nav-mobile" id="navMobile" aria-hidden="true">
        <ul class="nav-mobile-links">
          ${liItems}
        </ul>
      </div>

      <style>
        /* ── Hamburguesa ── */
        .nav-hamburger {
          display: none;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 5px;
          width: 40px;
          height: 40px;
          padding: 6px;
          background: none;
          border: 1.5px solid rgba(158,123,106,0.25);
          border-radius: 8px;
          cursor: pointer;
          transition: border-color 0.2s, background 0.2s;
          flex-shrink: 0;
        }
        .nav-hamburger:hover {
          border-color: var(--green-deep, #5a9e6f);
          background: rgba(90,158,111,0.06);
        }
        .nav-hamburger span {
          display: block;
          width: 18px;
          height: 2px;
          background: var(--text-dark, #3a2e28);
          border-radius: 2px;
          transition: transform 0.3s ease, opacity 0.3s ease, width 0.3s ease;
          transform-origin: center;
        }

        /* Estado abierto — animación a X */
        .nav-hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
        .nav-hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
        .nav-hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

        /* ── Panel móvil ── */
        .nav-mobile {
          display: none;
          position: fixed;
          top: var(--nav-h, 68px);
          left: 0; right: 0;
          z-index: 999;
          background: rgba(253,248,240,0.97);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(158,123,106,0.15);
          box-shadow: 0 12px 40px rgba(58,46,40,0.12);
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.38s cubic-bezier(0.4, 0, 0.2, 1),
                      opacity 0.28s ease;
          opacity: 0;
        }
        .nav-mobile.open {
          max-height: 400px;
          opacity: 1;
        }
        .nav-mobile-links {
          list-style: none;
          padding: 12px 0 20px;
          margin: 0;
        }
        .nav-mobile-links li {
          border-bottom: 1px solid rgba(158,123,106,0.08);
        }
        .nav-mobile-links li:last-child { border-bottom: none; }
        .nav-mobile-links a {
          display: block;
          padding: 14px 28px;
          font-family: var(--font-body, "DM Sans", sans-serif);
          font-size: 0.95rem;
          font-weight: 500;
          color: var(--text-mid, #6b5a50);
          text-decoration: none;
          letter-spacing: 0.02em;
          transition: color 0.2s, background 0.2s, padding-left 0.2s;
        }
        .nav-mobile-links a:hover,
        .nav-mobile-links a.nav-active {
          color: var(--green-deep, #5a9e6f);
          background: rgba(90,158,111,0.06);
          padding-left: 36px;
        }
        .nav-mobile-links a.nav-active {
          font-weight: 600;
        }

        /* ── Mostrar hamburguesa en móvil ── */
        @media (max-width: 960px) {
          .nav-hamburger { display: flex; }
          .nav-mobile    { display: block; }
        }
      </style>
    `;

    /* ── Botón de hamburguesa y panel móvil ── */
    const btn    = this.querySelector(".nav-hamburger");
    const panel  = this.querySelector(".nav-mobile");

    // Al dar clic en el botón se abre o cierra el menú móvil
    btn.addEventListener("click", () => {
      const isOpen = panel.classList.toggle("open");
      btn.classList.toggle("open", isOpen);
      btn.setAttribute("aria-expanded", String(isOpen));
      panel.setAttribute("aria-hidden", String(!isOpen));
    });

    // Al seleccionar un enlace del menú móvil, se cierra el panel
    panel.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        panel.classList.remove("open");
        btn.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        panel.setAttribute("aria-hidden", "true");
      });
    });

    // Si el usuario hace clic fuera de la barra de navegación, cierra el menú móvil
    document.addEventListener("click", (e) => {
      if (!this.contains(e.target)) {
        panel.classList.remove("open");
        btn.classList.remove("open");
        btn.setAttribute("aria-expanded", "false");
        panel.setAttribute("aria-hidden", "true");
      }
    });

    // Cambia la clase cuando el usuario hace scroll para agregar una sombra
    const nav = this.querySelector("#navPrincipal");
    const onScroll = () => nav.classList.toggle("scrolled", window.scrollY > 10);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
}

customElements.define("nav-bar", NavBar);


/* ══════════════════════════════════════════════════════
   <site-footer>
   ══════════════════════════════════════════════════════ */
class SiteFooter extends HTMLElement {
  connectedCallback() {
    // El pie de página se inserta en cada página donde se use <site-footer>
    this.innerHTML = `
      <footer>
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="footer-logo">Coffe Lawhore</div>
            <p>Cada taza es una historia. Cada visita, un recuerdo para guardar.</p>

          </div>
          <div class="footer-col">
            <h3>Enlaces rápidos</h3>
            <ul>
              <li><a href="/index.html">Inicio</a></li>
              <li><a href="/pages/nosotros.html">Nosotros</a></li>
              <li><a href="/pages/productos.html">Menú</a></li>
              <li><a href="/pages/Contact.html#contacto">Contacto</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h3>Soporte</h3>
            <ul>
              <li><a href="#">Atención</a></li>
              <li><a href="#">Servicio 24h</a></li>
              <li><a href="#">Chat rápido</a></li>
            </ul>
          </div>
          <div class="footer-col">
            <h3>Síguenos</h3>
            <div class="footer-socials" style="margin-top:4px">
              <div class="footer-social">ig</div>
              <div class="footer-social">tw</div>
              <div class="footer-social">wa</div>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© 2026 Coffe Lawhore. Todos los derechos reservados.</span>
          <span class="footer-credit">Creado con amor, impulsado por café.</span>
        </div>
      </footer>
    `;
  }
}

customElements.define("site-footer", SiteFooter);