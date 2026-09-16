document.addEventListener('DOMContentLoaded', () => {
    // We initiate navbar and project loading after loading the DOM tree
    initNavbar();
    loadTimeline();
    loadSkills();
    loadProjects();
    loadCerts();
    initCursorGlow();
    initRevealAnimations();
});

function initNavbar() {
    const navLinks = document.querySelectorAll('.nav-links a');
    const pill = document.getElementById('nav-pill');

    let isClickScrolling = false;
    let scrollTimeout;

    function movePill(element) {
        if (!element) return;
        const rect = element.getBoundingClientRect();
        const parentRect = element.parentElement.getBoundingClientRect();

        pill.style.width = `${rect.width}px`;
        pill.style.transform = `translateX(${rect.left - parentRect.left}px)`;
        pill.style.opacity = '1';
    }

    // Startup initialization
    setTimeout(() => {
        movePill(document.querySelector('.nav-links a.active'));
    }, 100);

    // Click-to-move
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            isClickScrolling = true; // we block scrolling responses
            
            navLinks.forEach(l => l.classList.remove('active'));
            e.currentTarget.classList.add('active');
            movePill(e.currentTarget);
        });
    });

    // End-of-scroll detector (Debounce pattern)
    window.addEventListener('scroll', () => {
        if (isClickScrolling) {
            clearTimeout(scrollTimeout);
            // If for 100ms there was no scroll event, it means the page has stopped
            scrollTimeout = setTimeout(() => {
                isClickScrolling = false; // we unblock IntersectionObserver
            }, 100);
        }
    });

    window.addEventListener('resize', () => {
        movePill(document.querySelector('.nav-links a.active'));
    });

    // Tracking scroll
    const observer = new IntersectionObserver((entries) => {
        // If we just clicked and went down, we ignored the sections we passed
        if (isClickScrolling) return;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                const activeLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                
                if (activeLink) {
                    navLinks.forEach(l => l.classList.remove('active'));
                    activeLink.classList.add('active');
                    movePill(activeLink);
                }
            }
        });
    }, { threshold: 0.4 });

    document.querySelectorAll('section, footer').forEach(section => {
        observer.observe(section);
    });
}

async function loadTimeline() {
    try {
        const response = await fetch('/data/timeline.json');
        const timelineData = await response.json();
        renderTimeline(timelineData);
    } catch (error) {
        console.error('Error loading timeline:', error);
    }
}

function renderTimeline(data) {
    const grid = document.getElementById('timeline-grid');
    if (!grid) return;

    grid.innerHTML = data.map(item => `
        <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-card">
                <span class="timeline-date">${item.date}</span>
                <h3 class="timeline-title">${item.title}</h3>
                <p class="timeline-desc">${item.description}</p>
            </div>
        </div>
    `).join('');

    // We fire the scroll animations after the tiles are rendered
    initScrollAnimations();
}

async function loadSkills() {
    try {
        const response = await fetch('/data/skills.json');
        const skills = await response.json();
        renderSkills(skills);
    } catch (error) {
        console.error('Error loading skills:', error);
    }
}

function renderSkills(skills) {
    const grid = document.querySelector('.skills-grid');
    if (!grid) return;

    grid.innerHTML = skills.map(skill => `
        <div class="skill-item">
            <div class="glass-shine"></div> <i class="${skill.icon} skill-icon"></i>
            <span class="skill-name">${skill.name}</span>
        </div>
    `).join('');

    grid.querySelectorAll('.skill-item').forEach(initRevealElement);
}

