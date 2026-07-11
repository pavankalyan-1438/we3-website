"use client";

import { PageAnimations } from "@/components/PageAnimations";
import { Navigation } from "@/components/Navigation";

export default function Home() {
  return (
    <>
      <PageAnimations />

      <div id="cursor-dot"></div>
      <div id="cursor-halo"></div>
      <div id="cursor-glass"></div>

      <div className="ambient-background"></div>

      {/* Navigation */}
      <Navigation />

      <main id="smooth-wrapper">
        <div id="smooth-content">
          {/* Hero */}
          <section id="hero" className="hero-section">
            <div className="hero-content">
              <div className="stacked-hero-title">
                <div className="hero-word-container" id="word-build-container">
                  <svg width="100%" className="hero-word-svg">
                    <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" className="solid-text">BUILD</text>
                  </svg>
                </div>
                <div className="hero-word-container" id="word-innovate-container">
                  <svg width="100%" className="hero-word-svg">
                    <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" className="outline-text">INNOVATE</text>
                  </svg>
                </div>
                <div className="hero-word-container" id="word-deliver-container">
                  <svg width="100%" className="hero-word-svg">
                    <text x="50%" y="52%" textAnchor="middle" dominantBaseline="middle" className="solid-text">DELIVER</text>
                  </svg>
                </div>
              </div>
              <div className="hero-ctas reveal-text-delay-2">
                <a href="#contact" className="btn-glass primary btn-magnetic">Start Your Project</a>
                <a href="#projects" className="btn-glass secondary btn-magnetic">View Our Work</a>
              </div>
            </div>
          </section>

          {/* About & Process */}
          <section id="about" className="about-section">
            <div className="section-container text-center">
              <h2 className="section-title">About WE3</h2>
              <p className="section-desc mx-auto">We are a premium digital studio composed of former senior engineers and designers from the world&apos;s most innovative tech companies.</p>
              <div className="grid-2 mt-48 text-left">
                <div className="glass-card tilt-card">
                  <h3 className="accent-title">Our Mission</h3>
                  <p>To bridge the gap between stunning aesthetic design and rigorous technical performance. We believe software should feel physical, fast, and effortless.</p>
                </div>
                <div className="glass-card tilt-card">
                  <h3 className="accent-title">Our Values</h3>
                  <p>Quality over quantity. We take on select, visionary projects to ensure every product we ship is a timeless masterpiece.</p>
                </div>
              </div>
            </div>

            <div className="section-container" style={{ marginTop: "120px" }}>
              <h2 className="section-title text-center">How We Build</h2>
              <div className="timeline-container mt-48">
                <div className="timeline-line">
                  <div className="timeline-progress"></div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content glass-card tilt-card">
                    <h3>1. Discover</h3>
                    <p>Understanding your vision, business goals, and technical requirements.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content glass-card tilt-card">
                    <h3>2. Research</h3>
                    <p>Market analysis, user interviews, and defining the architecture.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content glass-card tilt-card">
                    <h3>3. Design</h3>
                    <p>Crafting wireframes, UI design, and premium motion interactions.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content glass-card tilt-card">
                    <h3>4. Develop</h3>
                    <p>Writing clean, accessible, and high-performance code.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content glass-card tilt-card">
                    <h3>5. Launch</h3>
                    <p>Rigorous QA, SEO optimization, and a flawless deployment.</p>
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-dot"></div>
                  <div className="timeline-content glass-card tilt-card">
                    <h3>6. Optimize</h3>
                    <p>Continuous performance tuning and analytical iteration.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Projects (Case Studies & Testimonials) */}
          <section id="projects" className="work-section">
            <div className="section-container">
              <h2 className="section-title">Selected Case Studies</h2>
              <div className="case-studies-list mt-48">
                <div className="case-study-card glass-card">
                  <div className="case-hero placeholder-1"></div>
                  <div className="case-content">
                    <h3 className="case-title">Nexis Platform</h3>
                    <div className="case-tags">
                      <span className="tag">Next.js</span>
                      <span className="tag">WebGL</span>
                      <span className="tag">FinTech</span>
                    </div>
                    <div className="case-details">
                      <div className="detail-block">
                        <h4>Challenge</h4>
                        <p>Redesigning a legacy financial dashboard to handle real-time websocket data while maintaining 60fps animations.</p>
                      </div>
                      <div className="detail-block">
                        <h4>Result</h4>
                        <p>40% increase in user retention, zero layout shifts, and an award-winning dark mode interface.</p>
                      </div>
                    </div>
                    <div className="case-actions">
                      <a href="#" className="btn-glass primary btn-magnetic">View Case Study</a>
                      <a href="#" className="btn-glass btn-magnetic">Live Site</a>
                    </div>
                  </div>
                </div>

                <div className="case-study-card glass-card">
                  <div className="case-hero placeholder-2"></div>
                  <div className="case-content">
                    <h3 className="case-title">Aura E-Commerce</h3>
                    <div className="case-tags">
                      <span className="tag">Shopify Headless</span>
                      <span className="tag">React</span>
                      <span className="tag">Framer Motion</span>
                    </div>
                    <div className="case-details">
                      <div className="detail-block">
                        <h4>Challenge</h4>
                        <p>Creating a headless luxury e-commerce experience that feels like a native app on mobile.</p>
                      </div>
                      <div className="detail-block">
                        <h4>Result</h4>
                        <p>Sub-second page loads, seamless cart transitions, and a 2.5x increase in mobile conversion rate.</p>
                      </div>
                    </div>
                    <div className="case-actions">
                      <a href="#" className="btn-glass primary btn-magnetic">View Case Study</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="section-container" style={{ marginTop: "160px" }}>
              <h2 className="section-title text-center">What Our Clients Say</h2>
              <div className="marquee-container mt-48">
                <div className="marquee-track">
                  {/* Group 1 */}
                  <div className="testimonial-card glass-card tilt-card">
                    <p className="quote">&quot;This is one of the smoothest, most premium agency websites I&apos;ve ever seen.&quot;</p>
                    <div className="author-info">
                      <div className="author-avatar liquid-glass">JD</div>
                      <div>
                        <h4>John Doe</h4>
                        <p>CEO, TechCorp</p>
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-card glass-card tilt-card">
                    <p className="quote">&quot;WE3 engineered an experience our users actually remember. Flawless execution.&quot;</p>
                    <div className="author-info">
                      <div className="author-avatar liquid-glass">SA</div>
                      <div>
                        <h4>Sarah Adams</h4>
                        <p>Founder, Lumina</p>
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-card glass-card tilt-card">
                    <p className="quote">&quot;The attention to detail and performance optimization is simply world-class.&quot;</p>
                    <div className="author-info">
                      <div className="author-avatar liquid-glass">MR</div>
                      <div>
                        <h4>Michael Ross</h4>
                        <p>VP Product, StartupX</p>
                      </div>
                    </div>
                  </div>
                  {/* Group 2 (Duplicate for smooth infinite scroll) */}
                  <div className="testimonial-card glass-card tilt-card">
                    <p className="quote">&quot;This is one of the smoothest, most premium agency websites I&apos;ve ever seen.&quot;</p>
                    <div className="author-info">
                      <div className="author-avatar liquid-glass">JD</div>
                      <div>
                        <h4>John Doe</h4>
                        <p>CEO, TechCorp</p>
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-card glass-card tilt-card">
                    <p className="quote">&quot;WE3 engineered an experience our users actually remember. Flawless execution.&quot;</p>
                    <div className="author-info">
                      <div className="author-avatar liquid-glass">SA</div>
                      <div>
                        <h4>Sarah Adams</h4>
                        <p>Founder, Lumina</p>
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-card glass-card tilt-card">
                    <p className="quote">&quot;The attention to detail and performance optimization is simply world-class.&quot;</p>
                    <div className="author-info">
                      <div className="author-avatar liquid-glass">MR</div>
                      <div>
                        <h4>Michael Ross</h4>
                        <p>VP Product, StartupX</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Services */}
          <section id="services" className="services-section">
            <div className="section-container">
              <h2 className="section-title">Our Expertise</h2>
              <div className="grid-2 mt-48">
                <div className="glass-card tilt-card service-card">
                  <div className="card-glow"></div>
                  <div className="service-icon liquid-glass">✨</div>
                  <h3>AI & Digital Products</h3>
                  <p>Intelligent, data-driven applications built with state-of-the-art AI integration.</p>
                </div>
                <div className="glass-card tilt-card service-card">
                  <div className="card-glow"></div>
                  <div className="service-icon liquid-glass">📱</div>
                  <h3>Premium Web Experiences</h3>
                  <p>Awwwards-winning websites with WebGL, smooth scrolling, and liquid interfaces.</p>
                </div>
                <div className="glass-card tilt-card service-card">
                  <div className="card-glow"></div>
                  <div className="service-icon liquid-glass">🎨</div>
                  <h3>UX/UI Craftsmanship</h3>
                  <p>World-class interface design focused on micro-interactions and conversion.</p>
                </div>
                <div className="glass-card tilt-card service-card">
                  <div className="card-glow"></div>
                  <div className="service-icon liquid-glass">⚡</div>
                  <h3>Frontend Engineering</h3>
                  <p>High-performance React/Next.js architectures deployed on edge networks.</p>
                </div>
              </div>
            </div>
          </section>

          {/* Contact */}
          <section id="contact" className="contact-section">
            <div className="section-container">
              <div className="contact-card glass-card tilt-card">
                <div className="card-glow"></div>
                <h2 className="section-title">Ready to Innovate?</h2>
                <p style={{ marginBottom: "32px", color: "var(--text-secondary)" }}>Let&apos;s engineer your next digital experience.</p>
                <form className="contact-form">
                  <div className="form-row">
                    <input type="text" placeholder="Name" className="glass-input btn-magnetic" />
                    <input type="email" placeholder="Email" className="glass-input btn-magnetic" />
                  </div>
                  <div className="form-row">
                    <input type="text" placeholder="Company" className="glass-input btn-magnetic" />
                    <select className="glass-input btn-magnetic" defaultValue="">
                      <option value="" disabled>Project Budget</option>
                      <option value="10-25k">$10k - $25k</option>
                      <option value="25-50k">$25k - $50k</option>
                      <option value="50k+">$50k+</option>
                    </select>
                  </div>
                  <textarea placeholder="Project Description" rows={4} className="glass-input btn-magnetic"></textarea>
                  <button type="button" className="btn-glass primary btn-magnetic" style={{ marginTop: "24px", padding: "16px 32px", width: "100%" }}>Let&apos;s Build Something Great</button>
                </form>
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="footer">
            <div className="footer-container">
              <div className="footer-top">
                <div className="footer-brand">
                  <img src="we3-logo.png" alt="WE3 Logo" className="footer-logo" />
                  <p>Build. Innovate. Deliver.</p>
                </div>
                <div className="footer-links-grid">
                  <div className="link-col">
                    <h4>Navigation</h4>
                    <a href="#hero" className="btn-magnetic">Home</a>
                    <a href="#about" className="btn-magnetic">About</a>
                    <a href="#projects" className="btn-magnetic">Projects</a>
                    <a href="#services" className="btn-magnetic">Services</a>
                    <a href="#contact" className="btn-magnetic">It&apos;s A Start</a>
                  </div>
                  <div className="link-col">
                    <h4>Socials</h4>
                    <a href="#" className="btn-magnetic">Twitter / X</a>
                    <a href="#" className="btn-magnetic">LinkedIn</a>
                    <a href="#" className="btn-magnetic">GitHub</a>
                    <a href="#" className="btn-magnetic">Dribbble</a>
                  </div>
                </div>
              </div>
              <div className="footer-bottom">
                <p>&copy; 2026 WE3 Agency. All rights reserved.</p>
                <div className="footer-legal">
                  <a href="#" className="btn-magnetic">Privacy Policy</a>
                  <a href="#" className="btn-magnetic">Terms of Service</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}
