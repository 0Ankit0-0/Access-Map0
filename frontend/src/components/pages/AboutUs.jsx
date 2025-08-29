import React from "react";
import styles from "../Styles/aboutUs.module.css";

const AboutUs = () => {
  return (
    <div className={styles.aboutContainer}>
      <div className={styles.aboutContent}>
        <h1 className={styles.heading}>About AccessMap</h1>
        
        <h2 className={styles.subHeading}>Problem Statement</h2>
        <p className={styles.paragraph}>
          Urban areas often lack reliable and comprehensive information about the
          accessibility of public spaces for individuals with disabilities. This
          creates significant challenges for people with mobility impairments,
          visual impairments, or other disabilities to navigate cities safely and
          efficiently. There is a need for a system that dynamically maps
          accessibility features, identifies obstacles, and provides accurate,
          real-time information to support inclusive urban navigation.
        </p>
        
        <h2 className={styles.subHeading}>Our Mission</h2>
        <p className={styles.paragraph}>
          We are a team of college students from Shree L.R. Tiwari Degree College
          committed to creating an accessible urban environment. Our project aims
          to address the challenges faced by individuals with disabilities by
          leveraging community input to create a dynamic, real-time accessibility
          map.
        </p>
        
        <h2 className={styles.subHeading}>Our Team</h2>
        <ul className={styles.teamList}>
          <li className={styles.teamMember}>Ankit D. Vishwakarma</li>
          <li className={styles.teamMember}>Amisth Mahendrakar</li>
        </ul>
      </div>
    </div>
  );
};

export default AboutUs;
