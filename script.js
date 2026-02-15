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

// Slider functionality - только для мобильных устройств
function isMobile() {
    return window.innerWidth <= 768;
}

function initSlider(container) {
    const track = container.querySelector('.slider-track');
    const slides = container.querySelectorAll('.slider-slide');
    const dotsContainer = container.querySelector('.slider-dots');
    
    if (!track || slides.length === 0 || !dotsContainer) return;
    
    // Если не мобильное устройство, сбрасываем стили слайдера и показываем все картинки
    if (!isMobile()) {
        track.style.transform = 'none';
        track.style.display = 'flex';
        track.style.flexWrap = 'wrap';
        track.style.gap = '8px';
        track.style.justifyContent = 'center';
        dotsContainer.innerHTML = '';
        
        // Убеждаемся, что все слайды видны на десктопе
        slides.forEach((slide, index) => {
            slide.style.display = 'flex';
            slide.style.flex = '1 1 0';
            slide.style.minWidth = '0';
            slide.style.maxWidth = '290px';
            slide.style.flexBasis = 'auto';
        });
        return;
    }
    
    let currentSlide = 0;
    const totalSlides = slides.length;
    
    // Убеждаемся, что все слайды видны
    slides.forEach((slide, index) => {
        slide.style.display = 'flex';
        slide.style.flex = '0 0 100%';
    });
    
    // Очищаем точки перед созданием новых
    dotsContainer.innerHTML = '';
    
    // Create dots для всех слайдов
    for (let index = 0; index < totalSlides; index++) {
        const dot = document.createElement('button');
        dot.className = 'slider-dot';
        if (index === 0) dot.classList.add('active');
        dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    }
    
    const dots = dotsContainer.querySelectorAll('.slider-dot');
    
    function updateSlider() {
        // Убеждаемся, что все слайды видны
        slides.forEach((slide, index) => {
            slide.style.display = 'flex';
            slide.style.flex = '0 0 100%';
            slide.style.minWidth = '0';
        });
        
        const slideWidth = 100;
        track.style.transform = `translateX(-${currentSlide * slideWidth}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
    }
    
    function goToSlide(index) {
        if (index < 0 || index >= totalSlides) return;
        currentSlide = index;
        updateSlider();
    }
    
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
        } else {
            currentSlide = 0; // Зацикливаем
        }
        updateSlider();
    }
    
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
        } else {
            currentSlide = totalSlides - 1; // Зацикливаем
        }
        updateSlider();
    }
    
    // Initialize
    updateSlider();
    
    // Touch/swipe support
    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    
    // Удаляем старые обработчики, если они есть
    const oldTrack = track;
    const touchStartHandler = (e) => {
        if (!isMobile()) return;
        startX = e.touches[0].clientX;
        isDragging = true;
    };
    
    const touchMoveHandler = (e) => {
        if (!isMobile() || !isDragging) return;
        currentX = e.touches[0].clientX;
    };
    
    const touchEndHandler = () => {
        if (!isMobile() || !isDragging) return;
        isDragging = false;
        
        const diffX = startX - currentX;
        const threshold = 50;
        
        if (Math.abs(diffX) > threshold) {
            if (diffX > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
        }
    };
    
    // Добавляем обработчики
    track.addEventListener('touchstart', touchStartHandler, { passive: true });
    track.addEventListener('touchmove', touchMoveHandler, { passive: true });
    track.addEventListener('touchend', touchEndHandler, { passive: true });
}

function initSliders() {
    document.querySelectorAll('.slider-container').forEach(container => {
        initSlider(container);
    });
}

// Initialize all sliders when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    initSliders();
});

// Reinitialize on resize (если перешли с мобильного на десктоп или наоборот)
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
        initSliders();
    }, 250);
});