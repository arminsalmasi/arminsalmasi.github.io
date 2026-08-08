document.addEventListener('DOMContentLoaded', () => {
    // Current Year
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // Robotic Typewriter Effect
    const phrases = [
        "Software Engineer & Model Developer",
        "Computational Materials Scientist",
        "Agentic AI & Multi-Agent Orchestration",
        "MLIP Fine-Tuning & High-Throughput Screening",
        "Ph.D. in Engineering Materials Science (KTH)"
    ];

    const typewriterEl = document.getElementById('typewriter');
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 70;

    function typeEffect() {
        if (!typewriterEl) return;

        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 35;
        } else {
            typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 65;
        }

        if (!isDeleting && charIndex === currentPhrase.length) {
            typingSpeed = 2200; // Pause at end of phrase
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            typingSpeed = 500; // Pause before next phrase
        }

        setTimeout(typeEffect, typingSpeed);
    }

    typeEffect();

    // Terminal Filter Logic for Certifications
    const filterButtons = document.querySelectorAll('.term-filter-btn');
    const certItems = document.querySelectorAll('.cert-cli-item');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterVal = btn.getAttribute('data-filter');

            certItems.forEach(item => {
                if (filterVal === 'all') {
                    item.classList.remove('hidden');
                } else {
                    const category = item.getAttribute('data-category');
                    if (category === filterVal) {
                        item.classList.remove('hidden');
                    } else {
                        item.classList.add('hidden');
                    }
                }
            });
        });
    });
});
