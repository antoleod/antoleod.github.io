// ORYXEN TECH — Interactions: navigation, reveal, contact form, i18n

const ORYXEN_LOCALES = {
  en: {
    'a11y.skip': 'Skip to content',
    'nav.overview': 'Overview',
    'nav.about': 'About',
    'nav.approach': 'Approach',
    'nav.create': 'Services',
    'nav.projects': 'Projects',
    'nav.contact': 'Contact',
    'nav.cta': 'Let\'s Talk',
    'nav.home': 'Home',
    'hero.eyebrow': 'Quietly engineering bold futures.',
    'hero.title': 'Calm, precise engineering for teams that need continuity.',
    'hero.subtitle': 'We listen, design, and build digital products that stay understandable and maintainable — supporting technical and non-technical leaders across Europe.',
    'hero.stat1.label': 'Experience',
    'hero.stat1.value': '10+ years',
    'hero.stat1.hint': 'Hands-on delivery in EU corporate environments.',
    'hero.stat2.label': 'Stack',
    'hero.stat2.value': 'M365 · Azure · Intune',
    'hero.stat2.hint': 'Windows 10/11, AD, ServiceNow, process optimization.',
    'hero.stat3.label': 'Approach',
    'hero.stat3.value': 'Human, calm',
    'hero.stat3.hint': 'We listen first, then build together.',
    'hero.cta.primary': 'Tell us your idea',
    'hero.cta.secondary': 'See how we work',
    'hero.brand': 'Calm, precise, human.',
    'hero.panel.line1': '“Share your idea. We translate it into a roadmap, then build with care.”',
    'hero.panel.line2': 'No noise. No rush. Just engineering that respects people and time.',
    'hero.panel.status': 'Available for EU-based collaborations.',
    'about.eyebrow': 'About / Who we are',
    'about.title': 'Engineering with purpose, grounded in real-world operations.',
    'about.subtitle': 'We operate at the intersection of technology and people. Every engagement starts with listening, translating needs into a calm plan, and staying close until the solution is stable and understood by everyone involved.',
    'about.card1.title': 'Human and consultative',
    'about.card1.text': 'We keep the language clear, guide decisions, and make space for leaders to think. Technical or not, you always know what is happening and why.',
    'about.card2.title': 'European experience',
    'about.card2.text': 'Based in Belgium, experienced across EU corporate and institutional environments with governance, privacy, and continuity at the center.',
    'about.card3.title': '10+ years in the field',
    'about.card3.text': 'Applications, web platforms, ServiceNow optimization, Microsoft 365, Azure, Intune, Windows 10/11, and Active Directory.',
    'approach.eyebrow': 'Our approach',
    'approach.title': 'A calm rhythm, designed for clarity and continuity.',
    'approach.subtitle': 'We keep delivery measured and transparent — reducing risk while keeping momentum.',
    'approach.step1.title': 'Listen',
    'approach.step1.text': 'Understand goals, constraints, and what “done” really means.',
    'approach.step2.title': 'Clarify',
    'approach.step2.text': 'Translate needs into an explicit scope, timeline, and trade-offs.',
    'approach.step3.title': 'Design',
    'approach.step3.text': 'Choose foundations that stay maintainable: security, governance, and UX.',
    'approach.step4.title': 'Build with care',
    'approach.step4.text': 'Iterative delivery with documentation and calm communication.',
    'approach.step5.title': 'Support long-term',
    'approach.step5.text': 'Runbooks, training, and steady support to keep systems stable.',
    'create.eyebrow': 'What we create',
    'create.title': 'Reliable digital products built to last.',
    'create.subtitle': 'From first sketch to calm operations, we build with transparency.',
    'create.card1.title': 'App development',
    'create.card1.text': 'Web and mobile apps with governance, security, and clarity from day one.',
    'create.card2.title': 'Website creation',
    'create.card2.text': 'Premium sites that explain complex value simply, ready for European audiences.',
    'create.card3.title': 'MVP & idea validation',
    'create.card3.text': 'Fast prototypes to test ideas, gather feedback, and reduce risk before full delivery.',
    'create.card4.title': 'Technical consulting',
    'create.card4.text': 'Architecture, governance, Microsoft 365, Azure, Intune, Windows 10/11, AD, and ServiceNow optimization.',
    'create.card5.title': 'Long-term support',
    'create.card5.text': 'Calm operations, documentation, and direct access to engineers who speak plainly.',
    'projects.eyebrow': 'Our projects',
    'projects.title': 'Featured projects',
    'projects.subtitle': 'A small selection of recent work and experiments.',
    'contact.eyebrow': 'Contact',
    'contact.title': 'Tell us your idea. We will listen, advise, and build it with you.',
    'contact.subtitle': 'No need for a perfect brief. Share where you are and what you want to achieve. We respond within one business day.',
    'contact.form.name': 'Name',
    'contact.form.email': 'Email',
    'contact.form.company': 'Company (optional)',
    'contact.form.idea': 'Tell us about your idea',
    'contact.form.submit': 'Send message',
    'contact.meta.responseTitle': 'Response time:',
    'contact.meta.responseText': 'within one business day.',
    'contact.meta.emailTitle': 'Email:',
    'contact.note': 'By sending, you agree we can contact you back about this request.',
    'footer.line1': 'ORYXEN TECH — Quietly engineering bold futures.',
    'footer.note': 'Technology with purpose. Calm support for bold ideas.',
    'pitch.title': 'Engineering the AI-First Ecosystem',
    'pitch.subtitle': 'We build scalable platforms that grow with the business, reducing technical debt and accelerating time-to-market.',
    'pitch.problem.eyebrow': 'The Problem',
    'pitch.problem.text': 'Businesses struggle to scale their digital infrastructure rapidly enough to meet modern demands. Legacy systems are slow, expensive to maintain, and lack the flexibility required for the AI era.',
    'pitch.solution.eyebrow': 'The Solution',
    'pitch.solution.text': 'ORYXEN provides a modular, AI-first development ecosystem. We build scalable platforms that grow with the business, reducing technical debt and accelerating time-to-market by 40%.',
    'pitch.traction.title': 'Traction & Projections',
    'pitch.traction.stat1.value': '40%',
    'pitch.traction.stat1.label': 'Faster Checkout',
    'pitch.traction.stat2.value': '15+',
    'pitch.traction.stat2.label': 'Enterprise Clients',
    'pitch.traction.stat3.value': '$2M',
    'pitch.traction.stat3.label': 'Pipeline Value',
    'pitch.next.title': 'Join the Future',
    'pitch.next.text': 'We are raising a seed round to accelerate our AI core development.',
    'pitch.cta': 'Request Pitch Deck'
  },
  es: {
    'a11y.skip': 'Saltar al contenido',
    'nav.overview': 'Resumen',
    'nav.about': 'Sobre nosotros',
    'nav.approach': 'Enfoque',
    'nav.create': 'Servicios',
    'nav.projects': 'Proyectos',
    'nav.contact': 'Contacto',
    'nav.cta': 'Hablemos',
    'nav.home': 'Inicio',
    'hero.eyebrow': 'Ingeniería silenciosa para futuros audaces.',
    'hero.title': 'Ingeniería serena y precisa para equipos que necesitan continuidad.',
    'hero.subtitle': 'Escuchamos, diseñamos y construimos productos digitales que siguen siendo entendibles y mantenibles — apoyando a líderes técnicos y no técnicos en Europa.',
    'hero.stat1.label': 'Experiencia',
    'hero.stat1.value': '10+ años',
    'hero.stat1.hint': 'Entrega práctica en entornos corporativos de la UE.',
    'hero.stat2.label': 'Stack',
    'hero.stat2.value': 'M365 · Azure · Intune',
    'hero.stat2.hint': 'Windows 10/11, AD, ServiceNow, optimización de procesos.',
    'hero.stat3.label': 'Enfoque',
    'hero.stat3.value': 'Humano, sereno',
    'hero.stat3.hint': 'Primero escuchamos, luego construimos juntos.',
    'hero.cta.primary': 'Cuéntanos tu idea',
    'hero.cta.secondary': 'Ver cómo trabajamos',
    'hero.brand': 'Sereno, preciso, humano.',
    'hero.panel.line1': '“Cuéntanos tu idea. La traducimos en un plan y construimos con cuidado.”',
    'hero.panel.line2': 'Sin ruido. Sin prisa. Ingeniería que respeta a las personas y el tiempo.',
    'hero.panel.status': 'Disponible para colaboraciones en la UE.',
    'about.eyebrow': 'Sobre nosotros / Quiénes somos',
    'about.title': 'Ingeniería con propósito, anclada en operaciones reales.',
    'about.subtitle': 'Trabajamos en la intersección entre tecnología y personas. Cada colaboración empieza escuchando, convirtiendo necesidades en un plan sereno y acompañando hasta que la solución sea estable y comprendida por todos.',
    'about.card1.title': 'Humano y consultivo',
    'about.card1.text': 'Hablamos claro, guiamos decisiones y dejamos espacio para pensar. Seas técnico o no, siempre sabes qué pasa y por qué.',
    'about.card2.title': 'Experiencia europea',
    'about.card2.text': 'Con base en Bélgica, experiencia en entornos corporativos e institucionales de la UE con gobernanza, privacidad y continuidad en el centro.',
    'about.card3.title': '10+ años en el terreno',
    'about.card3.text': 'Aplicaciones, plataformas web, optimización de ServiceNow, Microsoft 365, Azure, Intune, Windows 10/11 y Active Directory.',
    'approach.eyebrow': 'Nuestro enfoque',
    'approach.title': 'Un ritmo sereno, diseñado para claridad y continuidad.',
    'approach.subtitle': 'Entregas medidas y transparentes — reduciendo riesgo sin perder impulso.',
    'approach.step1.title': 'Escuchar',
    'approach.step1.text': 'Entender objetivos, límites y qué significa “terminado”.',
    'approach.step2.title': 'Aclarar',
    'approach.step2.text': 'Traducir necesidades a alcance, tiempos y trade-offs explícitos.',
    'approach.step3.title': 'Diseñar',
    'approach.step3.text': 'Bases mantenibles: seguridad, gobernanza y UX.',
    'approach.step4.title': 'Construir con cuidado',
    'approach.step4.text': 'Entrega iterativa con documentación y comunicación serena.',
    'approach.step5.title': 'Acompañar a largo plazo',
    'approach.step5.text': 'Runbooks, formación y soporte constante para mantener estabilidad.',
    'create.eyebrow': 'Qué creamos',
    'create.title': 'Productos digitales confiables, hechos para durar.',
    'create.subtitle': 'Del primer boceto a operaciones serenas, construimos con transparencia.',
    'create.card1.title': 'Desarrollo de apps',
    'create.card1.text': 'Apps web y móviles con gobernanza, seguridad y claridad desde el primer día.',
    'create.card2.title': 'Creación de sitios web',
    'create.card2.text': 'Sitios premium que explican valor complejo de forma simple, listos para audiencias europeas.',
    'create.card3.title': 'MVP y validación',
    'create.card3.text': 'Prototipos rápidos para validar ideas, recoger feedback y reducir riesgo.',
    'create.card4.title': 'Consultoría técnica',
    'create.card4.text': 'Arquitectura, gobernanza, Microsoft 365, Azure, Intune, Windows 10/11, AD y optimización de ServiceNow.',
    'create.card5.title': 'Soporte a largo plazo',
    'create.card5.text': 'Operación serena, documentación y acceso directo a ingenieros que hablan claro.',
    'projects.eyebrow': 'Nuestros proyectos',
    'projects.title': 'Proyectos destacados',
    'projects.subtitle': 'Una pequeña selección de trabajos y experimentos recientes.',
    'contact.eyebrow': 'Contacto',
    'contact.title': 'Cuéntanos tu idea. Escuchamos, asesoramos y construimos contigo.',
    'contact.subtitle': 'No necesitas un brief perfecto. Cuéntanos dónde estás y qué quieres lograr. Respondemos en un día hábil.',
    'contact.form.name': 'Nombre',
    'contact.form.email': 'Email',
    'contact.form.company': 'Empresa (opcional)',
    'contact.form.idea': 'Cuéntanos tu idea',
    'contact.form.submit': 'Enviar mensaje',
    'contact.meta.responseTitle': 'Respuesta:',
    'contact.meta.responseText': 'en 1 día hábil.',
    'contact.meta.emailTitle': 'Email:',
    'contact.note': 'Al enviar, aceptas que podamos contactarte sobre esta solicitud.',
    'footer.line1': 'ORYXEN TECH — Ingeniería silenciosa para futuros audaces.',
    'footer.note': 'Tecnología con propósito. Soporte sereno para ideas ambiciosas.',
    'pitch.title': 'Ingeniería del Ecosistema AI-First',
    'pitch.subtitle': 'Construimos plataformas escalables que crecen con el negocio, reduciendo deuda técnica y acelerando el time-to-market.',
    'pitch.problem.eyebrow': 'El Problema',
    'pitch.problem.text': 'Las empresas luchan por escalar su infraestructura digital lo suficientemente rápido. Los sistemas heredados son lentos, caros de mantener y carecen de la flexibilidad para la era de la IA.',
    'pitch.solution.eyebrow': 'La Solución',
    'pitch.solution.text': 'ORYXEN proporciona un ecosistema de desarrollo modular AI-first. Construimos plataformas escalables que reducen la deuda técnica y aceleran el time-to-market en un 40%.',
    'pitch.traction.title': 'Tracción y Proyecciones',
    'pitch.traction.stat1.label': 'Ciclos más rápidos',
    'pitch.traction.stat2.label': 'Clientes Enterprise',
    'pitch.traction.stat3.label': 'Valor en Pipeline',
    'pitch.next.title': 'Únete al Futuro',
    'pitch.next.text': 'Estamos levantando una ronda seed para acelerar nuestro núcleo de IA.',
    'pitch.cta': 'Solicitar Pitch Deck'
  },
  fr: {
    'a11y.skip': 'Aller au contenu',
    'nav.overview': 'Aperçu',
    'nav.about': 'À propos',
    'nav.approach': 'Approche',
    'nav.create': 'Services',
    'nav.projects': 'Projets',
    'nav.contact': 'Contact',
    'nav.cta': 'Discutons',
    'nav.home': 'Accueil',
    'hero.eyebrow': 'Ingénierie discrète pour des futurs audacieux.',
    'hero.title': 'Une ingénierie calme et précise pour les équipes qui exigent de la continuité.',
    'hero.subtitle': 'Nous écoutons, concevons et construisons des produits numériques compréhensibles et maintenables — au service de leaders techniques et non techniques en Europe.',
    'hero.stat1.label': 'Expérience',
    'hero.stat1.value': '10+ ans',
    'hero.stat1.hint': 'Livraison concrète dans des environnements corporate UE.',
    'hero.stat2.label': 'Stack',
    'hero.stat2.value': 'M365 · Azure · Intune',
    'hero.stat2.hint': 'Windows 10/11, AD, ServiceNow, optimisation des processus.',
    'hero.stat3.label': 'Approche',
    'hero.stat3.value': 'Humaine, calme',
    'hero.stat3.hint': 'Nous écoutons d’abord, puis nous construisons ensemble.',
    'hero.cta.primary': 'Parlez-nous de votre idée',
    'hero.cta.secondary': 'Voir notre méthode',
    'hero.brand': 'Calme, précise, humaine.',
    'hero.panel.line1': '« Partagez votre idée. Nous la transformons en feuille de route, puis nous construisons avec soin. »',
    'hero.panel.line2': 'Pas de bruit. Pas de précipitation. Une ingénierie qui respecte les personnes et le temps.',
    'hero.panel.status': 'Disponible pour des collaborations basées en UE.',
    'about.eyebrow': 'À propos / Qui nous sommes',
    'about.title': 'Une ingénierie avec intention, ancrée dans des opérations réelles.',
    'about.subtitle': 'Nous travaillons à l’intersection de la technologie et de l’humain. Chaque mission commence par l’écoute, traduit les besoins en plan calme, et reste proche jusqu’à ce que la solution soit stable et comprise par tous.',
    'about.card1.title': 'Humaine et consultative',
    'about.card1.text': 'Nous parlons clairement, guidons les décisions et laissons de l’espace pour réfléchir. Technique ou non, vous savez toujours ce qui se passe et pourquoi.',
    'about.card2.title': 'Expérience européenne',
    'about.card2.text': 'Basés en Belgique, expérimentés dans des environnements corporate et institutionnels UE, avec gouvernance, confidentialité et continuité au centre.',
    'about.card3.title': '10+ ans sur le terrain',
    'about.card3.text': 'Applications, plateformes web, optimisation ServiceNow, Microsoft 365, Azure, Intune, Windows 10/11 et Active Directory.',
    'approach.eyebrow': 'Notre approche',
    'approach.title': 'Un rythme calme, pensé pour la clarté et la continuité.',
    'approach.subtitle': 'Une livraison mesurée et transparente — moins de risque, sans perdre l’élan.',
    'approach.step1.title': 'Écouter',
    'approach.step1.text': 'Comprendre les objectifs, contraintes et la définition du “fait”.',
    'approach.step2.title': 'Clarifier',
    'approach.step2.text': 'Transformer les besoins en périmètre, délais et arbitrages explicites.',
    'approach.step3.title': 'Concevoir',
    'approach.step3.text': 'Choisir des fondations maintenables : sécurité, gouvernance et UX.',
    'approach.step4.title': 'Construire avec soin',
    'approach.step4.text': 'Livraison itérative, documentation et communication calme.',
    'approach.step5.title': 'Soutenir sur le long terme',
    'approach.step5.text': 'Runbooks, formation et support constant pour garder la stabilité.',
    'create.eyebrow': 'Ce que nous créons',
    'create.title': 'Des produits numériques fiables, pensés pour durer.',
    'create.subtitle': 'Du premier croquis à des opérations calmes, nous construisons avec transparence.',
    'create.card1.title': 'Développement d’apps',
    'create.card1.text': 'Apps web et mobiles avec gouvernance, sécurité et clarté dès le départ.',
    'create.card2.title': 'Création de sites web',
    'create.card2.text': 'Sites premium qui expliquent simplement une valeur complexe, prêts pour l’Europe.',
    'create.card3.title': 'MVP & validation',
    'create.card3.text': 'Prototypes rapides pour tester des idées, obtenir du feedback et réduire le risque.',
    'create.card4.title': 'Conseil technique',
    'create.card4.text': 'Architecture, gouvernance, Microsoft 365, Azure, Intune, Windows 10/11, AD et optimisation ServiceNow.',
    'create.card5.title': 'Support long terme',
    'create.card5.text': 'Opérations calmes, documentation et accès direct à des ingénieurs qui parlent simplement.',
    'projects.eyebrow': 'Nos projets',
    'projects.title': 'Projets sélectionnés',
    'projects.subtitle': 'Une petite sélection de travaux et d’expériences récentes.',
    'contact.eyebrow': 'Contact',
    'contact.title': 'Parlez-nous de votre idée. Nous écouterons, conseillerons et construirons avec vous.',
    'contact.subtitle': 'Pas besoin d’un brief parfait. Dites-nous où vous en êtes et ce que vous visez. Réponse sous un jour ouvré.',
    'contact.form.name': 'Nom',
    'contact.form.email': 'Email',
    'contact.form.company': 'Entreprise (optionnel)',
    'contact.form.idea': 'Parlez-nous de votre idée',
    'contact.form.submit': 'Envoyer',
    'contact.meta.responseTitle': 'Réponse :',
    'contact.meta.responseText': 'sous un jour ouvré.',
    'contact.meta.emailTitle': 'Email :',
    'contact.note': 'En envoyant, vous acceptez que nous puissions vous recontacter au sujet de cette demande.',
    'footer.line1': 'ORYXEN TECH — Ingénierie discrète pour des futurs audacieux.',
    'footer.note': 'Technologie avec intention. Un support calme pour des idées audacieuses.',
    'pitch.title': 'Ingénierie de l’Écosystème AI-First',
    'pitch.subtitle': 'Nous construisons des plateformes évolutives qui grandissent avec l’entreprise, réduisant la dette technique et accélérant le time-to-market.',
    'pitch.problem.eyebrow': 'Le Problème',
    'pitch.problem.text': 'Les entreprises peinent à faire évoluer leur infrastructure numérique assez vite. Les systèmes hérités sont lents, coûteux et manquent de flexibilité pour l’ère de l’IA.',
    'pitch.solution.eyebrow': 'La Solution',
    'pitch.solution.text': 'ORYXEN fournit un écosystème de développement modulaire AI-first. Nous construisons des plateformes évolutives qui réduisent la dette technique et accélèrent le time-to-market de 40%.',
    'pitch.traction.title': 'Traction et Projections',
    'pitch.traction.stat1.label': 'Cycles plus rapides',
    'pitch.traction.stat2.label': 'Clients Enterprise',
    'pitch.traction.stat3.label': 'Valeur Pipeline',
    'pitch.next.title': 'Rejoignez le Futur',
    'pitch.next.text': 'Nous levons un tour de table (seed) pour accélérer notre cœur IA.',
    'pitch.cta': 'Demander le Pitch Deck'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navOverlay = document.getElementById('nav-overlay');
  const navLinks = document.querySelectorAll('.nav__link');
  const header = document.querySelector('.header, .pitch-header');
  const langButtons = document.querySelectorAll('.lang__btn');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- Theme Toggle Logic ---
  const themeToggle = document.getElementById('theme-toggle');
  
  const setTheme = (theme) => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('oryxen-theme', theme);
  };

  // Check storage or system preference
  const savedTheme = localStorage.getItem('oryxen-theme');
  const systemTheme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  if (savedTheme) setTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      setTheme(current === 'light' ? 'dark' : 'light');
    });
  }

  let lastFocusedElement = null;
  const setMenuState = (open, { restoreFocus = true } = {}) => {
    if (!navMenu) return;
    navMenu.classList.toggle('show-menu', open);
    document.body.classList.toggle('no-scroll', open);
    if (navToggle) navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    if (navOverlay) {
      if (open) {
        navOverlay.hidden = false;
        requestAnimationFrame(() => navOverlay.classList.add('is-open'));
      } else {
        navOverlay.classList.remove('is-open');
        window.setTimeout(() => {
          if (navMenu && !navMenu.classList.contains('show-menu')) navOverlay.hidden = true;
        }, 320);
      }
    }
    if (open) {
      lastFocusedElement = document.activeElement;
      const firstLink = navMenu.querySelector('.nav__link');
      if (firstLink) firstLink.focus({ preventScroll: true });
    } else if (restoreFocus && lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus({ preventScroll: true });
      lastFocusedElement = null;
    } else if (!open) {
      lastFocusedElement = null;
    }
  };

  const closeMenu = (options) => setMenuState(false, options);

  if (navToggle) navToggle.addEventListener('click', () => setMenuState(true));

  if (navClose) navClose.addEventListener('click', closeMenu);
  if (navOverlay) navOverlay.addEventListener('click', closeMenu);
  navLinks.forEach(link => link.addEventListener('click', () => closeMenu({ restoreFocus: false })));

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    if (navMenu && navMenu.classList.contains('show-menu')) closeMenu();
  });

  window.addEventListener('scroll', () => {
    if (navMenu && navMenu.classList.contains('show-menu')) closeMenu({ restoreFocus: false });
    if (!header) return;
    if (window.scrollY >= 60) {
      header.classList.add('header-scrolled');
    } else {
      header.classList.remove('header-scrolled');
    }
  });

  const sections = document.querySelectorAll('section[id]');
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const id = entry.target.getAttribute('id');
      navLinks.forEach(link => {
        const isActive = link.getAttribute('href').includes(`#${id}`);
        link.classList.toggle('active-link', isActive);
      });
    });
  }, { threshold: 0.45 });
  sections.forEach(section => navObserver.observe(section));

  const revealTargets = document.querySelectorAll('[data-reveal]');
  if (!prefersReducedMotion) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2, rootMargin: '0px 0px -10% 0px' });
    revealTargets.forEach(el => revealObserver.observe(el));
  } else {
    revealTargets.forEach(el => el.classList.add('visible'));
  }

  const backToTopButton = document.querySelector('.back-to-top');
  if (backToTopButton) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 120) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });
  }

  // Parallax Grid Effect
  const updateParallax = () => {
    const scrolled = window.scrollY;
    document.body.style.backgroundPosition = `0px ${scrolled * 0.3}px`;
  };
  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax();

  // Simple i18n setup
  const translations = ORYXEN_LOCALES;

  const typeWriter = (el, text) => {
    // Clear existing interval if re-typing
    if (el.typingInterval) clearInterval(el.typingInterval);
    
    el.textContent = '';
    el.setAttribute('aria-label', text); // Accessibility
    let i = 0;
    
    el.typingInterval = setInterval(() => {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(el.typingInterval);
      }
    }, 35); // Typing speed in ms
  };

  const applyTranslations = (lang) => {
    const dict = translations[lang] || translations.en;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        if (key === 'hero.title') {
          typeWriter(el, dict[key]);
        } else {
          el.textContent = dict[key];
        }
      }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key]) el.setAttribute('placeholder', dict[key]);
    });
    langButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
  };

  const detectLang = () => {
    const stored = localStorage.getItem('oryxen-lang');
    if (stored && translations[stored]) return stored;
    const browser = navigator.language?.slice(0, 2).toLowerCase();
    if (translations[browser]) return browser;
    return 'en';
  };

  const setLang = (lang) => {
    applyTranslations(lang);
    localStorage.setItem('oryxen-lang', lang);
  };

  const initialLang = detectLang();
  setLang(initialLang);

  langButtons.forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });

  const form = document.querySelector('.contact__form');
  const formStatus = document.querySelector('.form-status');
  const submitButton = document.getElementById('submit-btn');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const action = form.getAttribute('action') || '';
      const data = new FormData(form);

      if (submitButton) {
        submitButton.classList.remove('is-success');
        submitButton.classList.add('is-loading');
        submitButton.disabled = true;
      }

      if (action.startsWith('mailto:')) {
        const to = action.replace('mailto:', '');
        const name = data.get('name') || 'ORYXEN contact';
        const email = data.get('email') || '';
        const company = data.get('company') || '';
        const idea = data.get('idea') || '';
        const subject = encodeURIComponent(`Project idea — ${name}`);
        const body = encodeURIComponent(
          `Name: ${name}\nEmail: ${email}\nCompany: ${company}\n\nIdea:\n${idea}`
        );
        if (formStatus) formStatus.textContent = 'Opening your email client...';
        if (submitButton) {
          submitButton.classList.remove('is-loading');
          submitButton.disabled = false;
        }
        window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
        return;
      }

      if (formStatus) formStatus.textContent = 'Sending...';
      try {
        const response = await fetch(action, {
          method: form.method,
          body: data,
          headers: { 'Accept': 'application/json' }
        });
        if (response.ok) {
          if (formStatus) formStatus.textContent = 'Thank you. We will respond within one business day.';
          form.reset();
          if (submitButton) submitButton.classList.add('is-success');
        } else {
          if (formStatus) formStatus.textContent = 'We could not send the form. Please email contact@oryxen.tech.';
        }
      } catch (error) {
        if (formStatus) formStatus.textContent = 'Connection issue. Please email contact@oryxen.tech.';
      } finally {
        if (submitButton) {
          submitButton.classList.remove('is-loading');
          submitButton.disabled = false;
        }
      }
    });
  }
});
