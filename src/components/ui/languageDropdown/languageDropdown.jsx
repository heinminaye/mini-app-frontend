import { useEffect, useRef, useState } from "react";
import "./LanguageDropdown.css";
import { useLanguage } from "../../../hooks/useLanguage.js";

const LanguageDropdown = () => {
  const { currentLang, supportedLanguages, changeLanguage, loading } =
    useLanguage();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

  const toggleDropdown = () => {
    if (!loading) setIsOpen((prev) => !prev);
  };

  const handleSelect = (langCode) => {
    changeLanguage(langCode);
    setIsOpen(false);
  };
    
    useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="language-switcher" ref={dropdownRef}>
      <div className="language-dropdown">
        <button
          className={`current-language ${loading ? "language-loading" : ""}`}
          onClick={toggleDropdown}
          disabled={loading}
        >
          {loading ? (
            <span className="language-loading-circle"></span>
          ) : (
            <>
              <span className="language-code">{currentLang.toUpperCase()}</span>
              <img
                src={
                  supportedLanguages.find((lang) => lang.code === currentLang)
                    ?.flag
                }
                alt={currentLang}
                className="flag"
              />
            </>
          )}
        </button>

        <div className={`dropdown-menu ${isOpen ? "open" : ""}`}>
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelect(lang.code)}
              className={`language-option ${
                currentLang === lang.code ? "active" : ""
              }`}
            >
              <span className="language-name">{lang.name}</span>
              <img src={lang.flag} alt={lang.name} className="flag" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LanguageDropdown;