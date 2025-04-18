import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Styles/navbar.module.css";

export const Navbar = ({ setUser }) => {
  const [user, setUserState] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUserState(JSON.parse(storedUser));
  }, [setUser]);

  const handleLogout = () => {
    setUserState(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <nav className={styles.navbar}>
      <ul className={styles.navList}>
        <li className={styles.navItem}><Link to="/home" className={styles.navLink}>Home</Link></li>
        <li className={styles.navItem}><Link to="/map" className={styles.navLink}>Map</Link></li>
        <li className={styles.navItem}><Link to="/about" className={styles.navLink}>About Us</Link></li>

        {user ? (
          <>
            {/* <li className={styles.navItem}><Link to="/profile" className={styles.navLink}>Profile</Link></li> */}
            <li className={styles.navItem}><Link to="/report-incident" className={`${styles.navLink} ${styles.reportLink}`}>Report Incident</Link></li>
            <li className={styles.navItem}><button onClick={handleLogout} className={`${styles.navLink} ${styles.logOut}`}>Logout</button></li>
          </>
        ) : (
          <>
            <li className={styles.navItem}><Link to="/login" className={styles.navLink}>Login</Link></li>
            <li className={styles.navItem}><Link to="/signup" className={styles.navLink}>Sign Up</Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};


export default Navbar;