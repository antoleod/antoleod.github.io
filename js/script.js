(() => {
  const prefersReducedMotion =
    window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false;

  const onReady = (fn) => {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', fn, { once: true });
    } else {
      fn();
    }
  };

  const getStoredLang = () => {
    try {
      return localStorage.getItem('oryxen-lang');
    } catch {
      return null;
    }
  };

  const setStoredLang = (lang) => {
    try {
      localStorage.setItem('oryxen-lang', lang);
    } catch {
      /* ignore */
    }
  };

  const normalizeLang = (lang) => (lang || '').toLowerCase().slice(0, 2);

  const getLocales = () => window.ORYXEN_LOCALES || null;

  const applyTranslations = (lang) => {
    const locales = getLocales();
    if (!locales) return;

    const safeLang = locales[lang] ? lang : locales.en ? 'en' : Object.keys(locales)[0];
    const dict = locales[safeLang] || {};
    document.documentElement.lang = safeLang;

    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.getAttribute('data-i18n') || '';
      if (!key) return;
      const value = dict[key];
      if (typeof value === 'string') el.textContent = value;
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const key = el.getAttribute('data-i18n-placeholder') || '';
      if (!key) return;
      const value = dict[key];
      if (typeof value === 'string') el.setAttribute('placeholder', value);
    });

    const langButtons = document.querySelectorAll('.lang__btn');
    langButtons.forEach((btn) => {
      const isActive = btn instanceof HTMLElement && btn.dataset.lang === safeLang;
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });
  };

  const detectLang = () => {
    const locales = getLocales();
    if (!locales) return 'en';

    const stored = normalizeLang(getStoredLang());
    if (stored && locales[stored]) return stored;

    const browser = normalizeLang(navigator.language);
    if (browser && locales[browser]) return browser;

    return locales.en ? 'en' : Object.keys(locales)[0];
  };

  const initI18n = () => {
    const locales = getLocales();
    if (!locales) return;

    const setLang = (lang) => {
      const safe = normalizeLang(lang);
      applyTranslations(safe);
      setStoredLang(safe);
    };

    setLang(detectLang());

    document.querySelectorAll('.lang__btn').forEach((btn) => {
      btn.addEventListener('click', () => setLang(btn.dataset.lang || 'en'));
    });
  };

  const initNav = () => {
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    const navLinks = document.querySelectorAll('.nav__link');
    let lastFocused = null;

    const overlay =
      document.querySelector('.nav-overlay') ||
      (() => {
        const el = document.createElement('div');
        el.className = 'nav-overlay';
        el.setAttribute('aria-hidden', 'true');
        document.body.appendChild(el);
        return el;
      })();

    const getFocusable = () => {
      if (!navMenu) return [];
      return Array.from(
        navMenu.querySelectorAll(
          'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex=\"-1\"])'
        )
      ).filter((el) => el instanceof HTMLElement && !el.hasAttribute('disabled'));
    };

    const setMenuOpen = (isOpen, { focus = true } = {}) => {
      if (!navMenu || !navToggle) return;

      navMenu.classList.toggle('show-menu', isOpen);
      navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      navMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
      if ('inert' in navMenu) navMenu.inert = !isOpen;
      overlay.classList.toggle('visible', isOpen);

      if (isOpen) {
        lastFocused = document.activeElement;
        document.body.style.overflow = 'hidden';
        if (focus) (getFocusable()[0] || navMenu).focus?.();
      } else {
        document.body.style.overflow = '';
        if (focus && lastFocused instanceof HTMLElement) lastFocused.focus();
      }
    };

    if (navToggle) {
      navToggle.addEventListener('click', () => setMenuOpen(true));
    }
    if (navClose) {
      navClose.addEventListener('click', () => setMenuOpen(false));
    }
    navLinks.forEach((link) => link.addEventListener('click', () => setMenuOpen(false, { focus: false })));
    overlay.addEventListener('click', () => setMenuOpen(false));

    document.addEventListener('keydown', (event) => {
      const isOpen = !!navMenu?.classList.contains('show-menu');

      if (event.key === 'Escape') setMenuOpen(false);

      if (!isOpen || event.key !== 'Tab') return;
      const focusables = getFocusable();
      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && active === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && active === last) {
        event.preventDefault();
        first.focus();
      }
    });

    setMenuOpen(false, { focus: false });
  };

  const initHeaderScroll = () => {
    const header = document.querySelector('.header');
    if (!header) return;

    const update = () => {
      header.classList.toggle('header-scrolled', window.scrollY >= 60);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
  };

  const initActiveLinks = () => {
    const navLinks = Array.from(document.querySelectorAll('.nav__link'));
    const sections = Array.from(document.querySelectorAll('section[id]'));
    if (!navLinks.length || !sections.length) return;

    if (!('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.getAttribute('id');
          if (!id) return;
          navLinks.forEach((link) => {
            const href = link.getAttribute('href') || '';
            link.classList.toggle('active-link', href.includes(`#${id}`));
          });
        });
      },
      { threshold: 0.45 }
    );

    sections.forEach((section) => observer.observe(section));
  };

  const initReveal = () => {
    const revealTargets = document.querySelectorAll('.section[data-reveal]');
    if (!revealTargets.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealTargets.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.2, rootMargin: '0px 0px -10% 0px' }
    );

    revealTargets.forEach((el) => observer.observe(el));
  };

  const initBackToTop = () => {
    const backToTopButton = document.querySelector('.back-to-top');
    if (!backToTopButton) return;

    const update = () => {
      backToTopButton.classList.toggle('visible', window.scrollY > 320);
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
  };

  const initContactForm = () => {
    const form = document.querySelector('.contact__form');
    const formStatus = document.querySelector('.form-status');
    if (!form || !formStatus) return;

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const action = form.getAttribute('action') || '';
      const data = new FormData(form);

      if (action.startsWith('mailto:')) {
        const to = action.replace('mailto:', '');
        const name = String(data.get('name') || 'ORYXEN contact');
        const email = String(data.get('email') || '');
        const idea = String(data.get('idea') || '');
        const subject = encodeURIComponent(`Project idea — ${name}`);
        const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nIdea:\n${idea}`);
        formStatus.textContent = 'Opening your email client...';
        window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
        return;
      }

      formStatus.textContent = 'Sending...';
      try {
        const response = await fetch(action, {
          method: form.method || 'POST',
          body: data,
          headers: { Accept: 'application/json' },
        });
        if (response.ok) {
          formStatus.textContent = 'Thank you. We will respond within one business day.';
          form.reset();
        } else {
          formStatus.textContent = 'We could not send the form. Please email contact@oryxen.tech.';
        }
      } catch {
        formStatus.textContent = 'Connection issue. Please email contact@oryxen.tech.';
      }
    });
  };

  const initTheme = () => {
    const themeToggle = document.getElementById('theme-toggle');
    if (!themeToggle) return;

    const getSystemTheme = () =>
      window.matchMedia?.('(prefers-color-scheme: light)')?.matches ? 'light' : 'dark';

    const html = document.documentElement;
    try {
      const savedTheme = localStorage.getItem('oryxen-theme');
      if (savedTheme === 'light' || savedTheme === 'dark') {
        html.setAttribute('data-theme', savedTheme);
      }
    } catch {
      /* ignore */
    }

    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme') || getSystemTheme();
      const next = current === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', next);
      try {
        localStorage.setItem('oryxen-theme', next);
      } catch {
        /* ignore */
      }
    });
  };

  onReady(() => {
    initI18n();
    initTheme();
    initNav();
    initHeaderScroll();
    initActiveLinks();
    initReveal();
    initBackToTop();
    initContactForm();
  });
})();
