import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import defaultImage from './map.jpg';
import styles from '../Styles/incidentCard.module.css';

const IncidentCard = ({ incident, setIncidents }) => {
  const [voted, setVoted] = useState(false);

  const handleVote = async () => {
    if (voted) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("You need to be logged in to vote!");
        return;
      }

      const response = await axios.post(
        `http://localhost:5001/api/incident/${incident._id}/vote`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const updatedIncident = response.data;
      setIncidents(prev =>
        prev.map(inc => (inc._id === updatedIncident._id ? updatedIncident : inc))
      );

      toast.success("Vote counted!");
      setVoted(true); // Ensure this line is present
    } catch (error) {
      toast.error("Error voting on incident.");
    }
  };

  return (
    <div className={styles.incidentCard}>
      <img
        src={incident.image || defaultImage}
        alt={incident.title}
        className={styles.incidentImage}
      />
      <h3>{incident.title}</h3>
      <p>{incident.description}</p>
      <p className={styles.votes}>Votes: {incident.votes}</p>
      <p>Location: {incident.placeName}</p>
      {!incident.isApproved && (
        <button onClick={handleVote} disabled={voted}>
          {voted ? 'Voted' : 'Vote for Approval'}
        </button>
      )}
    </div>
  );
};

export default IncidentCard;
