import { useForm } from "react-hook-form";
import { useLanguage } from "../../../hooks/useLanguage";
import InputField from "../Input";
import { useEffect } from "react";

function PriceListModal({
  showForm,
  editingItem,
  loading,
  serverError,
  onSubmit,
  onClose,
}) {
  const { translate } = useLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    defaultValues: {
      articleNo: "",
      productService: "",
      inPrice: "",
      price: "",
      unit: "",
      inStock: "",
      description: "",
    },
  });

  useEffect(() => {
    if (showForm) {
      if (editingItem) {
        setValue("articleNo", editingItem.articleNo || "");
        setValue("productService", editingItem.productService || "");
        setValue("inPrice", editingItem.inPrice || "");
        setValue("price", editingItem.price || "");
        setValue("unit", editingItem.unit || "");
        setValue("inStock", editingItem.inStock || "");
        setValue("description", editingItem.description || "");
      } else {
        reset();
      }
    }
  }, [showForm, editingItem, setValue, reset]);

  const handleFormSubmit = (data) => {
    onSubmit(data);
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  if (!showForm) return null;

  return (
    <div className="form-overlay">
      <div className="form-container">
        <div className="form-header">
          <h2>
            {editingItem
              ? translate("pricelist.button_edit")
              : translate("pricelist.button_add")}
          </h2>
          <button className="close-button" onClick={handleClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="pricelist-form">
          {serverError && (
            <div className="error-message pricelist-error">
              {translate(serverError)}
            </div>
          )}
          <div className="form-row">
            <InputField
              label={translate("pricelist.column_articleNo") + " *"}
              type="text"
              name="articleNo"
              placeholder={translate("pricelist.column_articleNo")}
              disabled={loading}
              error={
                errors.articleNo?.message
                  ? translate(errors.articleNo.message)
                  : ""
              }
              translateError={true}
              {...register("articleNo", {
                required: "pricelist.error_required_articleNo",
              })}
            />
            <InputField
              label={translate("pricelist.column_productService") + " *"}
              type="text"
              name="productService"
              placeholder={translate("pricelist.column_productService")}
              disabled={loading}
              error={
                errors.productService?.message
                  ? translate(errors.productService.message)
                  : ""
              }
              translateError={true}
              {...register("productService", {
                required: "pricelist.error_required_productService",
              })}
            />
          </div>

          <div className="form-row">
            <InputField
              label={translate("pricelist.column_inPrice")}
              type="number"
              name="inPrice"
              step="0.01"
              placeholder="0.00"
              disabled={loading}
              error={
                errors.inPrice?.message
                  ? translate(errors.inPrice.message)
                  : ""
              }
              translateError={true}
              {...register("inPrice")}
            />
            <InputField
              label={translate("pricelist.column_price")}
              type="number"
              name="price"
              step="0.01"
              placeholder="0.00"
              disabled={loading}
              error={
                errors.price?.message ? translate(errors.price.message) : ""
              }
              translateError={true}
              {...register("price")}
            />
            <InputField
              label={translate("pricelist.column_unit")}
              type="text"
              name="unit"
              placeholder={translate("pricelist.column_unit")}
              disabled={loading}
              error={
                errors.unit?.message ? translate(errors.unit.message) : ""
              }
              translateError={true}
              {...register("unit")}
            />
          </div>

          <div className="form-row">
            <InputField
              label={translate("pricelist.column_inStock")}
              type="number"
              name="inStock"
              placeholder="0"
              disabled={loading}
              error={
                errors.inStock?.message
                  ? translate(errors.inStock.message)
                  : ""
              }
              translateError={true}
              {...register("inStock")}
            />
            <div className="input-group full-width">
              <label>{translate("pricelist.column_description")}</label>
              <textarea
                {...register("description")}
                placeholder={translate("pricelist.column_description")}
                rows="3"
                className={errors.description ? "input-error" : ""}
                disabled={loading}
              />
              {errors.description && (
                <div className="field-error">
                  {translate(errors.description.message)}
                </div>
              )}
            </div>
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="btn btn-primary btn-with-icon"
              disabled={loading}
            >
              <span className="btn-icon">💾</span>
              {loading
                ? translate("pricelist.button_saving")
                : translate("pricelist.button_save")}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              {translate("pricelist.button_cancel")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PriceListModal;