'use client';

import { PageAnimations } from "@/components/PageAnimations";
import { useRef, useEffect } from "react";
import { useInView, motion } from "framer-motion";
import { useNav } from "@/components/navigation/NavContext";
import { NavCapsule } from "@/components/navigation/NavCapsule";

export default function Home() {
  const { isProjectsInView, setIsProjectsInView } = useNav();
  const projectsRef = useRef<HTMLElement>(null);
  const inView = useInView(projectsRef, { margin: "-200px 0px" });

  useEffect(() => {
    setIsProjectsInView(inView);
  }, [inView, setIsProjectsInView]);

  return (
    <>
      <PageAnimations />

      <div className="ambient-background fixed inset-0 -z-10 bg-white" aria-hidden="true">
        <div className="glow-2 absolute -bottom-[20%] -right-[10%] h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(circle,var(--accent-color),transparent_70%)] opacity-20 blur-[120px]" />
      </div>

      <main>
        {/* Hero */}
        <section
          id="hero"
          className="hero-section flex min-h-screen flex-col items-center justify-center px-6 pb-24 pt-36 text-center"
        >
          <div className="hero-content relative z-10 flex w-full flex-col items-center">
            <div className="stacked-hero-title mb-12 flex w-full flex-col items-center">
              <div id="word-build-container" className="hero-word-container relative flex h-[clamp(60px,12vw,150px)] w-full items-center justify-center">
                <svg className="hero-word-svg absolute inset-0 h-full w-full overflow-visible">
                  <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" className="solid-text fill-accent font-display text-[clamp(60px,12vw,150px)] font-black uppercase tracking-tight">
                    BUILD
                  </text>
                </svg>
              </div>
              <div id="word-innovate-container" className="hero-word-container relative -my-[1%] flex h-[clamp(60px,12vw,150px)] w-full items-center justify-center">
                <svg className="hero-word-svg absolute inset-0 h-full w-full overflow-visible">
                  <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" className="outline-text fill-transparent stroke-accent stroke-[3px] [stroke-dasharray:4000] [stroke-dashoffset:4000] font-display text-[clamp(60px,12vw,150px)] font-black uppercase tracking-tight">
                    INNOVATE
                  </text>
                </svg>
              </div>
              <div id="word-deliver-container" className="hero-word-container relative flex h-[clamp(60px,12vw,150px)] w-full items-center justify-center">
                <svg className="hero-word-svg absolute inset-0 h-full w-full overflow-visible">
                  <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" className="solid-text fill-accent font-display text-[clamp(60px,12vw,150px)] font-black uppercase tracking-tight">
                    DELIVER
                  </text>
                </svg>
              </div>
            </div>
            <div className="hero-ctas flex translate-y-5 justify-center gap-4 opacity-0">
              <a href="#contact" className="btn-glass primary">Start Your Project</a>
              <a href="#projects" className="btn-glass">View Our Work</a>
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="flex min-h-screen flex-col justify-center px-6 py-40">
          <div className="section-container mx-auto w-full max-w-[var(--max-width)] text-center">
            <h2 className="section-title mb-4">About WE3</h2>
            <p className="section-desc mx-auto max-w-xl text-lg text-[var(--text-secondary)]">
              We are a premium digital studio composed of former senior engineers and designers from the world&apos;s most innovative tech companies.
            </p>
            <div className="mt-12 grid grid-cols-1 gap-8 text-left md:grid-cols-2">
              <div className="glass-card">
                <h3 className="accent-title mb-3 font-display text-3xl text-accent">Our Mission</h3>
                <p>To bridge the gap between stunning aesthetic design and rigorous technical performance. We believe software should feel physical, fast, and effortless.</p>
              </div>
              <div className="glass-card">
                <h3 className="accent-title mb-3 font-display text-3xl text-accent">Our Values</h3>
                <p>Quality over quantity. We take on select, visionary projects to ensure every product we ship is a timeless masterpiece.</p>
              </div>
            </div>
          </div>

          <div className="section-container mx-auto mt-32 w-full max-w-[var(--max-width)]">
            <h2 className="section-title text-center">How We Build</h2>
            <div className="timeline-container relative mx-auto mt-12 max-w-3xl pl-10">
              <div className="timeline-line absolute bottom-0 left-[15px] top-0 w-0.5 rounded bg-white/80">
                <div className="timeline-progress absolute left-0 top-0 h-0 w-full bg-accent shadow-[0_0_10px_var(--glow-color)]" />
              </div>
              {[
                ["1. Discover", "Understanding your vision, business goals, and technical requirements."],
                ["2. Research", "Market analysis, user interviews, and defining the architecture."],
                ["3. Design", "Crafting wireframes, UI design, and premium motion interactions."],
                ["4. Develop", "Writing clean, accessible, and high-performance code."],
                ["5. Launch", "Rigorous QA, SEO optimization, and a flawless deployment."],
                ["6. Optimize", "Continuous performance tuning and analytical iteration."],
              ].map(([title, desc]) => (
                <div key={title} className="timeline-item relative mb-12 last:mb-0">
                  <div className="timeline-dot absolute -left-[31px] top-6 z-[2] h-3.5 w-3.5 rounded-full border-2 border-white/80 bg-[var(--surface-color)] transition-colors" />
                  <div className="timeline-content glass-card px-8 py-6">
                    <h3 className="mb-2 font-display text-2xl text-accent">{title}</h3>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Projects */}
        <section ref={projectsRef} id="projects" className="flex min-h-screen flex-col justify-center px-6 py-40">
          <div className="section-container mx-auto w-full max-w-[var(--max-width)]">
            <div className="flex items-center gap-6 mb-12">
              <h2 className="section-title !mb-0">Selected Case Studies</h2>
              <div className="relative w-[100px] h-[40px]">
                {isProjectsInView && (
                  <motion.div layoutId="projects-capsule" className="absolute inset-0 z-50">
                    <NavCapsule className="px-4 py-2 bg-black/80">
                      <span className="text-white font-medium">Projects</span>
                    </NavCapsule>
                  </motion.div>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-16">
              <article className="case-study-card glass-card overflow-hidden p-0">
                <div className="case-hero h-[400px] w-full bg-gradient-to-br from-gray-900 to-gray-600 bg-cover bg-center" />
                <div className="p-12">
                  <h3 className="mb-4 font-display text-4xl">Nexis Platform</h3>
                  <div className="mb-8 flex flex-wrap gap-2">
                    {["Next.js", "Stripe", "Tailwind"].map((tag) => (
                      <span key={tag} className="rounded-full border border-white/80 bg-white/40 px-4 py-1.5 text-sm text-[var(--text-secondary)]">{tag}</span>
                    ))}
                  </div>
                  <div className="mb-8 grid gap-6 md:grid-cols-3">
                    <div>
                      <h4 className="mb-2 text-accent">Challenge</h4>
                      <p className="text-[var(--text-secondary)]">Modernizing a legacy financial dashboard with high data density.</p>
                    </div>
                    <div>
                      <h4 className="mb-2 text-accent">Solution</h4>
                      <p className="text-[var(--text-secondary)]">A full rewrite using React Server Components and a premium dark-mode first design system.</p>
                    </div>
                    <div>
                      <h4 className="mb-2 text-accent">Results</h4>
                      <p className="text-[var(--text-secondary)]">+45% user retention, 99 Lighthouse score, 2x faster load times.</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <a href="#" className="btn-glass primary">Live Demo</a>
                    <a href="#" className="btn-glass">GitHub</a>
                  </div>
                </div>
              </article>

              <article className="case-study-card glass-card overflow-hidden p-0">
                <div className="case-hero h-[400px] w-full bg-gradient-to-br from-indigo-950 to-indigo-800 bg-cover bg-center" />
                <div className="p-12">
                  <h3 className="mb-4 font-display text-4xl">Aura Dynamics</h3>
                  <div className="mb-8 flex flex-wrap gap-2">
                    {["WebGL", "Three.js", "Framer Motion"].map((tag) => (
                      <span key={tag} className="rounded-full border border-white/80 bg-white/40 px-4 py-1.5 text-sm text-[var(--text-secondary)]">{tag}</span>
                    ))}
                  </div>
                  <div className="mb-8 grid gap-6 md:grid-cols-3">
                    <div>
                      <h4 className="mb-2 text-accent">Challenge</h4>
                      <p className="text-[var(--text-secondary)]">Creating an immersive brand identity experience for an AI lab.</p>
                    </div>
                    <div>
                      <h4 className="mb-2 text-accent">Solution</h4>
                      <p className="text-[var(--text-secondary)]">Custom 3D shaders, fluid typography, and dynamic ambient lighting.</p>
                    </div>
                    <div>
                      <h4 className="mb-2 text-accent">Results</h4>
                      <p className="text-[var(--text-secondary)]">Awwwards Site of the Day, 200k+ organic visitors.</p>
                    </div>
                  </div>
                  <a href="#" className="btn-glass primary">Live Demo</a>
                </div>
              </article>
            </div>
          </div>

          <div className="section-container mx-auto mt-32 w-full max-w-[var(--max-width)] text-center">
            <h2 className="section-title">What They Say</h2>
          </div>
          <div className="marquee-container relative mt-12 w-full overflow-hidden py-6">
            <div className="marquee-track flex w-max gap-8">
              {[...Array(2)].flatMap((_, group) =>
                [
                  { quote: "This is one of the smoothest, most premium agency websites I've ever seen.", name: "John Doe", role: "CEO, TechCorp", initials: "JD" },
                  { quote: "WE3 engineered an experience our users actually remember. Flawless execution.", name: "Sarah Adams", role: "Founder, Lumina", initials: "SA" },
                  { quote: "The attention to detail and performance optimization is simply world-class.", name: "Michael Ross", role: "VP Product, StartupX", initials: "MR" },
                ].map((t) => (
                  <div key={`${group}-${t.initials}`} className="testimonial-card glass-card w-[450px] shrink-0 p-8">
                    <p className="quote mb-6 text-lg italic">&ldquo;{t.quote}&rdquo;</p>
                    <div className="author-info flex items-center gap-4">
                      <div className="author-avatar flex h-12 w-12 items-center justify-center rounded-full border border-white/80 bg-white/40 font-bold">{t.initials}</div>
                      <div>
                        <h4 className="text-base">{t.name}</h4>
                        <p className="text-sm text-[var(--text-secondary)]">{t.role}</p>
                      </div>
                    </div>
                  </div>
                )),
              )}
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="flex min-h-screen flex-col justify-center px-6 py-40">
          <div className="section-container mx-auto w-full max-w-[var(--max-width)]">
            <h2 className="section-title">Our Expertise</h2>
            <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2">
              {[
                ["✨", "AI & Digital Products", "Intelligent, data-driven applications built with state-of-the-art AI integration."],
                ["📱", "Premium Web Experiences", "Awwwards-winning websites with WebGL, smooth scrolling, and liquid interfaces."],
                ["🎨", "UX/UI Craftsmanship", "World-class interface design focused on micro-interactions and conversion."],
                ["⚡", "Frontend Engineering", "High-performance React/Next.js architectures deployed on edge networks."],
              ].map(([icon, title, desc]) => (
                <div key={title} className="glass-card service-card">
                  <div className="service-icon mb-6 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/80 bg-white/40 text-2xl">{icon}</div>
                  <h3 className="mb-3 font-display text-2xl">{title}</h3>
                  <p className="text-[var(--text-secondary)]">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section id="contact" className="flex min-h-screen flex-col justify-center px-6 py-40">
          <div className="section-container mx-auto w-full max-w-[var(--max-width)]">
            <div className="contact-card glass-card mx-auto max-w-3xl text-center">
              <h2 className="section-title mb-4">Ready to Innovate?</h2>
              <p className="mb-8 text-[var(--text-secondary)]">Let&apos;s engineer your next digital experience.</p>
              <form className="contact-form space-y-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input type="text" placeholder="Name" className="glass-input w-full rounded-xl border border-white/80 bg-black/10 px-4 py-4 outline-none focus:border-accent focus:bg-white/40" />
                  <input type="email" placeholder="Email" className="glass-input w-full rounded-xl border border-white/80 bg-black/10 px-4 py-4 outline-none focus:border-accent focus:bg-white/40" />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <input type="text" placeholder="Company" className="glass-input w-full rounded-xl border border-white/80 bg-black/10 px-4 py-4 outline-none focus:border-accent focus:bg-white/40" />
                  <select className="glass-input w-full rounded-xl border border-white/80 bg-black/10 px-4 py-4 outline-none focus:border-accent focus:bg-white/40" defaultValue="">
                    <option value="" disabled>Project Budget</option>
                    <option value="10-25k">$10k - $25k</option>
                    <option value="25-50k">$25k - $50k</option>
                    <option value="50k+">$50k+</option>
                  </select>
                </div>
                <textarea placeholder="Project Description" rows={4} className="glass-input w-full rounded-xl border border-white/80 bg-black/10 px-4 py-4 outline-none focus:border-accent focus:bg-white/40" />
                <button type="button" className="btn-glass primary mt-6 w-full py-4">Let&apos;s Build Something Great</button>
              </form>
            </div>
          </div>
        </section>

        <footer className="border-t border-white/80 bg-[var(--surface-color)] px-6 py-20">
          <div className="footer-container mx-auto max-w-[var(--max-width)]">
            <div className="footer-top mb-16 flex flex-wrap justify-between gap-12">
              <div className="footer-brand">
                <span className="font-display text-3xl font-bold text-accent">WE3</span>
                <p className="mt-4 text-lg text-[var(--text-secondary)]">Build. Innovate. Deliver.</p>
              </div>
              <div className="flex flex-wrap gap-16">
                <div>
                  <h4 className="mb-4 text-lg">Navigation</h4>
                  {["Home", "About", "Projects", "Services", "Contact"].map((link) => (
                    <a key={link} href={`#${link.toLowerCase() === "home" ? "hero" : link.toLowerCase()}`} className="mb-3 block text-[var(--text-secondary)] hover:text-accent">{link}</a>
                  ))}
                </div>
                <div>
                  <h4 className="mb-4 text-lg">Socials</h4>
                  {["Twitter / X", "LinkedIn", "GitHub", "Dribbble"].map((link) => (
                    <a key={link} href="#" className="mb-3 block text-[var(--text-secondary)] hover:text-accent">{link}</a>
                  ))}
                </div>
              </div>
            </div>
            <div className="footer-bottom flex flex-wrap items-center justify-between gap-4 border-t border-white/80 pt-6 text-sm text-[var(--text-secondary)]">
              <p>&copy; 2026 WE3 Agency. All rights reserved.</p>
              <div className="flex gap-6">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </main>

    </>
  );
}
