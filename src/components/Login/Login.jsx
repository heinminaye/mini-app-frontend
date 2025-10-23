import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import "./Login.css";
import InputField from "../ui/Input";
import apiService from "../../service/api";
import { useLanguage } from "../../hooks/useLanguage";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const { translate } = useLanguage();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");
    clearErrors();

    try {
      const result = await apiService.login(data.email, data.password);

      if (result.returncode === "200") {
        if (result.token) localStorage.setItem("token", result.token);
        if (result.user)
          localStorage.setItem("user", JSON.stringify(result.user));
        else {
          const userData = {
            email: data.email,
            name: data.email.split("@")[0],
          };
          localStorage.setItem("user", JSON.stringify(userData));
        }

        window.location.href = "/pricelist";
      } else {
        setServerError(result.message || "login.error_server");
        setError("email", { type: "server" });
        setError("password", { type: "server" });
      }
    } catch (err) {
      console.log(err);
      setServerError(translate("login.error_server"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (serverError) {
      const timer = setTimeout(() => setServerError(""), 8000);
      return () => clearTimeout(timer);
    }
  }, [serverError]);

  return (
    <div
      className="login-page"
    >
      <div className="login-overlay">
        <div className="login-box">
          <div className="login-logo">
            <h2>{translate("login.title")}</h2>
          </div>

          {serverError && (
            <div className="error-banner">{translate(serverError)}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="login-form">
            <InputField
              label={translate("login.email_label")}
              type="email"
              name="email"
              placeholder={translate("login.email_placeholder")}
              disabled={loading}
              error={
                errors.email?.message ? translate(errors.email.message) : ""
              }
              translateError={true}
              {...register("email", {
                required: "login.error_required_email",
                pattern: {
                  value: /\S+@\S+\.\S+/,
                  message: "login.error_invalid",
                },
              })}
            />

            <InputField
              label={translate("login.password_label")}
              type="password"
              name="password"
              placeholder={translate("login.password_placeholder")}
              disabled={loading}
              showPasswordToggle={true}
              error={
                errors.password?.message
                  ? translate(errors.password.message)
                  : ""
              }
              translateError={true}
              {...register("password", {
                required: "login.error_required_password",
                minLength: {
                  value: 6,
                  message: "login.error_min_password",
                },
              })}
            />

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? translate("login.loading") : translate("login.button")}
            </button>

            <div className="login-links">
              <a href="/register" className="register-link">
                {translate("register.button")}
              </a>
              <a href="/forgot-password" className="forgot-link">
                {translate("forgot_password.title")}
              </a>
            </div>
          </form>
        </div>
      </div>
      <footer className="login-footer">
        <div className="login-footer-header">
          <p>123 Fakturera</p>
          <div className="login-footer-links">
            <a href="#" target="_blank" rel="noopener noreferrer">
              {translate("navbar.home")}
            </a>
            <a href="#" target="_blank" rel="noopener noreferrer">
              {translate("navbar.order")}
            </a>

            <a href="#" target="_blank" rel="noopener noreferrer">
              {translate("navbar.contact")}
            </a>
          </div>
        </div>
        <div className="login-footer-rights">
          <p>© Lättfaktura, CRO no. 638537, {new Date().getFullYear()}  {translate("login.footer_rights")}</p>
        </div>
      </footer>
    </div>
  );
};

export default Login;
