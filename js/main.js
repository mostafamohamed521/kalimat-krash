// ============================================
// KALIMAT CRASH — main.js
// Splash screen entry point
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    // Fade in
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    requestAnimationFrame(() => {
        setTimeout(() => { document.body.style.opacity = '1'; }, 80);
    });

    const btn = document.getElementById('startGameBtn');
    if (btn) {
        btn.addEventListener('click', () => {
            document.body.style.opacity = '0';
            document.body.style.transition = 'opacity 0.35s ease';
            setTimeout(() => { window.location.href = 'map.html'; }, 300);
        });
    }
});