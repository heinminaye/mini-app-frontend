import React, { useState } from "react";
import { useForm } from "react-hook-form";
import "./Login.css";
import InputField from "../Input";
import apiService from "../../service/api";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

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

      console.log("Login response:", result);

      if (result.returncode == '200') {
        if (result.token) {
          localStorage.setItem("token", result.token);
        }
        window.location.reload();
      } else {
        setServerError(result.message || "Login failed");
        if (result.message.toLowerCase().includes("email") || result.message.toLowerCase().includes("password")) {
          setError("email", { type: "server"});
          setError("password", { type: "server"});
        }
      }
    } catch (err) {
      setServerError("An unexpected error occurred. Please try again.", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h2>Login</h2>
        </div>

        {serverError && <div className="error-message">{serverError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="login-form">
          <InputField
            label="Email"
            type="email"
            name="email"
            placeholder="Enter your email"
            disabled={loading}
            error={errors.email?.message}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /\S+@\S+\.\S+/,
                message: "Please enter a valid email address",
              },
            })}
          />

          <InputField
            label="Password"
            type="password"
            name="password"
            placeholder="Enter your password"
            disabled={loading}
            showPasswordToggle={true}
            error={errors.password?.message}
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 6,
                message: "Password must be at least 6 characters",
              },
            })}
          />

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Logging In..." : "Log In"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
