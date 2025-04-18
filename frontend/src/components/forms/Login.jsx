import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { FiEye, FiEyeOff } from "react-icons/fi";
import styles from "../Styles/login.module.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setUser }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const formErrors = {};
    if (!formData.email.trim()) formErrors.email = "Email is required";
    if (!formData.password) formErrors.password = "Password is required";
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const res = await axios.post("https://access-map0.onrender.com/api/auth/login", formData);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        setUser(res.data.user);
        toast.success("Login successful!", { autoClose: 2000 });
        setTimeout(() => {
          navigate("/home");
        }, 1000);
      } catch (error) {
        toast.error(error.response?.data?.error || "Something went wrong!", {
          autoClose: 2000,
        });
      }
    }
  };

  return (
    <div className={styles.loginContainer}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <ToastContainer />
        <center>
          <h2>Login</h2>
        </center>
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
          {errors.email && <p className={styles.error}>{errors.email}</p>}
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <div className={styles.inputWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              className={styles.passwordToggle}
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FiEyeOff className={styles.toggleIcon} /> : <FiEye className={styles.toggleIcon} />}
            </button>
          </div>
          {errors.password && <p className={styles.error}>{errors.password}</p>}
        </div>

        <center>
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
          <p className={styles.signupLink}>
            No account? <Link to="/signup" className={styles.signupButton}>Sign up now</Link>
          </p>
        </center>
      </form>
    </div>
  );
};

export default Login;
