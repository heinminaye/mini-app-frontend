import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Sidebar.css";
import { useLanguage } from "../../hooks/useLanguage";

const Sidebar = ({ isOpen, onClose , menuButtonRef}) => {
  const { translate } = useLanguage();
  const sidebarRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { id: 1, key: "menu.dashboard", icon: "📊", path: "/" },
    { id: 2, key: "menu.invoices", icon: "🧾", path: "/invoices" },
    { id: 3, key: "menu.customers", icon: "👥", path: "/customers" },
    { id: 4, key: "menu.products", icon: "📦", path: "/product" },
    { id: 5, key: "menu.priceList", icon: "💲", path: "/price-list" },
    { id: 6, key: "menu.reports", icon: "📈", path: "/reports" },
    { id: 7, key: "menu.settings", icon: "⚙️", path: "/settings" },
    { id: 8, key: "menu.logout", icon: "🚪", path: "/logout" },
  ];

  const handleItemClick = (item) => {
    if (item.key === "menu.logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (window.abortController) {
        window.abortController.abort();
      }
    
    window.location.href = "/login";
    } else {
      if (location.pathname !== item.path && window.innerWidth <= 1024) {
        navigate(item.path);
        onClose();
      }
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        window.innerWidth <= 1024 &&
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        !(menuButtonRef?.current && menuButtonRef.current.contains(event.target))
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, menuButtonRef]);

  return (
    <nav className={`sidebar ${isOpen ? "mobile-open" : ""}`} ref={sidebarRef}>
      <div className="sidebar-header">
        <h3>{translate('menu.header')}</h3>
      </div>
      <div className="sidebar-content">
        <ul className="sidebar-menu">
          {menuItems.map((item) => (
            <li
              key={item.id}
              className={`sidebar-item ${
                location.pathname === item.path ? "active" : ""
              }`}
            >
              <a
                href={item.path}
                className="sidebar-link"
                onClick={(e) => {
                  e.preventDefault();
                  handleItemClick(item);
                }}
              >
                <span className="sidebar-icon">{item.icon}</span>
                {translate(item.key)}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

export default Sidebar;
