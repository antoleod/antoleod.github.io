
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 1000,
        once: true,
        offset: 50
    });

    const langManager = new LanguageManager();
    const formHandler = new FormHandler();
});

class LanguageManager {
    constructor() {
        this.currentLang = localStorage.getItem('oryxen_lang') || 'en';
        this.elements = document.querySelectorAll('[data-i18n]');
        this.init();
    }

    init() {
        this.updateContent();
        this.bindEvents();
    }

    bindEvents() {
        const toggles = document.querySelectorAll('.lang-toggle');
        toggles.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                this.setLanguage(lang);
            });
        });
    }

    setLanguage(lang) {
        this.currentLang = lang;
        localStorage.setItem('oryxen_lang', lang);
        this.updateContent();

        // Update active state of buttons
        document.querySelectorAll('.lang-toggle').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });
    }

    updateContent() {
        this.elements.forEach(el => {
            const key = el.dataset.i18n;
            const text = translations[this.currentLang][key];

            if (text) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = text;
                } else {
                    el.textContent = text;
                }
            }
        });

        // Dispatch event for other components if needed
        document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: this.currentLang } }));
    }
}

class FormHandler {
    constructor() {
        this.form = document.querySelector('form');
        if (this.form) {
            this.bindEvents();
        }
    }

    bindEvents() {
        this.form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = this.form.querySelector('button');
            const originalText = btn.textContent;

            // Get current translations for status messages
            const lang = localStorage.getItem('oryxen_lang') || 'en';
            const t = translations[lang];

            btn.disabled = true;
            btn.textContent = t.sending;

            try {
                const data = new FormData(this.form);
                const response = await fetch(this.form.action, {
                    method: 'POST',
                    body: data,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    btn.textContent = t.sent;
                    this.form.reset();
                    setTimeout(() => {
                        btn.disabled = false;
                        btn.textContent = originalText;
                    }, 3000);
                } else {
                    throw new Error('Network response was not ok');
                }
            } catch (error) {
                btn.textContent = t.error;
                setTimeout(() => {
                    btn.disabled = false;
                    btn.textContent = originalText;
                }, 3000);
            }
        });
    }
}
