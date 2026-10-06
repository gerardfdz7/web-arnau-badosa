/* AB Fitness · Arnau Badosa — comportamiento de la página.
   Sin dependencias. Si JavaScript falla, el contenido sigue siendo visible. */
(() => {
  'use strict';

  /* ---- Datos de contacto (cámbialos aquí si cambian) ------------------- */
  const WHATSAPP_NUMBER = '34607492003'; // prefijo país + número, sin "+" ni espacios
  const CONTACT_EMAIL = 'arnaubadosa@gmail.com';
  const INTEREST_TEXT = {
    running: 'Me interesan los entrenamientos de running.',
    hibrido: 'Me interesa el entrenamiento híbrido.',
    nutricion: 'Me interesa el entrenamiento + nutrición.',
    duda: 'Quiero empezar, pero necesito orientación para elegir el servicio.',
  };

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => Array.from(scope.querySelectorAll(selector));
  const hasIO = 'IntersectionObserver' in window;

  /* ---- Aparición progresiva al hacer scroll ---------------------------- */
  const revealItems = $$('.reveal');
  $$('[data-stagger]').forEach((group) => {
    $$(':scope > .reveal', group).forEach((el, i) => el.style.setProperty('--d', `${Math.min(i, 5) * 90}ms`));
  });
  if (hasIO) {
    const revealer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });
    revealItems.forEach((el) => revealer.observe(el));
  } else {
    revealItems.forEach((el) => el.classList.add('is-in'));
  }

  /* ---- Cabecera y menú móvil ------------------------------------------ */
  const header = $('.site-header');
  const toggle = $('.nav__toggle');

  const syncHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 12);
  syncHeader();
  window.addEventListener('scroll', syncHeader, { passive: true });

  const setMenu = (open) => {
    header.classList.toggle('is-open', open);
    document.documentElement.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  };
  toggle.addEventListener('click', () => setMenu(!header.classList.contains('is-open')));
  $$('.nav__list a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && header.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 1080px)').addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });

  /* ---- Sección activa en el menú --------------------------------------- */
  if (hasIO) {
    const links = new Map($$('.nav__list a[href^="#"]').map((a) => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => a.removeAttribute('aria-current'));
        const active = links.get(entry.target.id);
        if (active) active.setAttribute('aria-current', 'true');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['inicio', 'servicios', 'metodo', 'resultados', 'sobre-mi', 'faq', 'contacto']
      .map((id) => document.getElementById(id))
      .filter(Boolean)
      .forEach((section) => spy.observe(section));
  }

  /* ---- Barra de acción fija (móvil) ------------------------------------ */
  const sticky = $('[data-sticky-cta]');
  const hero = $('#inicio');
  const contact = $('#contacto');
  if (sticky && hero && contact && hasIO) {
    let pastHero = false;
    let inContact = false;
    const update = () => sticky.classList.toggle('is-visible', pastHero && !inContact);
    // El margen superior descuenta la cabecera fija: el hero cuenta como "fuera" cuando solo asoma bajo ella
    new IntersectionObserver(([entry]) => { pastHero = !entry.isIntersecting; update(); }, { rootMargin: '-80px 0px 0px 0px' }).observe(hero);
    new IntersectionObserver(([entry]) => { inContact = entry.isIntersecting; update(); }, { threshold: 0.15 }).observe(contact);
  }

  /* ---- Filtro de casos de éxito ---------------------------------------- */
  const filters = $$('[data-filter]');
  const cases = $$('.case');

  // En móvil la lista es un carrusel con scroll horizontal: debe poder usarse con teclado
  const carousel = $('.cases');
  const mobileQuery = window.matchMedia('(max-width: 759px)');
  const syncCarousel = () => {
    if (!carousel) return;
    if (mobileQuery.matches) {
      carousel.tabIndex = 0;
      carousel.setAttribute('role', 'region');
      carousel.setAttribute('aria-label', 'Casos de éxito (desliza para ver más)');
    } else {
      carousel.removeAttribute('tabindex');
      carousel.removeAttribute('role');
      carousel.removeAttribute('aria-label');
    }
  };
  syncCarousel();
  mobileQuery.addEventListener('change', syncCarousel);
  const filterStatus = $('[data-filter-status]');
  filters.forEach((button) => {
    button.addEventListener('click', () => {
      const wanted = button.dataset.filter;
      filters.forEach((b) => b.setAttribute('aria-pressed', String(b === button)));
      let visible = 0;
      cases.forEach((item) => {
        const show = wanted === 'all' || item.dataset.category === wanted;
        item.hidden = !show;
        if (show) { item.classList.add('is-in'); visible += 1; }
      });
      if (carousel) carousel.scrollTo({ left: 0 });
      if (filterStatus) filterStatus.textContent = `Mostrando ${visible} ${visible === 1 ? 'caso' : 'casos'} de éxito`;
    });
  });

  /* ---- Formulario de contacto: prepara el mensaje, no guarda nada ------- */
  const form = $('[data-contact-form]');
  if (form) {
    const select = $('#interes', form);
    const status = $('[data-form-status]', form);

    // Los botones "Quiero este plan" preseleccionan el servicio
    $$('[data-interest]').forEach((link) => {
      link.addEventListener('click', () => { if (select) select.value = link.dataset.interest; });
    });

    // Qué botón se ha pulsado (WhatsApp o email)
    $$('button[data-via]', form).forEach((button) => {
      button.addEventListener('click', () => { form.dataset.via = button.dataset.via; });
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const data = new FormData(form);
      const name = String(data.get('name') || '').trim();
      const goal = String(data.get('goal') || '').trim();
      const interest = INTEREST_TEXT[select.value] || select.options[select.selectedIndex].text;
      const lines = [`Hola Arnau, soy ${name}.`, interest];
      if (goal) lines.push(`Mi objetivo: ${goal}`);
      const message = lines.join('\n');

      if (form.dataset.via === 'email') {
        const subject = encodeURIComponent('Quiero empezar con AB Fitness');
        window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${encodeURIComponent(message)}`;
        status.textContent = 'Abriendo tu aplicación de correo…';
      } else {
        window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
        status.textContent = 'Abriendo WhatsApp con tu mensaje…';
      }
    });
  }

  /* ---- Año del pie ------------------------------------------------------ */
  const year = $('[data-year]');
  if (year) year.textContent = String(new Date().getFullYear());
})();
