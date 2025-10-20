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
      acceptTerms: false,
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setServerError("");
    clearErrors();

    try {
      const result = await apiService.login(data.email, data.password);

      console.log("Login response:", result);

      if (result.returncode == "200") {
        if (result.token) {
          localStorage.setItem("token", result.token);
        }
        window.location.reload();
      } else {
        const messageKey =
          result.message && result.message.startsWith("login.")
            ? result.message
            : "login.error_server";

        setServerError(messageKey);

        if (
          result.message.toLowerCase().includes("email") ||
          result.message.toLowerCase().includes("password")
        ) {
          setError("email", { type: "server" });
          setError("password", { type: "server" });
        }
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
      const timer = setTimeout(() => {
        setServerError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [serverError]);

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>{translate("login.title")}</h2>
        </div>

        {serverError && (
          <div className="error-message">{translate(serverError)}</div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <InputField
            label={translate("login.email_label")}
            type="email"
            name="email"
            placeholder={translate("login.email_placeholder")}
            disabled={loading}
            error={errors.email?.message ? translate(errors.email.message) : ""}
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
              errors.password?.message ? translate(errors.password.message) : ""
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

          <div className="login-terms-container">
            <label className="terms-label">
              <input
                type="checkbox"
                {...register("acceptTerms", {
                  required: "login.error_required_terms",
                })}
                className="terms-checkbox"
              />
              <span className="terms-text">
                {translate("login.accept_terms_1")}{" "}
                <a
                  href="/terms"
                  className="terms-link"
                  onClick={(e) => {
                    e.preventDefault();
                    window.open("/terms", "_blank", "noopener,noreferrer");
                  }}
                >
                  {translate("login.terms_link")}
                </a>
              </span>
            </label>
            {errors.acceptTerms && (
              <div className="field-error">
                {translate(errors.acceptTerms.message)}
              </div>
            )}
          </div>
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? translate("login.loading") : translate("login.button")}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
