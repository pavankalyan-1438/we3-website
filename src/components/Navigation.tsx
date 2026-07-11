"use client";

export function Navigation() {
  return (
    <nav className="liquid-nav">
      <div className="nav-glass-bg"></div>

      {/* VisionOS Active Pill Indicator */}
      <div className="nav-active-indicator"></div>

      <div className="nav-links" id="nav-container">
        <a href="#hero" className="nav-logo btn-magnetic">
          <img src="we3-logo.png" alt="WE3 Logo" />
        </a>
        <a href="#hero" className="nav-item active btn-magnetic" data-target="hero">
          Home
        </a>
        <a href="#about" className="nav-item btn-magnetic" data-target="about">
          About
        </a>
        <a href="#projects" className="nav-item btn-magnetic" data-target="projects">
          Projects
        </a>
        <a href="#services" className="nav-item btn-magnetic" data-target="services">
          Services
        </a>
        <a href="#contact" className="nav-item btn-magnetic" data-target="contact">
          It&apos;s A Start
        </a>
      </div>
    </nav>
  );
}
