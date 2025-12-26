// ORYXEN TECH — Interactions: navigation, reveal, contact form, i18n

document.addEventListener('DOMContentLoaded', () => {
  const navMenu = document.getElementById('nav-menu');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navLinks = document.querySelectorAll('.nav__link');
  const header = document.querySelector('.header');
  const langButtons = document.querySelectorAll('.lang__btn');
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const closeMenu = () => navMenu && navMenu.classList.remove('show-menu');

  if (navToggle) navToggle.addEventListener('click', () => navMenu && navMenu.classList.add('show-menu'));
  if (navClose) navClose.addEventListener('click', closeMenu);
  navLinks.forEach(link => link.addEventListener('click', closeMenu));

  window.addEventListener('scroll', () => {
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

  const revealTargets = document.querySelectorAll('.section[data-reveal]');
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
      if (window.scrollY > 320) {
        backToTopButton.classList.add('visible');
      } else {
        backToTopButton.classList.remove('visible');
      }
    });
  }

  // Simple i18n setup
  const translations = {
    en: {
      'nav.overview': 'Overview',
      'nav.about': 'About',
      'nav.approach': 'Our Approach',
      'nav.create': 'What We Create',
      'nav.contact': 'Contact',
      'nav.cta': 'Tell us your idea',
      'hero.eyebrow': 'Quietly Engineering Bold Futures.',
      'hero.title': 'Technology with purpose, delivered with calm precision.',
      'hero.subtitle': 'ORYXEN TECH listens, designs, and builds digital solutions for teams that need clarity and continuity. Over 10 years in Belgium and Europe, supporting technical and non-technical leaders with a human touch.',
      'hero.stat1.label': 'Experience',
      'hero.stat1.value': '10+ years',
      'hero.stat1.hint': 'IT specialist in EU corporate environments.',
      'hero.stat2.label': 'Stack',
      'hero.stat2.value': 'M365 · Azure · Intune',
      'hero.stat2.hint': 'Windows 10/11, AD, ServiceNow, process optimization.',
      'hero.stat3.label': 'Approach',
      'hero.stat3.value': 'Human, calm',
      'hero.stat3.hint': 'We listen first, then build together.',
      'hero.cta.primary': 'Tell us your idea',
      'hero.cta.secondary': 'Let’s build it together',
      'hero.brand': 'Calm, precise, human.',
      'hero.panel.line1': '“Share your idea. We translate it into a roadmap, then build with care.”',
      'hero.panel.line2': 'No noise. No rush. Just engineering that respects people and time.',
      'hero.panel.status': 'Available for EU-based collaborations.',
      'about.eyebrow': 'About / Who We Are',
      'about.title': 'Engineering with purpose, grounded in real-world operations.',
      'about.subtitle': 'We operate at the intersection of technology and people. Every engagement starts with listening, translating needs into a calm plan, and staying close until the solution is stable and understood by everyone involved.',
      'about.card1.title': 'Human and consultative',
      'about.card1.text': 'We keep the language clear, guide decisions, and make space for leaders to think. Technical or not, you always know what is happening and why.',
      'about.card2.title': 'European experience',
      'about.card2.text': 'Based in Belgium, experienced across EU corporate and institutional environments with governance, privacy, and continuity at the center.',
      'about.card3.title': '10+ years in the field',
      'about.card3.text': 'Applications, web platforms, ServiceNow optimization, Microsoft 365, Azure, Intune, Windows 10/11, and Active Directory.',
      'approach.eyebrow': 'Our Approach',
      'approach.title': 'A calm, transparent path from idea to long-term support.',
      'approach.subtitle': 'No need to arrive with the perfect brief. We shape it together, then build and support it with steady hands.',
      'approach.step1.title': 'You share your idea',
      'approach.step1.text': 'We listen, capture context, and surface constraints early.',
      'approach.step2.title': 'We listen & advise',
      'approach.step2.text': 'Clear guidance on feasibility, options, and risks.',
      'approach.step3.title': 'We design together',
      'approach.step3.text': 'Co-create the blueprint so every stakeholder is aligned.',
      'approach.step4.title': 'We build with care',
      'approach.step4.text': 'Iterative delivery with documentation and calm communication.',
      'approach.step5.title': 'We support long-term',
      'approach.step5.text': 'Runbooks, training, and responsive support to keep it steady.',
      'create.eyebrow': 'What We Create',
      'create.title': 'Digital products and platforms that stay reliable.',
      'create.subtitle': 'From first sketch to live operations, we build quietly and keep you informed.',
      'create.card1.title': 'Application development',
      'create.card1.text': 'Web and mobile applications built with governance, security, and user clarity from day one.',
      'create.card2.title': 'Website creation',
      'create.card2.text': 'Premium sites that explain complex value simply, ready for multilingual European audiences.',
      'create.card3.title': 'MVP & idea validation',
      'create.card3.text': 'Rapid prototypes to test ideas, gather feedback, and de-risk investment before full build.',
      'create.card4.title': 'Technical consulting',
      'create.card4.text': 'Architecture, governance, Microsoft 365, Azure, Intune, Windows 10/11, AD, and ServiceNow optimization.',
      'create.card5.title': 'Long-term support',
      'create.card5.text': 'Calm operations, documentation, and direct access to engineers who speak plainly.',
      'contact.eyebrow': 'Contact',
      'contact.title': 'Tell us your idea. We will listen, advise, and build it with you.',
      'contact.subtitle': 'No need for a perfect brief. Share where you are and what you want to achieve. We respond within one business day.',
      'contact.form.name': 'Name',
      'contact.form.email': 'Email',
      'contact.form.idea': 'Tell us about your idea',
      'contact.form.submit': 'Send message',
      'footer.line1': 'ORYXEN TECH — Quietly Engineering Bold Futures.',
      'footer.note': 'Technology with purpose. Calm support for bold ideas.'
    },
    fr: {
      'nav.overview': 'Accueil',
      'nav.about': 'À propos',
      'nav.approach': 'Notre approche',
      'nav.create': 'Ce que nous créons',
      'nav.contact': 'Contact',
      'nav.cta': 'Parlez-nous de votre idée',
      'hero.eyebrow': 'Quietly Engineering Bold Futures.',
      'hero.title': 'Une technologie intentionnelle, livrée avec calme et précision.',
      'hero.subtitle': 'ORYXEN TECH écoute, conçoit et construit des solutions digitales pour les équipes qui recherchent clarté et continuité. Plus de 10 ans en Belgique et en Europe, aux côtés de décideurs techniques et non techniques avec une approche humaine.',
      'hero.stat1.label': 'Expérience',
      'hero.stat1.value': '10+ ans',
      'hero.stat1.hint': 'Spécialiste IT en environnements corporate européens.',
      'hero.stat2.label': 'Stack',
      'hero.stat2.value': 'M365 · Azure · Intune',
      'hero.stat2.hint': 'Windows 10/11, AD, ServiceNow, optimisation des processus.',
      'hero.stat3.label': 'Approche',
      'hero.stat3.value': 'Humaine, posée',
      'hero.stat3.hint': 'On écoute d’abord, on construit ensemble ensuite.',
      'hero.cta.primary': 'Parlez-nous de votre idée',
      'hero.cta.secondary': 'Construisons-la ensemble',
      'hero.brand': 'Calme, précis, humain.',
      'hero.panel.line1': '« Partagez votre idée. Nous la traduisons en feuille de route, puis nous la construisons avec soin. »',
      'hero.panel.line2': 'Pas de bruit. Pas de précipitation. Une ingénierie qui respecte les personnes et le temps.',
      'hero.panel.status': 'Disponible pour des collaborations en Europe.',
      'about.eyebrow': 'À propos / Qui nous sommes',
      'about.title': 'Ingénierie avec intention, ancrée dans l’opérationnel.',
      'about.subtitle': 'Nous travaillons à l’intersection de la technologie et des personnes. Chaque mission commence par l’écoute, se traduit en plan calme, et nous restons proches jusqu’à ce que la solution soit stable et comprise de tous.',
      'about.card1.title': 'Humain et consultatif',
      'about.card1.text': 'Langage clair, décisions guidées, espace pour réfléchir. Qu’importe votre niveau technique, vous savez toujours ce qui se passe et pourquoi.',
      'about.card2.title': 'Expérience européenne',
      'about.card2.text': 'Basés en Belgique, expérience dans les environnements corporate et institutionnels européens avec gouvernance, confidentialité et continuité au centre.',
      'about.card3.title': '10+ ans sur le terrain',
      'about.card3.text': 'Applications, plateformes web, optimisation ServiceNow, Microsoft 365, Azure, Intune, Windows 10/11 et Active Directory.',
      'approach.eyebrow': 'Notre approche',
      'approach.title': 'Un chemin calme et transparent, de l’idée au support long terme.',
      'approach.subtitle': 'Vous n’avez pas besoin d’un brief parfait. Nous le façonnons ensemble, puis nous construisons et accompagnons avec régularité.',
      'approach.step1.title': 'Vous partagez votre idée',
      'approach.step1.text': 'Nous écoutons, recueillons le contexte et anticipons les contraintes.',
      'approach.step2.title': 'Nous écoutons et conseillons',
      'approach.step2.text': 'Clarté sur la faisabilité, les options et les risques.',
      'approach.step3.title': 'Nous concevons ensemble',
      'approach.step3.text': 'Co-créer le plan pour aligner chaque partie prenante.',
      'approach.step4.title': 'Nous construisons avec soin',
      'approach.step4.text': 'Livraison itérative, documentation et communication posée.',
      'approach.step5.title': 'Nous assurons le support',
      'approach.step5.text': 'Runbooks, formation et support réactif pour garder la stabilité.',
      'create.eyebrow': 'Ce que nous créons',
      'create.title': 'Des produits et plateformes digitales fiables dans la durée.',
      'create.subtitle': 'Du premier croquis à la mise en production, nous construisons avec discrétion et transparence.',
      'create.card1.title': 'Développement applicatif',
      'create.card1.text': 'Applications web et mobile avec gouvernance, sécurité et clarté utilisateur dès le départ.',
      'create.card2.title': 'Création de sites web',
      'create.card2.text': 'Sites premium qui rendent la valeur complexe simple, prêts pour des audiences multilingues européennes.',
      'create.card3.title': 'MVP & validation d’idées',
      'create.card3.text': 'Prototypes rapides pour tester, recueillir des retours et réduire les risques avant l’industrialisation.',
      'create.card4.title': 'Conseil technique',
      'create.card4.text': 'Architecture, gouvernance, Microsoft 365, Azure, Intune, Windows 10/11, AD et optimisation ServiceNow.',
      'create.card5.title': 'Support long terme',
      'create.card5.text': 'Opérations calmes, documentation et accès direct à des ingénieurs qui parlent simplement.',
      'contact.eyebrow': 'Contact',
      'contact.title': 'Parlez-nous de votre idée. Nous écouterons, conseillerons et construirons avec vous.',
      'contact.subtitle': 'Pas besoin d’un brief parfait. Dites-nous où vous en êtes et ce que vous voulez atteindre. Réponse sous un jour ouvrable.',
      'contact.form.name': 'Nom',
      'contact.form.email': 'Email',
      'contact.form.idea': 'Parlez-nous de votre idée',
      'contact.form.submit': 'Envoyer',
      'footer.line1': 'ORYXEN TECH — Quietly Engineering Bold Futures.',
      'footer.note': 'Technologie avec intention. Support calme pour des idées ambitieuses.'
    },
    es: {
      'nav.overview': 'Inicio',
      'nav.about': 'Quiénes somos',
      'nav.approach': 'Nuestro enfoque',
      'nav.create': 'Qué creamos',
      'nav.contact': 'Contacto',
      'nav.cta': 'Cuéntanos tu idea',
      'hero.eyebrow': 'Quietly Engineering Bold Futures.',
      'hero.title': 'Tecnología con propósito, entregada con calma y precisión.',
      'hero.subtitle': 'ORYXEN TECH escucha, diseña y construye soluciones digitales para equipos que necesitan claridad y continuidad. Más de 10 años en Bélgica y Europa, acompañando a líderes técnicos y no técnicos con un trato humano.',
      'hero.stat1.label': 'Experiencia',
      'hero.stat1.value': '10+ años',
      'hero.stat1.hint': 'Especialista IT en entornos corporativos europeos.',
      'hero.stat2.label': 'Stack',
      'hero.stat2.value': 'M365 · Azure · Intune',
      'hero.stat2.hint': 'Windows 10/11, AD, ServiceNow, optimización de procesos.',
      'hero.stat3.label': 'Enfoque',
      'hero.stat3.value': 'Humano, sereno',
      'hero.stat3.hint': 'Escuchamos primero, construimos contigo después.',
      'hero.cta.primary': 'Cuéntanos tu idea',
      'hero.cta.secondary': 'Construyámosla juntos',
      'hero.brand': 'Calma, precisión, cercanía.',
      'hero.panel.line1': '“Comparte tu idea. La traducimos en una hoja de ruta y la construimos con cuidado.”',
      'hero.panel.line2': 'Sin ruido. Sin prisas. Ingeniería que respeta a las personas y el tiempo.',
      'hero.panel.status': 'Disponibles para colaboraciones en Europa.',
      'about.eyebrow': 'Quiénes somos',
      'about.title': 'Ingeniería con propósito, anclada en la operación real.',
      'about.subtitle': 'Trabajamos donde se cruzan la tecnología y las personas. Escuchamos, convertimos la necesidad en un plan sereno y acompañamos hasta que todo esté estable y claro para todos.',
      'about.card1.title': 'Humano y consultivo',
      'about.card1.text': 'Lenguaje claro, decisiones guiadas y espacio para pensar. Seas técnico o no, siempre sabes qué pasa y por qué.',
      'about.card2.title': 'Experiencia europea',
      'about.card2.text': 'Con base en Bélgica, experiencia en entornos corporativos e institucionales de la UE con gobernanza, privacidad y continuidad como eje.',
      'about.card3.title': '10+ años en el terreno',
      'about.card3.text': 'Aplicaciones, plataformas web, optimización de ServiceNow, Microsoft 365, Azure, Intune, Windows 10/11 y Active Directory.',
      'approach.eyebrow': 'Nuestro enfoque',
      'approach.title': 'Un camino sereno y transparente, de la idea al soporte continuo.',
      'approach.subtitle': 'No necesitas un brief perfecto. Lo definimos juntos y luego construimos y cuidamos con constancia.',
      'approach.step1.title': 'Compartes tu idea',
      'approach.step1.text': 'Escuchamos, capturamos el contexto y anticipamos restricciones.',
      'approach.step2.title': 'Escuchamos y asesoramos',
      'approach.step2.text': 'Claridad sobre viabilidad, opciones y riesgos.',
      'approach.step3.title': 'Diseñamos contigo',
      'approach.step3.text': 'Co-creamos el plano para alinear a todos los involucrados.',
      'approach.step4.title': 'Construimos con cuidado',
      'approach.step4.text': 'Entrega iterativa, documentación y comunicación tranquila.',
      'approach.step5.title': 'Acompañamos a largo plazo',
      'approach.step5.text': 'Runbooks, formación y soporte ágil para mantener la estabilidad.',
      'create.eyebrow': 'Qué creamos',
      'create.title': 'Productos y plataformas digitales confiables a largo plazo.',
      'create.subtitle': 'Del primer boceto a la operación en vivo, construimos en silencio y con transparencia.',
      'create.card1.title': 'Desarrollo de aplicaciones',
      'create.card1.text': 'Aplicaciones web y móviles con gobernanza, seguridad y claridad de uso desde el inicio.',
      'create.card2.title': 'Creación de sitios web',
      'create.card2.text': 'Sitios premium que explican valor complejo de forma simple, listos para audiencias multilingües europeas.',
      'create.card3.title': 'MVP y validación de ideas',
      'create.card3.text': 'Prototipos rápidos para probar ideas, obtener feedback y reducir riesgo antes del despliegue completo.',
      'create.card4.title': 'Consultoría técnica',
      'create.card4.text': 'Arquitectura, gobernanza, Microsoft 365, Azure, Intune, Windows 10/11, AD y optimización de ServiceNow.',
      'create.card5.title': 'Soporte a largo plazo',
      'create.card5.text': 'Operación serena, documentación y acceso directo a ingenieros que hablan claro.',
      'contact.eyebrow': 'Contacto',
      'contact.title': 'Cuéntanos tu idea. Vamos a escuchar, asesorar y construir contigo.',
      'contact.subtitle': 'No necesitas un brief perfecto. Cuéntanos dónde estás y qué quieres lograr. Respondemos en un día hábil.',
      'contact.form.name': 'Nombre',
      'contact.form.email': 'Correo electrónico',
      'contact.form.idea': 'Cuéntanos tu idea',
      'contact.form.submit': 'Enviar mensaje',
      'footer.line1': 'ORYXEN TECH — Quietly Engineering Bold Futures.',
      'footer.note': 'Tecnología con propósito. Acompañamiento sereno para ideas ambiciosas.'
    }
  };

  const applyTranslations = (lang) => {
    const dict = translations[lang] || translations.en;
    document.documentElement.lang = lang;
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) el.textContent = dict[key];
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

  // Theme Toggle Logic
  const themeToggle = document.getElementById('theme-toggle');
  const html = document.documentElement;
  
  const getSystemTheme = () => window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  const savedTheme = localStorage.getItem('oryxen-theme');
  
  if (savedTheme) {
    html.setAttribute('data-theme', savedTheme);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme') || getSystemTheme();
      const next = current === 'light' ? 'dark' : 'light';
      html.setAttribute('data-theme', next);
      localStorage.setItem('oryxen-theme', next);
    });
  }
});
