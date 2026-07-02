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
        cursorGlass.style.background = 'rgba(108, 99, 255, 0.1)';
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

// --- Liquid Nav Melting Engine ---
const navItems = document.querySelectorAll('.nav-container .nav-item');
const indicator = document.querySelector('.nav-active-indicator');
const ghost = document.querySelector('.nav-ghost-indicator');
const navGooeyLayer = document.querySelector('.nav-gooey-layer');
const navContainer = document.getElementById('nav-container');
let isNavClicking = false;

function updateIndicator(targetEl, initial = false) {
    if (!targetEl || window.innerWidth <= 900) return;
    const rect = targetEl.getBoundingClientRect();
    const gooeyRect = navGooeyLayer.getBoundingClientRect();
    
    // Exact absolute position within the gooey layer's coordinate space
    const xPos = rect.left - gooeyRect.left; 
    const yPos = rect.top - gooeyRect.top; 
    
    if (initial) {
        gsap.set(indicator, { x: xPos, y: yPos, width: rect.width, height: rect.height });
        gsap.set(ghost, { opacity: 0 });
    } else {
        const currentX = gsap.getProperty(indicator, "x") || xPos;
        const currentW = gsap.getProperty(indicator, "width") || rect.width;
        
        const isMovingRight = xPos > currentX;
        
        gsap.killTweensOf(indicator); 
        gsap.killTweensOf(ghost);
        
        // Ghost stays behind and shrinks (creates the breaking droplet effect)
        gsap.set(ghost, { x: currentX, y: yPos, width: currentW, height: rect.height, scaleX: 1, scaleY: 1, opacity: 1 });
        gsap.to(ghost, {
            scaleX: 0.1,
            scaleY: 0.1,
            x: currentX + (xPos - currentX) * 0.25, // Pulled slightly towards destination
            duration: 0.5,
            ease: "power2.in",
            onComplete: () => gsap.set(ghost, { opacity: 0 })
        });

        // Main indicator stretches from current to target to create a physical bridge
        gsap.set(indicator, { x: currentX, y: yPos, width: currentW, height: rect.height });
        const tl = gsap.timeline();
        
        if (isMovingRight) {
            tl.to(indicator, {
                width: (xPos - currentX) + rect.width,
                duration: 0.35,
                ease: "power2.inOut"
            }).to(indicator, {
                x: xPos,
                width: rect.width,
                duration: 0.45,
                ease: "back.out(1.2)"
            }, "-=0.05");
        } else {
            tl.to(indicator, {
                x: xPos,
                width: (currentX - xPos) + currentW,
                duration: 0.35,
                ease: "power2.inOut"
            }).to(indicator, {
                width: rect.width,
                duration: 0.45,
                ease: "back.out(1.2)"
            }, "-=0.05");
        }
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
window.addEventListener('scroll', () => {
    if (isNavClicking) return; 
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - sectionHeight / 3)) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        if (item.dataset.target === current && !item.classList.contains('active')) {
            updateIndicator(item);
        }
    });
});

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