async function loadProjects() {
    try {
        const response = await fetch('/data/projects.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const projects = await response.json();
        renderProjects(projects);
        
    } catch (error) {
        console.error('Error loading projects:', error);
        document.getElementById('projects-grid').innerHTML = 
            '<p class="error-msg">Failed to load projects. Please refresh the page.</p>';
    }
}

function renderProjects(projects) {
    const grid = document.getElementById('projects-grid');
    if (!grid) return;

    // We map the JSON array to a string with HTML code and inject it into the container
    grid.innerHTML = projects.map(project => `
        <article class="project-card">
            <div class="project-graphic-wrapper">
                <img src="${project.imageUrl}" alt="${project.title} screenshot" class="project-graphic" loading="lazy">
            </div>

            <div class="project-details">
                <div class="project-header-row">
                    <h3 class="project-title">${project.title}</h3>
                    
                    <a href="${project.githubUrl}" target="_blank" class="project-code-link">
                        VIEW CODE <i class="fa-brands fa-github ml-8"></i>
                    </a>
                </div>
                
                <p class="project-description">${project.description}</p>
                
                <div class="project-tags">
                    ${project.tags.map(tag => `<span class="project-tag">${tag}</span>`).join('')}
                </div>
            </div>
        </article>
    `).join('');

    grid.querySelectorAll('.project-card').forEach(initRevealElement);
}

async function loadCerts() {
    try {
        const response = await fetch('/data/certs.json');
        const certs = await response.json();
        renderCerts(certs);
    } catch (error) {
        console.error('Error loading certs:', error);
    }
}

function renderCerts(data) {
    const grid = document.getElementById('certs-grid');
    if (!grid) return;

    grid.innerHTML = data.map(cert => `
        <div class="cert-card">
            <div class="glass-shine"></div> <i class="${cert.icon} cert-watermark"></i>
            <div class="cert-content">
                <span class="cert-date">${cert.date}</span>
                <h3 class="cert-title">${cert.title}</h3>
                <p class="cert-issuer">${cert.issuer}</p>
            </div>
            <a href="${cert.verifyUrl}" target="_blank" class="cert-link">
                Verify <i class="fa-solid fa-arrow-right ml-8"></i>
            </a>
        </div>
    `).join('');

    grid.querySelectorAll('.cert-card').forEach(initRevealElement);
}

function initCursorGlow() {
    const cursorGlow = document.getElementById('cursor-glow');
    if (!cursorGlow) return;

    // Cursor tracking
    document.addEventListener('mousemove', (e) => {
        if (!cursorGlow.classList.contains('hidden')) {
            cursorGlow.style.opacity = '1';
        }
        
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    });

    // Event listeners for interactive elements to hide the glow
    document.body.addEventListener('mouseover', (e) => {
        // We check whether the element (or its parent) under the mouse matches the selector
        if (e.target.closest('a, button, .btn, .skill-item, .project-card, .cert-card, .contact-card, .navbar, .timeline-item, .hero-image')) {
            cursorGlow.classList.add('hidden');
        }
    });

    document.body.addEventListener('mouseout', (e) => {
        // If we move the mouse away from an interactive element, we restore the glow
        if (e.target.closest('a, button, .btn, .skill-item, .project-card, .cert-card, .contact-card, .navbar, .timeline-item, .hero-image')) {
            cursorGlow.classList.remove('hidden');
            cursorGlow.style.opacity = '1'; 
        }
    });
}

function initScrollAnimations() {
    // Observer for animating timeline elements
    const timelineObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If the element appears in the designated percentage on the screen
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
            } 
            // If the element disappears from the screen (scrolling up or down)
            else {
                entry.target.classList.remove('show');
            }
        });
    }, { 
        threshold: 0.2, // activate when 20% of the element is visible
        rootMargin: "0px 0px -50px 0px" // slight buffer from the bottom, so the animation triggers a bit earlier
    });

    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });
}

/* Scroll Reveal Animation */
const revealOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -30px 0px"
};

// Global observer instance for reveal animations
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            entry.target.classList.remove('reveal-hidden-top', 'reveal-hidden-bottom');
        } else {
            entry.target.classList.remove('reveal-visible');
            
            if (entry.boundingClientRect.y < 0) {
                entry.target.classList.add('reveal-hidden-top');
                entry.target.classList.remove('reveal-hidden-bottom');
            } else {
                entry.target.classList.add('reveal-hidden-bottom');
                entry.target.classList.remove('reveal-hidden-top');
            }
        }
    });
}, revealOptions);

function initRevealElement(el) {
    if (el.classList.contains('reveal-initialized')) return;
    
    el.classList.add('reveal-element', 'reveal-initialized');
    
    if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('reveal-hidden-bottom');
    } else {
        el.classList.add('reveal-visible');
    }
    
    scrollObserver.observe(el);
}

// Called once on DOMContentLoaded
function initRevealAnimations() {
    const staticSelectors = [
        '#hero .hero-content > *',
        '#hero .hero-image-wrapper',
        '#skills .skills-content > *',
        '#projects .section-header > *',
        '#certs .section-header > *',
        '#contact .contact-card',
        '#contact .footer-bottom'
    ];

    document.querySelectorAll(staticSelectors.join(', ')).forEach(initRevealElement);
}