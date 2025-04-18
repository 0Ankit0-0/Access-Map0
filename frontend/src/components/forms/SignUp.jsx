import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import styles from "../Styles/signup.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    dob: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const formErrors = {};
    if (!formData.name.trim()) formErrors.name = "Full name is required";

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      formErrors.email = "Email is required";
    } else if (!emailPattern.test(formData.email)) {
      formErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      formErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      formErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      formErrors.confirmPassword = "Confirm password is required";
    } else if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        await axios.post(`https://access-map0.onrender.com/api/auth/register`, {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          dob: formData.dob,
        });

        toast.success("Signup successful!", { autoClose: 2000 });
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } catch (error) {
        toast.error(error.response?.data?.error || "Something went wrong!", {
          autoClose: 3000,
        });
      }
    }
  };

  return (
    <div className={styles.signupContainer}>
      <form className={styles.signupForm} onSubmit={handleSubmit}>
        <ToastContainer />
        <center>
          <h2>Sign Up</h2>
        </center>

        {Object.keys(formData).map((key) => (
          <div className={styles.inputGroup} key={key}>
            <label htmlFor={key}>
              {key.charAt(0).toUpperCase() +
                key.slice(1).replace(/([A-Z])/g, " $1")}
            </label>
            <div className={styles.inputWrapper}>
              <input
                type={
                  key === "dob"
                    ? "date"
                    : key === "password"
                    ? showPassword
                      ? "text"
                      : "password"
                    : key === "confirmPassword"
                    ? showConfirmPassword
                      ? "text"
                      : "password"
                    : "text"
                }
                id={key}
                name={key}
                value={formData[key]}
                onChange={handleChange}
                placeholder={`Enter your ${key
                  .replace(/([A-Z])/g, " $1")
                  .toLowerCase()}`}
                required
              />
              {(key === "password" || key === "confirmPassword") && (
                <button
                  type="button"
                  className={styles.passwordToggle}
                  onClick={() =>
                    key === "password"
                      ? setShowPassword(!showPassword)
                      : setShowConfirmPassword(!showConfirmPassword)
                  }
                >
                  {key === "password" ? (
                    showPassword ? (
                      <FiEye className={styles.toggleIcon} />
                    ) : (
                      <FiEyeOff className={styles.toggleIcon} />
                    )
                  ) : showConfirmPassword ? (
                    <FiEye className={styles.toggleIcon} />
                  ) : (
                    <FiEyeOff className={styles.toggleIcon} />
                  )}
                </button>
              )}
            </div>
            {errors[key] && <p className={styles.error}>{errors[key]}</p>}
          </div>
        ))}

        <center>
          <button type="submit" className={styles.signupButton}>
            Sign Up
          </button>
          <p className={styles.loginLink}>
            Already have an account?{" "}
            <Link to="/login" className={styles.loginButtonLink}>
              Log in
            </Link>
          </p>
        </center>
      </form>
    </div>
  );
};

export default Signup;
