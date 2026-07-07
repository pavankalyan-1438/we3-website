gsap.registerPlugin(ScrollTrigger);

// --- Cursor & Magnetic ---
const cursorDot = document.getElementById('cursor-dot');
const cursorGlass = document.getElementById('cursor-glass');
const cursorHalo = document.getElementById('cursor-halo');
const magneticElements = document.querySelectorAll('.btn-magnetic, a, input, textarea, button, select');

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let dotX = mouseX;
let dotY = mouseY;
let lastMouseX = mouseX;
let lastMouseY = mouseY;
let isCursorInNav = false;

window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    // We update dotX smoothly in the ticker, but we can set cursorDot directly if we want 0 latency.
    // Since we are stretching it, we need to let the ticker handle the position smoothly to match velocity.
});

gsap.set([cursorDot, cursorHalo], { xPercent: -50, yPercent: -50 });

gsap.ticker.add(() => {
    // 0.4 factor gives approx 20-30ms smoothing at 60fps
    dotX += (mouseX - dotX) * 0.4;
    dotY += (mouseY - dotY) * 0.4;
    
    let velX = dotX - lastMouseX;
    let velY = dotY - lastMouseY;
    lastMouseX = dotX;
    lastMouseY = dotY;
    
    let velocity = Math.sqrt(velX*velX + velY*velY);
    let angle = Math.atan2(velY, velX) * (180 / Math.PI);
    
    let scaleX = 1;
    let scaleY = 1;
    let rotation = 0;
    
    if (velocity > 0.5 && !isCursorInNav && window.innerWidth > 900) {
        // max 10% deformation
        let stretch = Math.min(velocity * 0.005, 0.1);
        scaleX = 1 + stretch;
        scaleY = 1 - (stretch * 0.3);
        rotation = angle;
    }
    
    if (cursorHalo) {
        cursorHalo.style.left = `${dotX}px`;
        cursorHalo.style.top = `${dotY}px`;
    }
    
    gsap.set(cursorDot, { 
        left: dotX,
        top: dotY,
        scaleX: scaleX, 
        scaleY: scaleY, 
        rotation: rotation
    });
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
        // Generic hover cursor expansion
        if (!el.closest('.liquid-nav')) {
            cursorGlass.style.width = '60px';
            cursorGlass.style.height = '60px';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(0)';
        }
    });
    
    el.addEventListener('mouseleave', () => {
        if(isMagnetic && window.innerWidth > 900) {
            gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
        }
        if (!el.closest('.liquid-nav')) {
            cursorGlass.style.width = '42px';
            cursorGlass.style.height = '42px';
            cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        }
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
const liquidNav = document.querySelector('.liquid-nav-wrapper');
const centerContainer = document.querySelector('.center-container');
const logoContainer = document.querySelector('.logo-container');
const ctaContainer = document.querySelector('.cta-container');

const svgLogo = document.querySelector('.logo-blob');
const svgCenter = document.querySelector('.center-blob');
const svgCta = document.querySelector('.cta-blob');

let isNavClicking = false;

if (liquidNav) {
    liquidNav.addEventListener('mouseenter', () => {
        isCursorInNav = true;
        if (cursorHalo) gsap.to(cursorHalo, { opacity: 1, duration: 0.3, ease: "power2.out" });
    });
    liquidNav.addEventListener('mouseleave', () => {
        isCursorInNav = false;
        if (cursorHalo) gsap.to(cursorHalo, { opacity: 0, duration: 0.3, ease: "power2.out" });
    });
}

function syncMask() {
    if (!liquidNav || window.innerWidth <= 900) return;
    const wRect = liquidNav.getBoundingClientRect();
    
    const getRel = (el) => {
        if (!el) return {x:0, y:0, w:0, h:0};
        const r = el.getBoundingClientRect();
        return {
            x: r.left - wRect.left,
            y: r.top - wRect.top,
            width: r.width,
            height: r.height
        };
    };

    if (svgLogo && logoContainer) gsap.set(svgLogo, { attr: getRel(logoContainer) });
    if (svgCenter && centerContainer) gsap.set(svgCenter, { attr: getRel(centerContainer) });
    if (svgCta && ctaContainer) gsap.set(svgCta, { attr: getRel(ctaContainer) });
}

if (window.innerWidth > 900 && logoContainer && ctaContainer) {
    // Initial state: push them inwards so they merge into a single capsule
    gsap.set(logoContainer, { x: 30 });
    gsap.set(ctaContainer, { x: -30 });
    syncMask();

    // Animation to separate them
    gsap.to([logoContainer, ctaContainer], {
        scrollTrigger: {
            trigger: document.body,
            start: "40px top",
            end: "100px top",
            scrub: 1.5
        },
        x: 0,
        ease: "power2.inOut"
    });

    gsap.ticker.add(syncMask);
}

function updateIndicator(targetEl, initial = false) {
    if (!targetEl || window.innerWidth <= 900 || !centerContainer) return;
    const rect = targetEl.getBoundingClientRect();
    const navRect = centerContainer.getBoundingClientRect();
    
    // Exact absolute position within the center container's coordinate space
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
    item.addEventListener('mouseenter', () => {
        if (window.innerWidth > 900) {
            gsap.to(item, { scale: 1.04, filter: 'brightness(1.15) saturate(1.2)', duration: 0.3, ease: "power2.out", overwrite: "auto" });
        }
    });
    
    item.addEventListener('mouseleave', () => {
        if (window.innerWidth > 900) {
            gsap.to(item, { scale: 1, filter: 'brightness(1) saturate(1)', duration: 0.4, ease: "power2.out", overwrite: "auto" });
        }
    });

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
    gsap.from(text, { scrollTrigger: { trigger: text, start: "top 90%", toggleActions: "play none none reverse" }, y: 30, opacity: 0, duration: 1, delay: 0.25, ease: "power3.out" });
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
