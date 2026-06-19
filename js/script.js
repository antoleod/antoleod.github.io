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

  function normalizeTheme (theme) {
    if (theme === 'white') return 'light';
    if (theme === 'light' || theme === 'dark') return theme;
    return null;
  }

  function getStoredTheme () {
    const stored = normalizeTheme(localStorage.getItem(THEME_KEY));
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }

  function applyTheme (theme) {
    const resolved = normalizeTheme(theme) || 'dark';
    root.setAttribute('data-theme', resolved);
    localStorage.setItem(THEME_KEY, resolved);
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
    navMenu?.removeAttribute('aria-hidden');
    navMenu?.setAttribute('aria-modal', 'true');
    document.body.style.overflow = 'hidden';
    setTimeout(() => navClose?.focus(), 50);
  }

  function closeNav () {
    navMenu?.classList.remove('open');
    navOverlay?.classList.remove('open');
    navToggle?.setAttribute('aria-expanded', 'false');
    navMenu?.setAttribute('aria-hidden', 'true');
    navMenu?.removeAttribute('aria-modal');
    document.body.style.overflow = '';
    navToggle?.focus();
  }

  // Focus trap inside drawer
  navMenu?.addEventListener('keydown', e => {
    if (e.key !== 'Tab' || !navMenu.classList.contains('open')) return;
    const focusable = [...navMenu.querySelectorAll(
      'a[href],button:not([disabled]),input,select,textarea,[tabindex]:not([tabindex="-1"])'
    )].filter(el => !el.closest('[aria-hidden="true"]'));
    if (!focusable.length) return;
    const first = focusable[0];
    const last  = focusable[focusable.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  });

  navToggle?.addEventListener('click',  openNav);
  navClose?.addEventListener('click',   closeNav);
  navOverlay?.addEventListener('click', closeNav);

  // Close on link click (mobile)
  $$('[data-nav]').forEach(link => link.addEventListener('click', closeNav));

  // Close on Escape — return focus to trigger
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navMenu?.classList.contains('open')) closeNav();
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
    window.__revealIO = revealIO;
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
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Honeypot check
      if ($('[name="_gotcha"]')?.value) return;

      const name    = $('#cf-name')?.value.trim();
      const email   = $('#cf-email')?.value.trim();
      const subject = $('#cf-subject')?.value.trim();
      const message = $('#cf-message')?.value.trim();

      // Field-level validation
      let hasError = false;
      [['cf-name', name], ['cf-email', email], ['cf-message', message]].forEach(([id, val]) => {
        const group = document.getElementById(id)?.closest('.form-group');
        if (group) group.classList.toggle('field-error', !val);
        if (!val) hasError = true;
      });
      if (hasError) {
        showStatus('error', '⚠ Please fill in all required fields.');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        const emailGroup = document.getElementById('cf-email')?.closest('.form-group');
        emailGroup?.classList.add('field-error');
        showStatus('error', '⚠ Please enter a valid email address.');
        return;
      }
      // Clear errors on successful validation
      form.querySelectorAll('.field-error').forEach(el => el.classList.remove('field-error'));

      // UX: disable button while opening mailto
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="btn-text">Opening email client…</span>';
      }

      // Open mailto directly — no server-side form handler is configured
      const mailSubject = encodeURIComponent(subject || `[Oryxen Labs] Message from ${name}`);
      const body        = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:jdioses@outlook.be?subject=${mailSubject}&body=${body}`;
      showStatus('info', 'Opening your email client… If nothing happens, <a href="mailto:jdioses@outlook.be" style="color:inherit;text-decoration:underline">email us directly</a>.');

      // Re-enable button after delay so "Opening email client…" state is visible
      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML =
            '<span class="btn-text">Send Message</span>' +
            '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>';
        }
      }, 1500);
    });
  }

  function showStatus (type, msg) {
    if (!statusEl) return;
    statusEl.innerHTML = msg;
    statusEl.className = `form-status ${type}`;
    setTimeout(() => {
      statusEl.innerHTML = '';
      statusEl.className = 'form-status';
    }, 7000);
  }

  /* ============================================================
     8. HERO TERMINAL ANIMATION
  ============================================================ */
  function initTerminalAnimation() {
    const terminalBody = $('.terminal__body');
    if (!terminalBody) return;

    const lines = $$('.t-line', terminalBody);
    if (!lines.length) return;

    const lineDelay = 200;
    const restartDelay = 5000;
    const typeSpeed = 90;

    const lastLine = lines[lines.length - 1];
    const lastLineCmd = lastLine.querySelector('.t-cmd');
    const originalCmdText = lastLineCmd ? (lastLineCmd.textContent || '') : '';
    const cursor = lastLine.querySelector('.t-cursor');

    let pendingRestartId = null;

    function runAnimation() {
      pendingRestartId = null;

      // 1. Reset state
      lines.forEach(line => line.style.opacity = '0');
      if (lastLineCmd) lastLineCmd.textContent = '';
      if (cursor) cursor.style.display = 'none';

      // 2. Animate lines
      let cumulativeDelay = 500;
      lines.forEach((line, index) => {
        setTimeout(() => {
          line.style.transition = 'opacity 0.4s ease';
          line.style.opacity = '1';

          // 3. Type last line
          if (index === lines.length - 1 && lastLineCmd && originalCmdText) {
            if (cursor) cursor.style.display = 'inline-block';
            let charIndex = 0;
            const type = () => {
              if (charIndex < originalCmdText.length) {
                lastLineCmd.textContent += originalCmdText[charIndex];
                charIndex++;
                setTimeout(type, typeSpeed);
              }
            };
            setTimeout(type, 300);
          }
        }, cumulativeDelay += lineDelay);
      });

      // 4. Schedule restart — cancelled if terminal leaves viewport
      pendingRestartId = setTimeout(runAnimation, cumulativeDelay + restartDelay);
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      lines.forEach(line => line.style.opacity = '0');

      const terminalEl = terminalBody.closest('.hero__terminal') || terminalBody;
      if ('IntersectionObserver' in window) {
        const termIO = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (!entry.isIntersecting) {
              clearTimeout(pendingRestartId);
              pendingRestartId = null;
            } else if (pendingRestartId === null) {
              runAnimation();
            }
          });
        }, { threshold: 0.1 });
        termIO.observe(terminalEl);
      } else {
        runAnimation();
      }
    }
  }
  initTerminalAnimation();

  /* ============================================================
     9. SMOOTH SCROLL for anchor links
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
      // Move focus for skip-link and other programmatic targets
      if (target.hasAttribute('tabindex')) {
        setTimeout(() => target.focus({ preventScroll: true }), 450);
      }
    });
  });

})();
