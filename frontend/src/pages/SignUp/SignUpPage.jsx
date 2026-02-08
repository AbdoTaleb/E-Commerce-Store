import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./_SignUpPage.scss";
import api from "../../lib/api";

const SignUpPage = () => {
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [success, setSuccess] = React.useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await api.post("/auth/signup", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      console.log("Registration success", res.data);
      setSuccess("Registration successful! Redirecting to login...");
      navigate("/login");
    } catch (err) {
      const message = err.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-page__card-wrapper">
        <div className="signup-card">
          <h2 className="signup-card__title">Create your account</h2>
          {error && <p className="signup-card__error">{error}</p>}
          {success && <p className="signup-card__success">{success}</p>}

          <form
            className="signup-card__form"
            onSubmit={handleSubmit}
          >
            <div className="signup-card__field">
              <label htmlFor="name">Full name</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="John Doe"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="signup-card__field">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div className="signup-card__field">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="At least 8 characters"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="signup-card__field">
              <label htmlFor="confirm-password">Confirm password</label>
              <input
                type="password"
                id="confirm-password"
                name="confirmPassword"
                placeholder="Re-enter your password"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="signup-card__submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <div className="signup-card__footer">
            Already have an account?{" "}
            <Link
              className="signup-card__login-link"
              to="/login"
            >
              Login here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPage;
