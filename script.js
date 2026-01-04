// Language switcher functionality
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
    });
});

// Smooth scroll for "Straight to the case" button
document.querySelector('.case-button-dark')?.addEventListener('click', () => {
    document.querySelector('#case-cta')?.scrollIntoView({ behavior: 'smooth' });
});

// Smooth scroll for "View outcome" button
document.querySelector('.case-button-cta')?.addEventListener('click', () => {
    document.querySelector('#results-impact')?.scrollIntoView({ behavior: 'smooth' });
});

