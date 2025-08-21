import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa'; // hamburger + close icons

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  // Scroll to section by ID
  const scrollToSection = (id) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
      setIsOpen(false); // close menu on mobile after click
    }
  };

  return (
    <div className='nav-container'>
      {/* Logo */}
      <div className='nav-logo'>
        <img src='/images/logo.png' alt='erick-kirui-logo' />
      </div>

      {/* Toggle button (mobile only) */}
      <div className='nav-toggle' onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </div>

      {/* Menu */}
      <div className={`nav-menu ${isOpen ? "active" : ""}`}>
        <nav>
          <ul>
            <li onClick={() => scrollToSection("about-section")}>About Me</li>
            <li onClick={() => scrollToSection("contact-section")}>Contacts</li>
            <li onClick={() => scrollToSection("projects-section")}>Projects</li>
          </ul>
        </nav>
      </div>

      {/* Social Icons */}
      <div className='nav-icons'>
        <a href="https://github.com/Erickkirui" target="_blank" rel="noopener noreferrer">
          <img src="/images/GitHub.png" alt="GitHub" />
        </a>
        <img src='/images/Instagram.png' alt='Instagram' />
        <img src='/images/LinkedIn.png' alt='LinkedIn' />
      </div>
    </div>
  );
}

export default Navigation;
