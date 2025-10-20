import React from 'react';
import './Header.css';
import LanguageDropdown from '../ui/languageDropdown/LanguageDropdown';

const Header = () => {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo-section">
          <img
            src="https://storage.123fakturera.se/public/icons/diamond.png"
            alt="Logo"
            className="logo"
          />
        </div>

        <LanguageDropdown />
      </div>
    </header>
  );
};

export default Header;
