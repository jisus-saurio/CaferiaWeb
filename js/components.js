/* ── Determina la raíz del sitio para armar las rutas ── */
function rootPath() {
  const depth = window.location.pathname.split("/").filter(Boolean).length;
  return "";
}

/* ══════════════════════════════════════════════════════
   <nav-bar>
   Atributo opcional: page="menu" para marcar el link activo
   ══════════════════════════════════════════════════════ */
class NavBar extends HTMLElement {
  connectedCallback() {
    const currentPage = this.getAttribute("page") || "";

    const links = [
      { label: "Inicio",   href: "/index.html#inicio",    key: "inicio"   },
      { label: "Menú",     href: "/pages/menu.html",      key: "menu"     },
      { label: "Nosotros", href: "/pages/nosotros.html",  key: "nosotros" },
      { label: "Contacto", href: "/pages/Contact.html",  key: "contacto" },
      { label: "Carrito",  href: "/pages/Cart.html",   key: "carrito"  },
    ];

    const liItems = links
      .map(
        ({ label, href, key }) =>
          `<li><a href="${href}" ${key === currentPage ? 'class="nav-active"' : ""}>${label}</a></li>`
      )
      .join("\n          ");

    this.innerHTML = `
      <nav id="navPrincipal">
        <a href="/index.html" class="nav-logo">
          <img class="nav-logo-img" src="/img/logo.png" alt="Coffe Lawhore logo">
          <div class="nav-logo-text">Coffe Lawhore</div>
        </a>
        <ul class="nav-links">
          ${liItems}
        </ul>
      </nav>
    `;
  }
}

customElements.define("nav-bar", NavBar);


/* ══════════════════════════════════════════════════════
   <site-footer>
   ══════════════════════════════════════════════════════ */
class SiteFooter extends HTMLElement {
  connectedCallback() {
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
              <li><a href="/pages/menu.html">Menú</a></li>
              <li><a href="/index.html#contacto">Contacto</a></li>
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