import React, { useEffect, useRef } from "react";
import "./Sidebar.css";
import { useLanguage } from "../../hooks/useLanguage";

const Sidebar = ({ isOpen, onClose }) => {
  const { translate } = useLanguage();
  const sidebarRef = useRef(null);

  const menuItems = [
    { id: 1, key: "menu.dashboard", icon: "📊", path: "/" },
    { id: 2, key: "menu.invoices", icon: "🧾", path: "/invoices" },
    { id: 3, key: "menu.customers", icon: "👥", path: "/customers" },
    { id: 4, key: "menu.products", icon: "📦", path: "/product" },
    { id: 5, key: "menu.priceList", icon: "💲", path: "/price-list" },
    { id: 5, key: "menu.reports", icon: "📈", path: "/reports" },
    { id: 6, key: "menu.settings", icon: "⚙️", path: "/settings" },
    { id: 7, key: "menu.logout", icon: "🚪", path: "/logout" },
  ];

  const handleItemClick = (item) => {
    if (item.key === "menu.logout") {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.reload();
    }
    onClose();
  };

  useEffect(() => {
  const handleClickOutside = (event) => {
    if (
      isOpen &&
      window.innerWidth <= 768 &&
      sidebarRef.current &&
      !sidebarRef.current.contains(event.target)
    ) {
      onClose();
    }
  };

  document.addEventListener("mousedown", handleClickOutside);
  return () => document.removeEventListener("mousedown", handleClickOutside);
}, [isOpen, onClose]);


  return (
    <>
      <nav
        className={`sidebar ${isOpen ? "mobile-open" : ""}`}
        ref={sidebarRef}
      >
        <div className="sidebar-content">
          <ul className="sidebar-menu">
            {menuItems.map((item) => (
              <li key={item.id} className="sidebar-item">
                <a href={item.path} className="sidebar-link" onClick={() => handleItemClick(item)}>
                  <span className="sidebar-icon">{item.icon}</span>
                  {translate(item.key)}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </>
  );
};

export default Sidebar;
