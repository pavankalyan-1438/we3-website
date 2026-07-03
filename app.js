gsap.registerPlugin(ScrollTrigger);

// --- Cursor & Magnetic ---
const cursorDot = document.getElementById('cursor-dot');
const cursorGlass = document.getElementById('cursor-glass');
const magneticElements = document.querySelectorAll('.btn-magnetic, a, input, textarea, button, select');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let cursorGlassX = mouseX;
let cursorGlassY = mouseY;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
});

gsap.ticker.add(() => {
    cursorGlassX += (mouseX - cursorGlassX) * 0.15;
    cursorGlassY += (mouseY - cursorGlassY) * 0.15;
    cursorGlass.style.left = `${cursorGlassX}px`;
    cursorGlass.style.top = `${cursorGlassY}px`;
});

magneticElements.forEach(el => {
    const isMagnetic = el.classList.contains('btn-magnetic');
    el.addEventListener('mousemove', (e) => {
        if(isMagnetic && window.innerWidth > 900) {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            gsap.to(el, {
                x: (e.clientX - centerX) * 0.2,
                y: (e.clientY - centerY) * 0.2,
                duration: 0.4,
                ease: "power2.out"
            });
        }
        cursorGlass.style.width = '60px';
        cursorGlass.style.height = '60px';
        cursorGlass.style.background = 'rgba(0, 85, 164, 0.1)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(0)';
    });
    
    el.addEventListener('mouseleave', () => {
        if(isMagnetic && window.innerWidth > 900) {
            gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
        }
        cursorGlass.style.width = '40px';
        cursorGlass.style.height = '40px';
        cursorGlass.style.background = 'var(--glass-bg)';
        cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
    });

    el.addEventListener('click', () => {
        const tempRipple = cursorGlass.cloneNode();
        tempRipple.style.position = 'fixed';
        tempRipple.style.left = `${mouseX}px`;
        tempRipple.style.top = `${mouseY}px`;
        tempRipple.style.borderColor = 'var(--accent-color)';
        document.body.appendChild(tempRipple);
        
        gsap.fromTo(tempRipple, 
            { scale: 1, opacity: 1 }, 
            { scale: 3, opacity: 0, duration: 0.6, ease: "power2.out", onComplete: () => tempRipple.remove() }
        );
    });
});

// --- VisionOS Nav Engine ---
const navItems = document.querySelectorAll('#nav-container .nav-item');
const indicator = document.querySelector('.nav-active-indicator');
const navContainer = document.getElementById('nav-container');
const liquidNav = document.querySelector('.liquid-nav');
let isNavClicking = false;

function updateIndicator(targetEl, initial = false) {
    if (!targetEl || window.innerWidth <= 900) return;
    const rect = targetEl.getBoundingClientRect();
    const navRect = liquidNav.getBoundingClientRect();
    
    // Exact absolute position within the nav's coordinate space
    const xPos = rect.left - navRect.left; 
    const yPos = rect.top - navRect.top; 
    
    if (initial) {
        gsap.set(indicator, { x: xPos, y: yPos, width: rect.width, height: rect.height });
    } else {
        gsap.killTweensOf(indicator);
        gsap.to(indicator, {
            x: xPos,
            y: yPos,
            width: rect.width,
            height: rect.height,
            duration: 0.5,
            ease: "elastic.out(1, 0.75)",
            force3D: true
        });
    }
    navItems.forEach(item => item.classList.remove('active'));
    targetEl.classList.add('active');
}

setTimeout(() => updateIndicator(document.querySelector('.nav-item.active'), true), 200);

navItems.forEach(item => {
    item.addEventListener('click', (e) => {
        isNavClicking = true;
        updateIndicator(e.target);
        setTimeout(() => isNavClicking = false, 800); // disable scrollspy temporarily to avoid jumping
    });
});

const sections = document.querySelectorAll('section');

let currentSectionId = '';

const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
};

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            currentSectionId = entry.target.getAttribute('id');
            if (!isNavClicking) {
                navItems.forEach(item => {
                    if (item.dataset.target === currentSectionId && !item.classList.contains('active')) {
                        updateIndicator(item);
                    }
                });
            }
        }
    });
}, observerOptions);

sections.forEach(section => sectionObserver.observe(section));

// --- 3D Tilt Cards ---
const tiltCards = document.querySelectorAll('.tilt-card');
tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        if (window.innerWidth < 900) return; 
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top;  
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3; 
        const rotateY = ((x - centerX) / centerX) * 3;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
        
        const innerContent = card.querySelector('.card-content, .service-icon, .quote');
        if(innerContent) {
             gsap.to(innerContent, { x: rotateY * 1.5, y: -rotateX * 1.5, duration: 0.5, ease: "power2.out" });
        }

        gsap.to(card, { rotateX: rotateX, rotateY: rotateY, duration: 0.5, ease: "power2.out", transformPerspective: 1000 });
    });
    
    card.addEventListener('mouseleave', () => {
        const innerContent = card.querySelector('.card-content, .service-icon, .quote');
        if(innerContent) {
            gsap.to(innerContent, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
        }
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
    });
});

gsap.to('.glow-2', {
    yPercent: -20,
    ease: "none",
    scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: true }
});

