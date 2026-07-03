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

// --- Ambient Background Layers Animation ---
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reducedMotion) {
    // 1. Slow infinite drift for SVGs
    gsap.to('.bg-layer-1-network', { x: -15, y: 10, duration: 20, ease: "sine.inOut", yoyo: true, repeat: -1 });
    gsap.to('.bg-layer-2-vectors', { x: 10, y: -15, duration: 25, ease: "sine.inOut", yoyo: true, repeat: -1 });

    // 2. Pulse Animation for Connection Network
    const pulseTrail = document.getElementById('pulse-trail');
    if (pulseTrail) {
        const length = pulseTrail.getTotalLength();
        gsap.set(pulseTrail, { strokeDasharray: length, strokeDashoffset: length });
        
        const pulseAnim = () => {
            gsap.fromTo(pulseTrail, 
                { strokeDashoffset: length, opacity: 0 },
                { 
                    strokeDashoffset: 0, opacity: 0.3, duration: 4, ease: "power1.inOut",
                    onComplete: () => {
                        gsap.to(pulseTrail, { 
                            opacity: 0, duration: 1, ease: "power1.inOut", delay: 1, 
                            onComplete: () => setTimeout(pulseAnim, 4000 + Math.random() * 4000)
                        });
                    }
                }
            );
        };
        setTimeout(pulseAnim, 2000);
    }
}

// 3. Scroll Parallax for Background Layers (moves up on scroll for depth)
gsap.to('.bg-layer-1-network', { yPercent: -5, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: true }});
gsap.to('.bg-layer-2-vectors', { yPercent: -10, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: true }});
gsap.to('.bg-layer-3-watermark', { yPercent: -15, ease: "none", scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: true }});

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
