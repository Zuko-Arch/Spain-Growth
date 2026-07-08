// =====================================================
// SPAIN GROWTH — shared behavior across all pages
// =====================================================

const themeStorageKey = 'spain-growth-theme';
let themePreference = 'auto';

const getAutoTheme = () => {
  const hour = new Date().getHours();
  return hour >= 19 || hour < 7 ? 'dark' : 'light';
};

const resolveTheme = (preference) => preference === 'auto' ? getAutoTheme() : preference;

const updateThemeControls = () => {
  const labelByPreference = {
    auto: 'Auto',
    light: 'Claro',
    dark: 'Oscuro'
  };
  const resolved = resolveTheme(themePreference);

  document.querySelectorAll('[data-theme-toggle]').forEach(button => {
    const label = button.querySelector('.theme-label');
    if (label) label.textContent = labelByPreference[themePreference];
    button.setAttribute('aria-label', `Tema actual: ${labelByPreference[themePreference]} (${resolved}). Cambiar tema`);
    button.setAttribute('title', `Tema: ${labelByPreference[themePreference]}`);
  });
};

const applyTheme = (preference) => {
  themePreference = ['auto', 'light', 'dark'].includes(preference) ? preference : 'auto';
  document.documentElement.dataset.theme = resolveTheme(themePreference);
  document.documentElement.dataset.themePreference = themePreference;
  updateThemeControls();
};

try {
  themePreference = localStorage.getItem(themeStorageKey) || 'auto';
} catch (error) {
  themePreference = 'auto';
}

applyTheme(themePreference);

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- theme toggle: auto by local time, manual light/dark ---------- */
  const themeCycle = ['auto', 'light', 'dark'];
  updateThemeControls();
  document.querySelectorAll('[data-theme-toggle]').forEach(button => {
    button.addEventListener('click', () => {
      const nextTheme = themeCycle[(themeCycle.indexOf(themePreference) + 1) % themeCycle.length];
      try {
        localStorage.setItem(themeStorageKey, nextTheme);
      } catch (error) {
        // Storage can fail in private browsing; the visual theme still updates for the session.
      }
      applyTheme(nextTheme);
    });
  });

  window.setInterval(() => {
    if (themePreference === 'auto') applyTheme('auto');
  }, 15 * 60 * 1000);

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

  /* ---------- hero background video: respect reduced-motion, pause off-screen ---------- */
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      heroVideo.removeAttribute('autoplay');
      heroVideo.pause();
    } else if ('IntersectionObserver' in window) {
      const videoIo = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) heroVideo.play().catch(() => {});
          else heroVideo.pause();
        });
      }, { threshold: 0 });
      videoIo.observe(heroVideo);
    }
  }

  /* ---------- interactive grid background (hero, no-video pages) ---------- */
  document.querySelectorAll('.hero-grid-bg').forEach(initHeroGrid);

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

// =====================================================
// Interactive grid background — small squares that light up
// (orange brand accent only) as the cursor moves near them.
// =====================================================
function initHeroGrid(canvas) {
  const ctx = canvas.getContext('2d');
  const cellSize = 34;
  const gap = 8;
  const radius = 170;
  const radiusSq = radius * radius;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let width = 0, height = 0, cols = 0, rows = 0, cells = null;
  let mouseX = -9999, mouseY = -9999;
  let rafId = null;

  function resize() {
    const rect = canvas.parentElement.getBoundingClientRect();
    width = rect.width;
    height = rect.height;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * dpr);
    canvas.height = Math.round(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    cols = Math.ceil(width / cellSize) + 1;
    rows = Math.ceil(height / cellSize) + 1;
    cells = new Float32Array(cols * rows);
  }

  function onMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
  }

  function onLeave() {
    mouseX = -9999;
    mouseY = -9999;
  }

  function draw() {
    if (!cells) return;
    ctx.clearRect(0, 0, width, height);

    const size = cellSize - gap;

    // resting grid: a faint, neutral dot pattern
    ctx.shadowBlur = 0;
    ctx.fillStyle = 'rgba(240, 236, 227, .05)';
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        ctx.fillRect(c * cellSize + gap / 2, r * cellSize + gap / 2, size, size);
      }
    }

    // reactive glow trail: orange only, decays smoothly each frame
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const idx = r * cols + c;
        const x = c * cellSize;
        const y = r * cellSize;
        const dx = (x + cellSize / 2) - mouseX;
        const dy = (y + cellSize / 2) - mouseY;
        const distSq = dx * dx + dy * dy;

        let target = 0;
        if (distSq < radiusSq) {
          const t = 1 - Math.sqrt(distSq) / radius;
          target = t * t;
        }

        const prev = cells[idx];
        const v = target > prev ? target : prev * 0.91;
        cells[idx] = v;

        if (v > 0.02) {
          ctx.fillStyle = `rgba(238, 115, 28, ${0.18 + v * 0.6})`;
          ctx.shadowColor = 'rgba(238, 115, 28, .9)';
          ctx.shadowBlur = 12 * v;
          ctx.fillRect(x + gap / 2, y + gap / 2, size, size);
        }
      }
    }
  }

  function loop() {
    draw();
    rafId = requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize, { passive: true });
  canvas.parentElement.addEventListener('pointermove', onMove, { passive: true });
  canvas.parentElement.addEventListener('pointerleave', onLeave, { passive: true });

  if (reduceMotion) {
    draw();
    return;
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (!rafId) loop();
        } else if (rafId) {
          cancelAnimationFrame(rafId);
          rafId = null;
        }
      });
    }, { threshold: 0 });
    io.observe(canvas);
  } else {
    loop();
  }
}
