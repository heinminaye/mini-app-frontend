import { useLanguage } from "../../../hooks/useLanguage";

function PriceListTable({
  items,
  onEdit,
  onDelete,
  formatCurrency
}) {
  const { translate } = useLanguage();

  return (
    <div className="table-overflow">
      <div className="table-container">
        <table className="pricelist-table">
          <thead>
            <tr>
              <th>{translate("pricelist.column_articleNo")}</th>
              <th>{translate("pricelist.column_productService")}</th>
              <th>{translate("pricelist.column_inPrice")}</th>
              <th>{translate("pricelist.column_price")}</th>
              <th>{translate("pricelist.column_unit")}</th>
              <th>{translate("pricelist.column_inStock")}</th>
              <th>{translate("pricelist.column_description")}</th>
              <th className="actions-header"></th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td data-label={translate("pricelist.column_articleNo")}>
                  {item.articleNo}
                </td>
                <td data-label={translate("pricelist.column_productService")}>
                  {item.productService}
                </td>
                <td data-label={translate("pricelist.column_inPrice")}>
                  {formatCurrency(item.inPrice)}
                </td>
                <td data-label={translate("pricelist.column_price")}>
                  {formatCurrency(item.price)}
                </td>
                <td data-label={translate("pricelist.column_unit")}>
                  {item.unit || "-"}
                </td>
                <td data-label={translate("pricelist.column_inStock")}>
                  <span className={`stock-badge ${item.inStock > 0 ? 'in-stock' : 'out-of-stock'}`}>
                    {item.inStock !== null ? item.inStock : "-"}
                  </span>
                </td>
                <td
                  data-label={translate("pricelist.column_description")}
                  className="description-cell"
                >
                  {item.description || "-"}
                </td>
                <td className="actions-cell">
                  <div className="table-actions">
                    <button 
                      className="btn-action btn-edit"
                      onClick={() => onEdit(item)}
                      title={translate("pricelist.button_edit")}
                    >
                      <span className="action-icon">✏️</span>
                      <span className="action-text">{translate("pricelist.button_edit")}</span>
                    </button>
                    <button 
                      className="btn-action btn-delete"
                      onClick={() => onDelete(item.id)}
                      title={translate("pricelist.button_delete")}
                    >
                      <span className="action-icon">🗑️</span>
                      <span className="action-text">{translate("pricelist.button_delete")}</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default PriceListTable;