// --- GSAP Scroll Animations ---
gsap.utils.toArray('.reveal-text').forEach(text => {
    gsap.from(text, { scrollTrigger: { trigger: text, start: "top 90%", toggleActions: "play none none reverse" }, y: 40, opacity: 0, duration: 1, ease: "power3.out" });
});
gsap.utils.toArray('.reveal-text-delay').forEach(text => {
    gsap.from(text, { scrollTrigger: { trigger: text, start: "top 90%", toggleActions: "play none none reverse" }, y: 30, opacity: 0, duration: 1, delay: 0.15, ease: "power3.out" });
});
gsap.utils.toArray('.reveal-text-delay-2').forEach(text => {
    gsap.from(text, { scrollTrigger: { trigger: text, start: "top 90%", toggleActions: "play none none reverse" }, y: 30, opacity: 0, duration: 1, delay: 0.3, ease: "power3.out" });
});

gsap.utils.toArray('.grid-3, .grid-2').forEach(grid => {
    gsap.from(grid.children, {
        scrollTrigger: { trigger: grid, start: "top 85%" },
        y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power2.out"
    });
});

gsap.utils.toArray('.case-study-card').forEach(card => {
    gsap.from(card, { scrollTrigger: { trigger: card, start: "top 85%" }, y: 50, opacity: 0, duration: 0.8, ease: "power2.out" });
    
    const img = card.querySelector('.case-hero');
    if (img) {
        gsap.to(img, {
            backgroundPosition: `50% 100%`, ease: "none",
            scrollTrigger: { trigger: card, start: "top bottom", end: "bottom top", scrub: true }
        });
    }
});

// Process Timeline Animation
if (document.querySelector(".timeline-container")) {
    ScrollTrigger.create({
        trigger: ".timeline-container",
        start: "top center",
        end: "bottom center",
        onUpdate: self => {
            gsap.to('.timeline-progress', { height: `${self.progress * 100}%`, duration: 0.1 });
            
            document.querySelectorAll('.timeline-item').forEach((item) => {
                const dot = item.querySelector('.timeline-dot');
                const rect = item.getBoundingClientRect();
                if (rect.top < window.innerHeight / 2) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }
    });
}
// --- Ambient Particles Animation ---
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reducedMotion) {
    gsap.to('.particle-1', { x: 100, y: 50, duration: 25, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to('.particle-2', { x: -80, y: -60, duration: 30, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to('.particle-3', { x: 60, y: -90, duration: 22, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to('.streak-1', { x: 200, y: 100, duration: 40, ease: "sine.inOut", yoyo: true, repeat: -1 });
}

// --- Guiding Light Engine ---
const guidingLight = document.getElementById('guiding-light');

if (guidingLight && !reducedMotion && window.innerWidth > 900) {
    let headers = [];
    
    function initGuidingLight() {
        headers = Array.from(document.querySelectorAll('.hero-title, .section-title'));
        if (!headers.length) return;
        
        // Ensure guiding light is visible
        gsap.set(guidingLight, { opacity: 1 });
        
        let headerData = headers.map(h => {
            const rect = h.getBoundingClientRect();
            // Calculate absolute position on the page
            return {
                el: h,
                x: rect.left + window.scrollX + (rect.width / 2),
                y: rect.top + window.scrollY + (rect.height / 2),
                width: rect.width,
                height: rect.height
            };
        });

        // Remove old scroll triggers for light if any
        ScrollTrigger.getAll().filter(st => st.vars.id === "guidingLightST").forEach(st => st.kill());
        
        // Initial set
        gsap.set(guidingLight, { x: headerData[0].x, y: headerData[0].y });
        
        ScrollTrigger.create({
            id: "guidingLightST",
            trigger: document.body,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            onUpdate: self => {
                const scrollY = window.scrollY + window.innerHeight / 2; // Middle of screen
                
                // Find closest header based on scroll position
                let closest = headerData[0];
                let minDiff = Infinity;
                
                headerData.forEach(h => {
                    let diff = Math.abs(scrollY - h.y);
                    if (diff < minDiff) {
                        minDiff = diff;
                        closest = h;
                    }
                });
                
                // If within proximity of the closest header, morph into a highlight
                const proximity = 350; // pixels
                let isHighlight = minDiff < proximity;
                let progress = isHighlight ? (1 - (minDiff / proximity)) : 0;
                
                // Morphing scale based on the header's width/height relative to the 12px orb
                let scaleX = isHighlight ? 1 + ((closest.width / 12) * progress * 1.1) : 1;
                let scaleY = isHighlight ? 1 + ((closest.height / 12) * progress * 1.5) : 1;
                
                gsap.to(guidingLight, {
                    x: closest.x,
                    y: scrollY + (closest.y - scrollY) * progress, // Pulls towards header as it gets closer
                    scaleX: scaleX,
                    scaleY: scaleY,
                    duration: 0.6,
                    ease: "elastic.out(1, 0.8)",
                    overwrite: "auto"
                });
                
                if (isHighlight && progress > 0.7) {
                    guidingLight.classList.add('guiding-light-highlight');
                } else {
                    guidingLight.classList.remove('guiding-light-highlight');
                }
            }
        });
    }

    // Delay init to ensure layout is settled
    setTimeout(initGuidingLight, 500);
    
    // Re-init on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(initGuidingLight, 300);
    });
}
