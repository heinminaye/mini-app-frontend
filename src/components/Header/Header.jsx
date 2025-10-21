import "./Header.css";
import LanguageDropdown from "../ui/languageDropdown/LanguageDropdown";

const Header = ({ onMenuToggle }) => {
  const isLogin = !!localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const getUserInitial = () => {
    if (user.name) {
      return user.name.charAt(0).toUpperCase();
    }
    if (user.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <header className="header">
      <div className="header-container">
        {isLogin && user ? (
          <>
            <button className="menu-toggle" onClick={onMenuToggle}>
              ☰
            </button>
            <div className="logo-section centered">
              <img
                src="https://storage.123fakturera.se/public/icons/diamond.png"
                alt="Logo"
                className="logo"
              />
            </div>
          </>
        ) : (
          <div className="logo-section">
            <img
              src="https://storage.123fakturera.se/public/icons/diamond.png"
              alt="Logo"
              className="logo"
            />
          </div>
        )}

        <div className="header-right">
          {isLogin && user && (
            <>
              <div className="user-info">
                <div className="user-details">
                  <span>{user.name}</span>
                  <span>{user.email}</span>
                </div>
                <div className="user-avatar">{getUserInitial()}</div>
              </div>
              <div className="separator"></div>
            </>
          )}
          <LanguageDropdown />
        </div>
      </div>
    </header>
  );
};

export default Header;