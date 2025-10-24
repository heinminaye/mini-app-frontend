import { useState, useRef, useEffect } from "react";
import "./Header.css";
import LanguageDropdown from "../ui/LanguageDropdown/LanguageDropdown";
import { useLanguage } from "../../hooks/useLanguage";

const Header = ({ onMenuToggle, menuButtonRef }) => {
  const isLogin = !!localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const { translate } = useLanguage();

  const [navOpen, setNavOpen] = useState(false);
  const navbarRef = useRef(null);
  const navbarToggleRef = useRef(null);

  const getUserInitial = () => {
    if (user.name) return user.name.charAt(0).toUpperCase();
    if (user.email) return user.email.charAt(0).toUpperCase();
    return "U";
  };

  const toggleNav = () => setNavOpen(!navOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target) &&
        navbarToggleRef.current &&
        !navbarToggleRef.current.contains(event.target)
      ) {
        setNavOpen(false);
      }
    };
    if (navOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [navOpen]);

  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape" && navOpen) {
        setNavOpen(false);
      }
    };

    if (navOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [navOpen]);

  return (
    <header className={`header ${isLogin ? "header-logged-in" : ""}`}>
      <div className={`header-container ${isLogin ? "header-container-logged" : ""}`}>
        {isLogin && user && (
          <button
            className="menu-toggle"
            onClick={onMenuToggle}
            ref={menuButtonRef}
          >
            ☰
          </button>
        )}

        {!isLogin &&  (
          <div className="logo-section">
          <img
            src="https://storage.123fakturera.se/public/icons/diamond.png"
            alt="Logo"
            className="logo"
          />
        </div>
        )}

        <div className={`header-right ${isLogin ? "header-right-logged" : ""}`}>
          {isLogin && user && (
            <>
              <div className="user-info">
                <div className="user-avatar">{getUserInitial()}</div>
                <div className="user-details">
                  <span>{user.name}</span>
                  <span>{user.email}</span>
                </div>
              </div>
            </>
          )}

          {!isLogin && (
            <div className="navbar-container">
              <button
                className="navbar-toggle"
                onClick={toggleNav}
                ref={navbarToggleRef}
                aria-label="Toggle navigation"
                aria-expanded={navOpen}
              >
                ☰
              </button>
              <ul 
                className={`nav-links ${navOpen ? "open" : ""}`}
                ref={navbarRef}
              >
                <li>{translate("navbar.home")}</li>
                <li>{translate("navbar.order")}</li>
                <li>{translate("navbar.customers")}</li>
                <li>{translate("navbar.about")}</li>
                <li>{translate("navbar.contact")}</li>
              </ul>
            </div>
          )}

          <LanguageDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;