import React, { useState } from 'react';
import { FaBars, FaTimes } from 'react-icons/fa'; // hamburger + close icons

function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

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
            <li>About Me</li>
            <li>Contacts</li>
            <li>Projects</li>
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
