import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaTimes } from "react-icons/fa";
import styles from "./Styles/navbar.module.css";

export const Navbar = ({ setUser }) => {
  const [user, setUserState] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUserState(JSON.parse(storedUser));
  }, [setUser]);

  const handleLogout = () => {
    setUserState(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className={styles.navbar}>
      <Link to="/home" className={styles.navbarBrand}>
        AccessMap
      </Link>
      
      <button 
        className={styles.mobileMenuToggle}
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
      >
        {mobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>

      <ul className={`${styles.navList} ${mobileMenuOpen ? styles.open : ''}`}>
        <li className={styles.navItem}>
          <Link to="/home" className={styles.navLink} onClick={closeMobileMenu}>
            Home
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/map" className={styles.navLink} onClick={closeMobileMenu}>
            Map
          </Link>
        </li>
        <li className={styles.navItem}>
          <Link to="/about" className={styles.navLink} onClick={closeMobileMenu}>
            About Us
          </Link>
        </li>

        {user ? (
          <>
            <li className={styles.navItem}>
              <Link 
                to="/report-incident" 
                className={`${styles.navLink} ${styles.reportLink}`}
                onClick={closeMobileMenu}
              >
                Report Incident
              </Link>
            </li>
            <li className={styles.navItem}>
              <button onClick={handleLogout} className={styles.logOut}>
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li className={styles.navItem}>
              <Link to="/login" className={styles.navLink} onClick={closeMobileMenu}>
                Login
              </Link>
            </li>
            <li className={styles.navItem}>
              <Link to="/signup" className={styles.navLink} onClick={closeMobileMenu}>
                Sign Up
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};


export default Navbar;