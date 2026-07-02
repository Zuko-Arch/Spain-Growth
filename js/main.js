// =====================================================
// SPAIN GROWTH — shared behavior across all pages
// =====================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- navbar scroll state ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 12);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile menu ---------- */
  const burger = document.querySelector('.nav-burger');
  const links = document.querySelector('.nav-links');
  if (burger && links) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      links.classList.toggle('open');
      document.body.style.overflow = links.classList.contains('open') ? 'hidden' : '';
    });
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('open');
      links.classList.remove('open');
      document.body.style.overflow = '';
    }));
  }

  /* ---------- active nav link (by body[data-page]) ---------- */
  const page = document.body.getAttribute('data-page');
  if (page) {
    document.querySelectorAll('.nav-links a[data-nav]').forEach(a => {
      a.classList.toggle('active', a.getAttribute('data-nav') === page);
    });
  }

  /* ---------- scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in'));
  }

  /* ---------- chip groups (proyecto page: presupuesto / servicio) ---------- */
  document.querySelectorAll('.chip-group').forEach(group => {
    const chips = group.querySelectorAll('.chip');
    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const input = chip.querySelector('.chip-input');
        if (!input) return;
        if (input.type === 'radio') {
          chips.forEach(c => c.classList.remove('active'));
          chip.classList.add('active');
          input.checked = true;
        } else {
          chip.classList.toggle('active');
          input.checked = chip.classList.contains('active');
        }
      });
    });
  });

  /* ---------- generic form submit -> success state ---------- */
  document.querySelectorAll('form[data-success]').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      // Front-end only: replace this block with a real submit (fetch/EmailJS/CMS endpoint) when integrating a backend.
      const successId = form.getAttribute('data-success');
      const successEl = document.getElementById(successId);
      if (successEl) {
        form.style.display = 'none';
        successEl.classList.add('show');
        successEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });

  /* ---------- pre-fill "servicio de interés" from ?servicio= query param ---------- */
  const params = new URLSearchParams(window.location.search);
  const serviceParam = params.get('servicio');
  if (serviceParam) {
    const select = document.querySelector('[name="servicio"]');
    if (select) {
      [...select.options].forEach(opt => {
        if (opt.value.toLowerCase() === serviceParam.toLowerCase()) select.value = opt.value;
      });
    }
  }

});
