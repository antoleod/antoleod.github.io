/* ============================================================
   ORYXEN LABS — script.js v2.0
   Handles: theme, nav, scroll reveal, active nav, back-to-top, contact form
   ============================================================ */

(function () {
  'use strict';

  /* ── Helpers ── */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

  /* ============================================================
     1. THEME
  ============================================================ */
  const THEME_KEY = 'oryxen-theme';
  const root      = document.documentElement;
  const themeBtn  = $('#theme-toggle');

  function getStoredTheme () {
    return localStorage.getItem(THEME_KEY)
      || (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');
  }

  function applyTheme (theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(THEME_KEY, theme);
  }

  applyTheme(getStoredTheme());

  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });
  }

  /* ============================================================
     2. NAVIGATION — mobile drawer
  ============================================================ */
  const navToggle  = $('#nav-toggle');
  const navClose   = $('#nav-close');
  const navMenu    = $('#nav-menu');
  const navOverlay = $('#nav-overlay');

  function openNav () {
    navMenu?.classList.add('open');
    navOverlay?.classList.add('open');
    navToggle?.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav () {
    navMenu?.classList.remove('open');
    navOverlay?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  navToggle?.addEventListener('click',  openNav);
  navClose?.addEventListener('click',   closeNav);
  navOverlay?.addEventListener('click', closeNav);

  // Close on link click (mobile)
  $$('[data-nav]').forEach(link => link.addEventListener('click', closeNav));

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeNav();
  });

  /* ============================================================
     3. ACTIVE NAV LINK (Intersection Observer)
  ============================================================ */
  const sections  = $$('section[id]');
  const navLinks  = $$('.nav__link[data-nav]');

  function setActive (id) {
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === `#${id}`);
    });
  }

  if ('IntersectionObserver' in window && sections.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { rootMargin: '-40% 0px -55% 0px' });

    sections.forEach(s => io.observe(s));
  }

  /* ============================================================
     4. SCROLL REVEAL
  ============================================================ */
  const revealEls = $$('[data-reveal]');

  if ('IntersectionObserver' in window && revealEls.length) {
    const revealIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.delay || '0';
          entry.target.style.transitionDelay = `${parseInt(delay, 10) * 0.08}s`;
          entry.target.classList.add('revealed');
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    revealEls.forEach(el => revealIO.observe(el));
  } else {
    // Fallback: show all
    revealEls.forEach(el => el.classList.add('revealed'));
  }

  /* ============================================================
     5. BACK TO TOP
  ============================================================ */
  const backToTop = $('#back-to-top');

  if (backToTop) {
    const toggleBackToTop = () => {
      backToTop.classList.toggle('visible', window.scrollY > 400);
    };
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();
  }

  /* ============================================================
     6. STICKY HEADER shadow on scroll
  ============================================================ */
  const header = $('#header');

  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ============================================================
     7. CONTACT FORM — client-side validation + mailto fallback
  ============================================================ */
  const form       = $('#contact-form');
  const statusEl   = $('#form-status');
  const submitBtn  = $('#contact-submit');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();

      const name    = $('#cf-name')?.value.trim();
      const email   = $('#cf-email')?.value.trim();
      const message = $('#cf-message')?.value.trim();

      // Basic validation
      if (!name || !email || !message) {
        showStatus('error', '⚠ Please fill in all required fields.');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showStatus('error', '⚠ Please enter a valid email address.');
        return;
      }

      // UX: disable button
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn-text">Sending…</span>';
      }

      // Attempt fetch (Formspree or similar) — falls back to mailto
      const endpoint = 'https://formspree.io/f/placeholder'; // Replace with real endpoint
      let sent = false;

      try {
        const res = await fetch(endpoint, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ name, email, message,
            subject: $('#cf-subject')?.value.trim() || '(no subject)' }),
        });
        if (res.ok) sent = true;
      } catch (_) {
        /* network error — fall through to mailto */
      }

      if (sent) {
        showStatus('success', '✓ Message sent! We'll reply within one business day.');
        form.reset();
      } else {
        // Graceful mailto fallback
        const subject = encodeURIComponent(`[Oryxen Labs] Message from ${name}`);
        const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
        window.location.href = `mailto:contact@oryxen.tech?subject=${subject}&body=${body}`;
        showStatus('success', '✓ Opening your email client…');
      }

      // Re-enable button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML =
          '<span class="btn-text">Send Message</span>' +
          '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
      }
    });
  }

  function showStatus (type, msg) {
    if (!statusEl) return;
    statusEl.textContent = msg;
    statusEl.className   = `form-status ${type}`;
    setTimeout(() => {
      statusEl.textContent = '';
      statusEl.className   = 'form-status';
    }, 7000);
  }

  /* ============================================================
     8. SMOOTH SCROLL for anchor links
  ============================================================ */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const headerH = parseInt(
        getComputedStyle(root).getPropertyValue('--header-h') || '72',
        10
      );
      const top = target.getBoundingClientRect().top + window.scrollY - headerH;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

})();
