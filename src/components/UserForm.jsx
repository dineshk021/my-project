import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams, Link } from "react-router-dom";
import Loader from "./Loader";
import "./styles.css";

function UserForm() {
  const { id } = useParams();
  const isEdit = !!id;
  const [formData, setFormData] = useState({ name: "", age: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(isEdit);
  const navigate = useNavigate();

  useEffect(() => {
    if (isEdit) {
      const fetchUser = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay
          const response = await axios.get(`http://localhost:3000/users/${id}`);
          setFormData(response.data);
          setLoading(false);
        } catch (err) {
          setErrors({ submit: "Failed to load user data" });
          console.error("Error fetching user:", err);
        }
      };
      fetchUser();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters long";
    }

    if (!formData.age) {
      newErrors.age = "Age is required";
    } else if (isNaN(formData.age) || formData.age <= 18) {
      newErrors.age = "Age must be greater than 18";
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

    try {
      if (isEdit) {
        await axios.put(`http://localhost:3000/users/${id}`, {
          name: formData.name.trim(),
          age: parseInt(formData.age),
        });
      } else {
        await axios.post("http://localhost:3000/users", {
          name: formData.name.trim(),
          age: parseInt(formData.age),
        });
      }
      navigate("/");
    } catch (err) {
      setErrors({ submit: `Failed to ${isEdit ? "update" : "add"} user. Please try again.` });
      console.error("Error:", err);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="form-container">
      <h1>{isEdit ? "Update User" : "Add New User"}</h1>
      {errors.submit && <p className="error-message">{errors.submit}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name" className="form-label">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`form-input ${errors.name ? 'error' : ''}`}
            placeholder="Enter user name"
          />
          {errors.name && <p className="error-message">{errors.name}</p>}
        </div>
        <div className="form-group">
          <label htmlFor="age" className="form-label">
            Age:
          </label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            className={`form-input ${errors.age ? 'error' : ''}`}
            placeholder="Enter user age"
          />
          {errors.age && <p className="error-message">{errors.age}</p>}
        </div>
        <button
          type="submit"
          className={`submit-btn ${isEdit ? 'edit' : ''}`}
        >
          {isEdit ? "Update User" : "Add User"}
        </button>
        <Link
          to="/"
          className="cancel-btn"
        >
          Cancel
        </Link>
      </form>
    </div>
  );
}

export default UserForm;
