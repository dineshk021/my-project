import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import Loader from "./Loader";
import "./styles.css";

function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setIsAuthenticating(true);
    try {
      // Search for user by email
      const response = await axios.get("http://localhost:3000/auth?email=" + formData.email);
      
      if (response.data.length === 0) {
        setErrors({ submit: "User not found. Please sign up first." });
        setLoading(false);
        setIsAuthenticating(false);
        return;
      }

      const user = response.data[0];

      // Validate password
      if (user.password !== formData.password) {
        setErrors({ submit: "Invalid email or password." });
        setLoading(false);
        setIsAuthenticating(false);
        return;
      }

      // Simulate authentication delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Login successful
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userId", user.id);
      
      setIsAuthenticating(false);
      navigate("/");
    } catch (err) {
      setErrors({ submit: "Login failed. Please try again." });
      console.error("Login error:", err);
      setLoading(false);
      setIsAuthenticating(false);
    }
  };

  if (loading || isAuthenticating) {
    return <Loader />;
  }

  return (
    <div className="form-container">
      <h1>Login</h1>
      {errors.submit && <p className="error-message">{errors.submit}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`form-input ${errors.email ? 'error' : ''}`}
            placeholder="Enter your email"
          />
          {errors.email && <p className="error-message">{errors.email}</p>}
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`form-input ${errors.password ? 'error' : ''}`}
            placeholder="Enter your password"
          />
          {errors.password && <p className="error-message">{errors.password}</p>}
        </div>

        <button type="submit" className="submit-btn">Login</button>
      </form>

      <p className="form-footer">
        Don't have an account? <Link to="/signup">Sign up here</Link>
      </p>
    </div>
  );
}

export default Login;
