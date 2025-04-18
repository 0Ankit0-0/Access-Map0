import React, { useState, useEffect } from 'react';
import axios from 'axios';
import IncidentCard from '../Incident/IncidentCard';
import styles from '../Styles/homePage.module.css';

const HomePage = () => {
  const [incidents, setIncidents] = useState([]);
  const [votableIncidents, setVotableIncidents] = useState([]);
  const [approvedIncidents, setApprovedIncidents] = useState([]);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/incidents");
        const votable = response.data.filter(incident => !incident.isApproved);
        const approved = response.data.filter(incident => incident.isApproved);

        console.log("Fetched incidents:", response.data); // Log the fetched incidents

        setIncidents(response.data);
        setVotableIncidents(votable);
        setApprovedIncidents(approved);
      } catch (error) {
        console.error("Error fetching incidents:", error);
      }
    };

    fetchIncidents();
  }, []);

  return (
    <div className={styles.homePageContainer}>
      <h1 className={styles.pageTitle}>Accessibility Issues</h1>

      <div className={styles.incidentsSection}>
        <h2>Pending Approval</h2>
        <div className={styles.incidentsList}>
          {votableIncidents.length === 0 ? (
            <p>No incidents pending approval.</p>
          ) : (
            votableIncidents.map((incident) => (
              <IncidentCard
                key={incident._id}
                incident={incident}
                setIncidents={setIncidents}
              />
            ))
          )}
        </div>
      </div>

      <div className={styles.incidentsSection}>
        <h2>Approved Incidents</h2>
        <div className={styles.incidentsList}>
          {approvedIncidents.length === 0 ? (
            <p>No approved incidents yet.</p>
          ) : (
            approvedIncidents.map((incident) => (
              <IncidentCard
                key={incident._id}
                incident={incident}
                setIncidents={setIncidents}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
