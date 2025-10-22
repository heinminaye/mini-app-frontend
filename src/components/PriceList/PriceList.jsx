import { useState, useEffect } from "react";
import { useLanguage } from "../../hooks/useLanguage";
import apiService from "../../service/api";
import PriceListModal from "../ui/PriceList/PriceListModal";
import PriceListTable from "../ui/PriceList/PriceListTable";
import PriceListMobileView from "../ui/PriceList/PriceListMobileView";
import "./PriceList.css";

function PriceList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [serverError, setServerError] = useState("");
  const { translate } = useLanguage();

  const fetchItems = async () => {
    setLoading(true);
    try {
      const response = await apiService.getPricelist(searchTerm);
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
  }, [searchTerm]);

  useEffect(() => {
    if (serverError) {
      const timer = setTimeout(() => {
        setServerError("");
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [serverError]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

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
  };

  const handleDelete = async (id) => {
    if (window.confirm(`${translate("pricelist.confirm_delete")}: ${id}?`)){
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
  };

  const handlePrint = () => {
    window.print();
  };

  const formatCurrency = (value) => {
    if (!value && value !== 0) return "-";
    return `$${parseFloat(value).toFixed(2)}`;
  };

  return (
    <div className="pricelist-container">
      <div className="pricelist-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder={translate("login.email_placeholder").replace(
              "email",
              translate("pricelist.title").toLowerCase()
            )}
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        <div className="control-buttons">
          <button className="btn btn-primary btn-with-icon" onClick={() => setShowForm(true)}>
            <span className="btn-icon">+</span>
            {translate("pricelist.button_add")}
          </button>
          <button className="btn btn-print btn-with-icon" onClick={handlePrint}>
            <span className="btn-icon">🖨️</span>
            {translate("pricelist.button_print")}
          </button>
        </div>
      </div>

    {loading && (
      <div className="loading">
        <span className="loading-circle"></span>
      </div>
    )}

    {!loading && items.length === 0 && (
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

    {!loading && items.length > 0 && (
      <>
        <PriceListTable
          items={items}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPrint={handlePrint}
          formatCurrency={formatCurrency}
        />

        <PriceListMobileView
          items={items}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          formatCurrency={formatCurrency}
        />
      </>
    )}
    </div>
  );
}

export default PriceList;