import { useState, useRef } from "react";
import { useLanguage } from "../../../hooks/useLanguage.js";

function PriceListMobileView({
  items,
  onEdit,
  onDelete,
  formatCurrency
}) {
  const { translate } = useLanguage();
  const [activeDropdown, setActiveDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = (e, itemId) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveDropdown(activeDropdown === itemId ? null : itemId);
  };

  return (
    <div className="card-view">
      {items.map((item) => (
        <div key={item.id} className="price-card">
          <div className="card-header">
            <div className="card-title">
              <h3>{item.productService}</h3>
              <span className="id-badge">#{item.id}</span>
            </div>
            <div className="card-actions">
              <div className="action-menu" ref={dropdownRef}>
                <button 
                  className="menu-button"
                  onClick={(e) => toggleDropdown(e, item.id)}
                  aria-label="Actions"
                >
                  ⋮
                </button>
                {activeDropdown === item.id && (
                  <div className="menu-dropdown mobile-dropdown">
                    <button 
                      className="dropdown-item edit"
                      onClick={() => onEdit(item)}
                    >
                      <span className="dropdown-icon">✏️</span>
                      {translate("pricelist.button_edit")}
                    </button>
                    <button 
                      className="dropdown-item delete"
                      onClick={() => onDelete(item.id)}
                    >
                      <span className="dropdown-icon">🗑️</span>
                      {translate("pricelist.button_delete")}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="card-content">
            <div className="card-row">
              <span className="card-label">{translate("pricelist.column_articleNo")}:</span>
              <span className="card-value">{item.articleNo}</span>
            </div>
            
            <div className="card-row">
              <span className="card-label">{translate("pricelist.column_inPrice")}:</span>
              <span className="card-value">{formatCurrency(item.inPrice)}</span>
            </div>
            
            <div className="card-row">
              <span className="card-label">{translate("pricelist.column_price")}:</span>
              <span className="card-value price-highlight">{formatCurrency(item.price)}</span>
            </div>
            
            <div className="card-details">
              <div className="detail-item">
                <span className="detail-label">{translate("pricelist.column_unit")}:</span>
                <span className="detail-value">{item.unit || "-"}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">{translate("pricelist.column_inStock")}:</span>
                <span className={`stock-badge ${item.inStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                  {item.inStock !== null ? item.inStock : "-"}
                </span>
              </div>
            </div>
            
            {item.description && (
              <div className="card-description">
                <span className="card-label">{translate("pricelist.column_description")}:</span>
                <p className="card-value">{item.description}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PriceListMobileView;