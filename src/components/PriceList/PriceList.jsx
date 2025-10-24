import { useState, useEffect, useRef } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import apiService from "../../service/api";
import PriceListModal from "../ui/PriceList/PriceListModal";
import "./PriceList.css";
import { PlusCircle, Printer, Search, Settings } from "lucide-react";

const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};

function PriceList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [serverError, setServerError] = useState("");
  const [activeMenu, setActiveMenu] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState({});
  const { translate } = useLanguage();
  const menuRefs = useRef({});
  const tableContainerRef = useRef(null);
  const [searchTerms, setSearchTerms] = useState({ article: "", product: "" });
  const debouncedSearch = useDebounce(searchTerms, 500);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await apiService.getPricelist(
        debouncedSearch.article,
        debouncedSearch.product
      );
      if (response.returncode === "200") {
        setItems(response.data || []);
      } else {
        setServerError(response.message || "pricelist.error_fetch");
      }
    } catch (error) {
      console.error("Error fetching pricelist:", error);
      setServerError("pricelist.error_fetch");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, [debouncedSearch]);

  useEffect(() => {
    if (serverError) {
      const timer = setTimeout(() => {
        setServerError("");
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [serverError]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (activeMenu && !event.target.closest(".action-menu")) {
        setActiveMenu(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [activeMenu]);

  const resetForm = () => {
    setEditingItem(null);
    setShowForm(false);
    setServerError("");
  };

  const handleFormSubmit = async (data) => {
    setLoading(true);
    setServerError("");

    try {
      const submitData = {
        ...data,
        inPrice: data.inPrice ? parseFloat(data.inPrice) : null,
        price: data.price ? parseFloat(data.price) : null,
        inStock: data.inStock ? parseInt(data.inStock) : null,
      };

      let response;
      if (editingItem) {
        response = await apiService.updatePricelist(editingItem.id, submitData);
      } else {
        response = await apiService.createPricelist(submitData);
      }

      if (response.returncode === "200") {
        await fetchItems();
        resetForm();
      } else {
        setServerError(response.message || "pricelist.error_server");
      }
    } catch (error) {
      console.error("Error saving item:", error);
      setServerError("pricelist.error_server");
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setShowForm(true);
    setActiveMenu(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm(`${translate("pricelist.confirm_delete")}: ${id}?`)) {
      try {
        const response = await apiService.deletePricelist(id);
        if (response.returncode === "200") {
          await fetchItems();
        } else {
          setServerError(response.message || "pricelist.error_server");
        }
      } catch (error) {
        console.error("Error deleting item:", error);
        setServerError("pricelist.error_server");
      }
    }
    setActiveMenu(null);
  };

  const handlePrint = () => {
    window.print();
  };

  const toggleMenu = (id, e) => {
    e.stopPropagation();

    if (activeMenu === id) {
      setActiveMenu(null);
    } else {
      const buttonRect = e.target.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      const dropdownHeight = 80;
      const spaceBelow = viewportHeight - buttonRect.bottom;
      const shouldOpenUp = spaceBelow < dropdownHeight;

      setDropdownPosition({
        id,
        shouldOpenUp,
      });
      setActiveMenu(id);
    }
  };

  const formatCurrency = (value) => {
    if (!value && value !== 0) return "-";
    return `$${parseFloat(value).toFixed(2)}`;
  };

  // Sample data for demonstration
  const sampleItems = [
    {
      id: 1,
      articleNo: "1234567890",
      productService: "This is a test product with fifty characters this!",
      price: 1500800,
      inStock: 2500600,
      unit: "kilometers/hour",
      description: "This is the description with fifty characters this!",
    },
    {
      id: 2,
      articleNo: "1234567891",
      productService: "Sony DSLR 12345",
      price: 15000,
      inStock: 50,
      unit: "pieces",
      description: "High-quality DSLR camera",
    },
    {
      id: 3,
      articleNo: "1234567892",
      productService: "Random product",
      price: 1234,
      inStock: 0,
      unit: "units",
      description: "Random product description",
    },
    {
      id: 4,
      articleNo: "1234567893",
      productService: "Another product",
      price: 2500,
      inStock: 15,
      unit: "pieces",
      description: "Another product description",
    },
    {
      id: 5,
      articleNo: "1234567894",
      productService: "Last product",
      price: 890,
      inStock: 0,
      unit: "units",
      description: "Last product description",
    },
  ];

  const displayItems = items.length > 0 ? items : sampleItems;

  return (
    <div className="pricelist-container">
      <div className="pricelist-controls">
        <div className="search-section">
          <div className="search-box">
            <input
              type="text"
              placeholder="Search Article No..."
              value={searchTerms.article}
              onChange={(e) =>
                setSearchTerms((prev) => ({ ...prev, article: e.target.value }))
              }
              className="search-input"
            />
            <Search size={20} className="search-icon" />
          </div>

          <div className="search-box">
            <input
              type="text"
              placeholder="Search Product..."
              value={searchTerms.product}
              onChange={(e) =>
                setSearchTerms((prev) => ({ ...prev, product: e.target.value }))
              }
              className="search-input"
            />
            <Search size={20} className="search-icon" />
          </div>
        </div>
        <div className="control-buttons">
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            <span>New Product</span>
            <PlusCircle className="btn-icon" />
          </button>

          <button className="btn btn-secondary" onClick={handlePrint}>
            <span>Print List</span>
            <Printer className="btn-icon" />
          </button>

          <button className="btn btn-secondary">
            <span>Advanced Mode</span>
            <Settings className="btn-icon" />
          </button>
        </div>
      </div>

      {serverError && <div className="error-message">{serverError}</div>}

      {loading && (
        <div className="loading">
          <span className="loading-circle"></span>
        </div>
      )}

      {!loading && displayItems.length === 0 && (
        <div className="no-data">{translate("pricelist.error_not_found")}</div>
      )}

      {showForm && (
        <PriceListModal
          showForm={showForm}
          editingItem={editingItem}
          loading={loading}
          serverError={serverError}
          onSubmit={handleFormSubmit}
          onClose={resetForm}
        />
      )}

      {!loading && displayItems.length > 0 && (
        <div className="table-overflow" ref={tableContainerRef}>
          <div className="table-container">
            <table className="pricelist-table">
              <thead>
                <tr>
                  <th className="column-article">
                    {translate("pricelist.column_articleNo")}
                  </th>
                  <th className="column-product">
                    {translate("pricelist.column_productService")}
                  </th>
                  <th className="column-inprice">
                    {translate("pricelist.column_inPrice")}
                  </th>
                  <th className="column-price">
                    {translate("pricelist.column_price")}
                  </th>
                  <th className="column-unit">
                    {translate("pricelist.column_unit")}
                  </th>
                  <th className="column-stock">
                    {translate("pricelist.column_inStock")}
                  </th>
                  <th className="column-description">
                    {translate("pricelist.column_description")}
                  </th>
                  <th className="actions-header"></th>
                </tr>
              </thead>
              <tbody>
                {displayItems.map((item) => (
                  <tr key={item.id}>
                    <td
                      className="column-article"
                      data-label={translate("pricelist.column_articleNo")}
                    >
                      {item.articleNo}
                    </td>
                    <td
                      className="column-product"
                      data-label={translate("pricelist.column_productService")}
                    >
                      {item.productService}
                    </td>
                    <td
                      className="column-inprice"
                      data-label={translate("pricelist.column_inPrice")}
                    >
                      {formatCurrency(item.inPrice)}
                    </td>
                    <td
                      className="column-price"
                      data-label={translate("pricelist.column_price")}
                    >
                      {formatCurrency(item.price)}
                    </td>
                    <td
                      className="column-unit"
                      data-label={translate("pricelist.column_unit")}
                    >
                      {item.unit || "-"}
                    </td>
                    <td
                      className="column-stock"
                      data-label={translate("pricelist.column_inStock")}
                    >
                      <span
                        className={`stock-badge ${
                          item.inStock > 0 ? "in-stock" : "out-of-stock"
                        }`}
                      >
                        {item.inStock !== null ? item.inStock : "-"}
                      </span>
                    </td>
                    <td
                      className="column-description description-cell"
                      data-label={translate("pricelist.column_description")}
                    >
                      {item.description || "-"}
                    </td>
                    <td className="actions-cell">
                      <div className="action-menu">
                        <button
                          className="menu-button"
                          onClick={(e) => toggleMenu(item.id, e)}
                          title="Actions"
                          ref={(el) => (menuRefs.current[item.id] = el)}
                        >
                          <span className="menu-icon">⋯</span>
                        </button>
                        {activeMenu === item.id && (
                          <div
                            className={`menu-dropdown ${
                              dropdownPosition.id === item.id &&
                              dropdownPosition.shouldOpenUp
                                ? "bottom-up"
                                : ""
                            }`}
                          >
                            <button
                              className="dropdown-item edit"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEdit(item);
                              }}
                            >
                              <span className="dropdown-icon">✏️</span>
                              {translate("pricelist.button_edit")}
                            </button>
                            <button
                              className="dropdown-item delete"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(item.id);
                              }}
                            >
                              <span className="dropdown-icon">🗑️</span>
                              {translate("pricelist.button_delete")}
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default PriceList;
