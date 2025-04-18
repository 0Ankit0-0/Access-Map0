import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import styles from "../Styles/reportIncident.module.css";
import MapComponent from './MapComponent';

const ReportIncident = () => {
  const [incidentData, setIncidentData] = useState({
    title: "",
    description: "",
    latitude: null,
    longitude: null,
    placeName: "",
    type: "incident",
    image: null,
  });

  const handleLocationSelect = (lat, lng, name) => {
    setIncidentData((prev) => ({
      ...prev,
      latitude: Number(lat),
      longitude: Number(lng),
      placeName: name,
    }));
  };

  const handleClearLocation = () => {
    setIncidentData((prev) => ({
      ...prev,
      latitude: null,
      longitude: null,
      placeName: "",
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setIncidentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setIncidentData((prev) => ({
      ...prev,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
      toast.error("You must be logged in to report an incident.");
      return;
    }

    const { latitude, longitude } = incidentData;

    console.log("Submitting incident data:", incidentData); // Log the incident data

    if (!latitude || !longitude || isNaN(latitude) || isNaN(longitude)) {
      toast.error("Please select a valid location on the map.");
      return;
    }

    try {
      const formData = new FormData();
      for (const key in incidentData) {
        if (incidentData[key] !== null && incidentData[key] !== undefined) {
          formData.append(key, incidentData[key]);
        }
      }

      console.log("FormData before sending:", formData); // Log the FormData

      const response = await axios.post(
        "http://localhost:5001/api/incident/report",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log("Response from backend:", response.data); // Log the response data

      toast.success("Incident reported successfully!");
      setIncidentData({
        title: "",
        description: "",
        latitude: null,
        longitude: null,
        placeName: "",
        type: "incident",
        image: null,
      });
    } catch (error) {
      toast.error("Error reporting incident: " + (error.response?.data?.message || "Please try again."));
      console.error("Error reporting incident: ", error);
    }
  };

  return (
    <div className={styles.reportIncidentContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h2>Report an Incident</h2>

        <div className={styles.mapContainer}>
          <MapComponent
            onLocationSelect={handleLocationSelect}
            selectedType={incidentData.type}
            onClearLocation={handleClearLocation}
            isReportingMode={true}
            incidentData={incidentData} // Pass incidentData as a prop
          />
          <p>Selected Location: {incidentData.placeName || "Click on the map or search for a location"}</p>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="title">Incident Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={incidentData.title}
            onChange={handleChange}
            placeholder="Enter incident title"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={incidentData.description}
            onChange={handleChange}
            placeholder="Describe the incident"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="latitude">Latitude</label>
          <input
            type="number"
            step="any"
            id="latitude"
            name="latitude"
            value={incidentData.latitude || ''}
            onChange={handleChange}
            placeholder="Enter latitude"
            required
          />
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="longitude">Longitude</label>
          <input
            type="number"
            step="any"
            id="longitude"
            name="longitude"
            value={incidentData.longitude || ''}
            onChange={handleChange}
            placeholder="Enter longitude"
            required
          />
        </div>

        {incidentData.latitude && incidentData.longitude && (
          <div className={styles.locationInfo}>
            <p>Latitude: {incidentData.latitude}</p>
            <p>Longitude: {incidentData.longitude}</p>
          </div>
        )}

        <div className={styles.inputGroup}>
          <label htmlFor="type">Incident Type</label>
          <select
            id="type"
            name="type"
            value={incidentData.type}
            onChange={handleChange}
            required
          >
            <option value="incident">Incident</option>
            <option value="ramp">Ramp</option>
            <option value="elevator">Elevator</option>
            <option value="escalator">Escalator</option>
            <option value="wheelchair">Wheelchair</option>
          </select>
        </div>

        <div className={styles.inputGroup}>
          <label htmlFor="image">Upload Image (Optional)</label>
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
          />
        </div>

        <button
          type="submit"
          className={styles.submitButton}
          disabled={!incidentData.latitude || !incidentData.longitude}
        >
          Report Incident
        </button>
        {
          (!incidentData.latitude || !incidentData.longitude) && (
            <p className={styles.locationWarning}>Please select a valid location on the map.</p>
          )
        }
      </form>
    </div>
  );
};

export default ReportIncident;
