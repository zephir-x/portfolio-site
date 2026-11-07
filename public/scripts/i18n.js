class I18nService {
    constructor() {
        // We check the saved language or select one from the browser (default is 'en')
        this.currentLang = localStorage.getItem('app_lang') || (navigator.language.startsWith('pl') ? 'pl' : 'en');
        this.translations = {};
        
        this.init();
    }

    async init() {
        await this.loadTranslations(this.currentLang);
        this.setupSwitcher();
        this.updateStaticDOM();
    }

    async loadTranslations(lang) {
        try {
            // We download the file containing the site's static text (navbar, headings, footer)
            const response = await fetch(`/locales/${lang}.json`);
            this.translations = await response.json();
        } catch (error) {
            console.error(`Błąd ładowania tłumaczeń dla ${lang}:`, error);
        }
    }

    async setLanguage(lang) {
        if (lang === this.currentLang) return;
        
        this.currentLang = lang;
        localStorage.setItem('app_lang', lang);
        
        await this.loadTranslations(lang);
        this.updateStaticDOM();
        
        // A Custom Event to let main.js know that the JSON data (projects, certificates) needs to be re-rendered
        window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
    }

    updateStaticDOM() {
        // Finds all elements with a data-i18n attribute and replaces their text
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translation = key.split('.').reduce((obj, i) => obj ? obj[i] : null, this.translations);
            
            if (translation) {
                // If the element is an input/textarea, we replace the placeholder; otherwise, we replace the innerHTML/textContent
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translation;
                } else {
                    el.innerHTML = translation;
                }
            }
        });
    }

    setupSwitcher() {
        const switcher = document.getElementById('lang-switcher');
        if (!switcher) return;

        const btns = switcher.querySelectorAll('.switch-btn');

        if (this.currentLang === 'pl') {
            switcher.classList.add('pl-active');
        }

        btns.forEach(b => b.classList.remove('active'));
        
        const activeBtn = switcher.querySelector(`[data-lang="${this.currentLang}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        btns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const lang = e.target.dataset.lang;
                if (lang === this.currentLang) return;

                // 1. A quick look at the visual change to the indicator (instantaneous)
                btns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                if (lang === 'pl') {
                    switcher.classList.add('pl-active');
                } else {
                    switcher.classList.remove('pl-active');
                }

                // 2. Applying animation classes – the page begins to fade and blur
                document.body.classList.add('lang-transitioning');

                // 3. We wait 260ms (a duration matched to a fast CSS fade-out)
                setTimeout(async () => {
                    // Exchange of texts
                    await this.setLanguage(lang);
                    
                    // We remove the class -> the browser will smoothly apply a 0.8s blur fade from the base CSS styles
                    requestAnimationFrame(() => {
                        document.body.classList.remove('lang-transitioning');
                        window.dispatchEvent(new Event('resize'));
                        
                        // Adjust the position of the yellow nav-pill in case the new text in the navigation changes its width
                        const activeLink = document.querySelector('.nav-links a.active');
                        if (activeLink && typeof movePill === 'function') {
                            movePill(activeLink);
                        }
                    });
                }, 260);
            });
        });
    }
}

// Instance initialization
window.i18n = new I18nService();