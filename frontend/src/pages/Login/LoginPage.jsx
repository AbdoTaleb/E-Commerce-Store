import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

// عدّل المسار حسب مكان الملف عندك
import api from "../../lib/api";
import useAuthStore from "../../store/authStore";

import "./_LoginPage.scss";

const LoginPage = () => {
  // state محلي فقط لحقول الفورم
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  // Zustand store
  const { setUser, isAuthLoading, setIsAuthLoading, authError, setAuthError } = useAuthStore();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setAuthError(null);
    setIsAuthLoading(true);

    try {
      const res = await api.post("/auth/login", formData);

      // نفترض إن الباك إند يرجّع user في res.data.user
      setUser(res.data.user);

      // بعد تسجيل الدخول روح للهوم (أو لأي صفحة تحبها)
      navigate("/");
    } catch (error) {
      const message = error?.response?.data?.message || error?.response?.data?.error || "Failed to log in. Please try again.";

      setAuthError(message);
    } finally {
      setIsAuthLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-page__card-wrapper">
        <div className="login-card">
          <h2 className="login-card__title">Welcome back</h2>

          {authError && <p className="login-card__error">{authError}</p>}

          <form
            className="login-card__form"
            onSubmit={handleSubmit}
          >
            <div className="login-card__field">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="login-card__field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="login-card__submit"
              disabled={isAuthLoading}
            >
              {isAuthLoading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="login-card__footer">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="login-card__signup-link"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
