document.addEventListener('DOMContentLoaded', () => {
    // We initiate navbar and project loading after loading the DOM tree
    initNavbar();
    loadSkills();
    loadProjects();
    loadCerts();
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
            <i class="${skill.icon} skill-icon"></i>
            <span class="skill-name">${skill.name}</span>
        </div>
    `).join('');
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
                <img src="${project.imageUrl}" alt="${project.title} screenshot" class="project-graphic">
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

function renderCerts(certs) {
    const grid = document.getElementById('certs-grid');
    if (!grid) return;

    grid.innerHTML = certs.map(cert => `
        <div class="cert-card">
            <div class="cert-shine"></div>
            <i class="${cert.icon} cert-watermark"></i>
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
}