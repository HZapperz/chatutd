import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navigation.css';

const Navigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const navItems = [
    { path: '/', name: 'Chat' },
    //{ path: '/archive', name: 'Archive' },
    { path: '/about', name: 'About' },
    { path: '/devlogs', name: 'Dev Logs' },
  ];

  return (
    <>
      <button className="hamburger-button" onClick={toggleMenu}>
        ☰
      </button>
      <nav className={`navigation ${isOpen ? 'open' : ''}`}>
        <div className="menu-content">
          <h1 className="app-title">ChatUTD</h1>
          <ul className="nav-links">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link to={item.path} onClick={() => setIsOpen(false)}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Navigation;