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

let lastMouseX = mouseX;
let lastMouseY = mouseY;
let isCursorInNav = false;

gsap.ticker.add(() => {
    cursorGlassX += (mouseX - cursorGlassX) * 0.15;
    cursorGlassY += (mouseY - cursorGlassY) * 0.15;
    
    let velX = cursorGlassX - lastMouseX;
    let velY = cursorGlassY - lastMouseY;
    lastMouseX = cursorGlassX;
    lastMouseY = cursorGlassY;
    
    let velocity = Math.sqrt(velX*velX + velY*velY);
    let angle = Math.atan2(velY, velX) * (180 / Math.PI);
    
    let scaleX = 1;
    let scaleY = 1;
    let rotation = 0;
    
    let blurPx = 0;
    if (velocity > 0.5 && !isCursorInNav && window.innerWidth > 900) {
        let stretch = Math.min(velocity * 0.04, 0.6); // max stretch 0.6
        scaleX = 1 + stretch;
        scaleY = 1 - (stretch * 0.4);
        rotation = angle;
        blurPx = Math.min(velocity * 0.1, 4); // Real motion blur
    }
    
    cursorGlass.style.left = `${cursorGlassX}px`;
    cursorGlass.style.top = `${cursorGlassY}px`;
    
    if (!isCursorInNav) {
        gsap.set(cursorGlass, { 
            scaleX: scaleX, 
            scaleY: scaleY, 
            rotation: rotation,
            filter: `blur(${blurPx}px)` 
        });
    }
});

// --- Nav Bar Advanced Cursor Engine ---
const liquidNav = document.querySelector('.liquid-nav');
const navItemsList = document.querySelectorAll('.nav-item');

if (liquidNav) {
    liquidNav.addEventListener('mouseenter', () => {
        isCursorInNav = true;
        cursorGlass.classList.add('cursor-lens');
        cursorDot.style.opacity = '0';
        gsap.to(cursorGlass, { scaleX: 1, scaleY: 1, rotation: 0, filter: 'blur(0px)', duration: 0.3, ease: "elastic.out(1, 0.8)" });
    });
    
    liquidNav.addEventListener('mouseleave', () => {
        isCursorInNav = false;
        cursorGlass.classList.remove('cursor-lens');
        cursorDot.style.opacity = '1';
        
        navItemsList.forEach(item => {
            gsap.to(item, { scale: 1, filter: 'brightness(1)', duration: 0.4, ease: "power2.out" });
        });
    });
    
    liquidNav.addEventListener('mousemove', (e) => {
        if (window.innerWidth <= 900) return;
        
        navItemsList.forEach(item => {
            const rect = item.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const dist = Math.hypot(centerX - e.clientX, centerY - e.clientY);
            const influenceRadius = 70;
            
            if (dist < influenceRadius) {
                const progress = 1 - (dist / influenceRadius);
                
                let isDirectHover = e.clientX >= rect.left && e.clientX <= rect.right && 
                                    e.clientY >= rect.top && e.clientY <= rect.bottom;
                
                let scale = 1 + (progress * 0.015);
                let brightness = 1 + (progress * 0.05); // Very subtle proximity
                let color = "var(--text-primary)";
                
                if (isDirectHover) {
                    scale = 1.08;
                    brightness = 1.25;
                    color = "var(--accent-color)"; // Highlight direct hover
                }
                
                gsap.to(item, {
                    scale: scale,
                    color: color,
                    filter: `brightness(${brightness})`,
                    duration: 0.25,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            } else {
                gsap.to(item, {
                    scale: 1,
                    color: "var(--text-primary)",
                    filter: 'brightness(1)',
                    duration: 0.4,
                    ease: "power2.out",
                    overwrite: "auto"
                });
            }
        });
    });
}

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
