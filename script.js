document.addEventListener('DOMContentLoaded', () => {
    // Set current year in footer
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Intersection Observer for scroll animations
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: stop observing once it has become visible
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Select all elements with the fade-in class
    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => {
        observer.observe(el);
    });

    // Interactive blobs following mouse slightly
    const blob1 = document.querySelector('.blob-1');
    const blob2 = document.querySelector('.blob-2');

    let isTicking = false;
    let mouseX = 0;
    let mouseY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!isTicking) {
            window.requestAnimationFrame(() => {
                const x = mouseX / window.innerWidth;
                const y = mouseY / window.innerHeight;

                if (blob1 && blob2) {
                    blob1.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
                    blob2.style.transform = `translate(-${x * 30}px, -${y * 30}px)`;
                }

                isTicking = false;
            });
            isTicking = true;
        }
    });
});
