(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = menuButton.getAttribute('aria-expanded') !== 'true';
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
      nav.classList.toggle('is-open', open);
    });
    nav.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      menuButton.setAttribute('aria-expanded', 'false');
      menuButton.setAttribute('aria-label', 'Abrir menu');
      nav.classList.remove('is-open');
    }));
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        menuButton.setAttribute('aria-expanded', 'false');
        menuButton.setAttribute('aria-label', 'Abrir menu');
        nav.classList.remove('is-open');
      }
    });
  }

  const gallery = [...document.querySelectorAll('.gallery-card')];
  const filters = [...document.querySelectorAll('.filter-button')];
  filters.forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    filters.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    gallery.forEach((card) => { card.hidden = filter !== 'all' && card.dataset.category !== filter; });
    document.querySelector('.gallery-grid')?.classList.remove('is-filtering');
    requestAnimationFrame(() => document.querySelector('.gallery-grid')?.classList.add('is-filtering'));
  }));

  const lightbox = document.querySelector('#lightbox');
  const lightboxImage = document.querySelector('#lightbox-image');
  const lightboxCaption = document.querySelector('#lightbox-caption');
  let activeImage = 0;
  const visibleGallery = () => gallery.filter((card) => !card.hidden);
  const showImage = (card) => {
    if (!card || !lightboxImage || !lightboxCaption) return;
    activeImage = gallery.indexOf(card);
    lightboxImage.src = card.dataset.full;
    lightboxImage.alt = card.querySelector('img')?.alt || '';
    lightboxCaption.textContent = card.dataset.caption || '';
  };
  gallery.forEach((card) => card.addEventListener('click', () => {
    showImage(card);
    lightbox?.showModal();
  }));
  document.querySelector('.lightbox-close')?.addEventListener('click', () => lightbox?.close());
  lightbox?.addEventListener('click', (event) => { if (event.target === lightbox) lightbox.close(); });
  const moveImage = (direction) => {
    const visible = visibleGallery();
    if (!visible.length) return;
    const current = gallery[activeImage];
    let index = visible.indexOf(current);
    if (index < 0) index = 0;
    index = (index + direction + visible.length) % visible.length;
    showImage(visible[index]);
  };
  document.querySelector('.lightbox-prev')?.addEventListener('click', () => moveImage(-1));
  document.querySelector('.lightbox-next')?.addEventListener('click', () => moveImage(1));
  lightbox?.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') moveImage(1);
    if (event.key === 'ArrowLeft') moveImage(-1);
  });

  const cityInput = document.querySelector('#client-city');
  document.querySelectorAll('.city-list button[data-city]').forEach((button) => button.addEventListener('click', () => {
    if (cityInput) cityInput.value = button.dataset.city;
    document.querySelectorAll('.city-list button').forEach((item) => item.classList.toggle('is-selected', item === button));
    document.querySelector('#orcamento')?.scrollIntoView({ behavior: 'smooth' });
    window.setTimeout(() => cityInput?.focus({ preventScroll: true }), 450);
  }));

  const serviceSelect = document.querySelector('#service-type');
  document.querySelectorAll('[data-service]').forEach((link) => link.addEventListener('click', () => {
    if (serviceSelect) serviceSelect.value = link.dataset.service;
  }));

  const phoneInput = document.querySelector('#client-phone');
  phoneInput?.addEventListener('input', () => {
    const digits = phoneInput.value.replace(/\D/g, '').slice(0, 11);
    if (digits.length < 3) phoneInput.value = digits ? '(' + digits : '';
    else if (digits.length < 7) phoneInput.value = '(' + digits.slice(0, 2) + ') ' + digits.slice(2);
    else if (digits.length < 11) phoneInput.value = '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 6) + '-' + digits.slice(6);
    else phoneInput.value = '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 7) + '-' + digits.slice(7);
  });

  const form = document.querySelector('#quote-form');
  const error = document.querySelector('#form-error');
  form?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const name = String(data.get('name') || '').trim();
    const phone = String(data.get('phone') || '').trim();
    const city = String(data.get('city') || '').trim();
    const service = String(data.get('service') || '').trim();
    const description = String(data.get('description') || '').trim();
    if (phone.replace(/\D/g, '').length < 10) {
      if (error) error.textContent = 'Confira seu WhatsApp: informe o DDD e o número completo.';
      phoneInput?.focus();
      return;
    }
    if (error) error.textContent = '';
    const lines = [
      'Olá! Quero pedir um orçamento sem compromisso.',
      '',
      'Nome: ' + name,
      'Meu WhatsApp: ' + phone,
      'Cidade: ' + city,
      'Serviço: ' + service,
      description ? 'O que preciso: ' + description : ''
    ].filter(Boolean);
    const url = 'https://wa.me/5512996455861?text=' + encodeURIComponent(lines.join('\n'));
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  const year = document.querySelector('#year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
