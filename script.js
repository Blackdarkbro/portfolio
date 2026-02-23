// i18n система
const translations = {};
let currentLang = localStorage.getItem('lang') || 'en';

async function loadTranslations(lang) {
    if (!translations[lang]) {
        try {
            const response = await fetch(`locales/${lang}.json`);
            if (!response.ok) throw new Error('Translation file not found');
            translations[lang] = await response.json();
        } catch (error) {
            console.error(`Failed to load translations for ${lang}:`, error);
            return {};
        }
    }
    return translations[lang];
}

async function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    
    const t = await loadTranslations(lang);
    
    // Обновить все элементы с data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.dataset.i18n;
        if (t[key]) {
            // Заменить \n на <br> для переносов строк
            el.innerHTML = t[key].replace(/\n/g, '<br>');
        }
    });
    
    // Обновить lang атрибут у html
    document.documentElement.lang = lang;
    
    // Обновить title страницы, если есть перевод
    if (t['case.page.title']) {
        document.title = t['case.page.title'];
    }
    
    // Обновить активную кнопку
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    const scrollTopBtn = document.querySelector('.footer-scroll-top');
    if (scrollTopBtn && t['footer.scrollTop']) {
        scrollTopBtn.setAttribute('aria-label', t['footer.scrollTop']);
        scrollTopBtn.setAttribute('title', t['footer.scrollTop']);
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', async () => {
    // Загрузить сохранённый язык или использовать язык по умолчанию
    await setLanguage(currentLang);
    
    // Слушатели для кнопок переключения языка
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            setLanguage(btn.dataset.lang);
        });
    });
});

// Smooth scroll для кнопок (если они есть на странице)
document.querySelector('.case-button-dark')?.addEventListener('click', () => {
    document.querySelector('#case-cta')?.scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.case-button-cta')?.addEventListener('click', () => {
    document.querySelector('#results-impact')?.scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.footer-scroll-top')?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});