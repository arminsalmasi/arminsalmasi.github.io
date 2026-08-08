document.addEventListener('DOMContentLoaded', () => {
    // 1. Current Date in Tmux Status Bar
    const dateEl = document.getElementById('current-date');
    if (dateEl) {
        const now = new Date();
        const options = { year: 'numeric', month: 'short', day: '2-digit' };
        dateEl.textContent = now.toLocaleDateString('en-US', options);
    }

    // 2. Robotic Typewriter Effect
    const titles = [
        "Software Engineer & Model Developer @ Thermo-Calc",
        "Computational Materials Scientist (Ph.D. KTH)",
        "Agentic AI & Multi-Agent Orchestration Architect",
        "MLIP Fine-Tuning (MACE, Meta's UMA, FAIRChem)",
        "High-Performance Computing & Scientific Simulation"
    ];

    const typewriterEl = document.getElementById('typewriter');
    let titleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 65;

    function runTypewriter() {
        if (!typewriterEl) return;

        const currentText = titles[titleIdx];

        if (isDeleting) {
            typewriterEl.textContent = currentText.substring(0, charIdx - 1);
            charIdx--;
            typingSpeed = 30;
        } else {
            typewriterEl.textContent = currentText.substring(0, charIdx + 1);
            charIdx++;
            typingSpeed = 60;
        }

        if (!isDeleting && charIdx === currentText.length) {
            typingSpeed = 2200; // Pause when title is fully typed
            isDeleting = true;
        } else if (isDeleting && charIdx === 0) {
            isDeleting = false;
            titleIdx = (titleIdx + 1) % titles.length;
            typingSpeed = 400; // Pause before typing next title
        }

        setTimeout(runTypewriter, typingSpeed);
    }

    runTypewriter();

    // 3. Interactive Tmux Tabs with Scroll Spy
    const tabs = document.querySelectorAll('.tmux-tab');
    const sections = document.querySelectorAll('.tmux-pane');
    const activeTabStatus = document.querySelector('.seg-active-tab');

    // Click handler for tabs
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            
            const tabText = tab.textContent.trim();
            if (activeTabStatus) {
                activeTabStatus.innerHTML = `<i class="fas fa-window-restore"></i> ${tabText}*`;
            }
        });
    });

    // Scroll spy for panes
    window.addEventListener('scroll', () => {
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 140;
            if (window.pageYOffset >= sectionTop) {
                currentSectionId = section.getAttribute('id');
            }
        });

        if (currentSectionId) {
            tabs.forEach(tab => {
                tab.classList.remove('active');
                if (tab.getAttribute('href') === `#${currentSectionId}`) {
                    tab.classList.add('active');
                    const tabText = tab.textContent.trim();
                    if (activeTabStatus) {
                        activeTabStatus.innerHTML = `<i class="fas fa-window-restore"></i> ${tabText}*`;
                    }
                }
            });
        }
    });

    // 4. Certification Category Filter
    const filterButtons = document.querySelectorAll('.filter-btn');
    const certBoxes = document.querySelectorAll('.cert-box');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            certBoxes.forEach(box => {
                if (filter === 'all') {
                    box.classList.remove('hidden');
                } else {
                    const category = box.getAttribute('data-category');
                    if (category === filter) {
                        box.classList.remove('hidden');
                    } else {
                        box.classList.add('hidden');
                    }
                }
            });
        });
    });
});
