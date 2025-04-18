import React, { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { FaTimesCircle } from "react-icons/fa";
import styles from "./Styles/mapComponent.module.css";

const MAPTILER_API_KEY = "cCGFKdLt6GaL3uaEclfS";
const MAP_ID = "streets-v2";
const OPENCAGE_API_KEY = "d64d00a8cf1e4162877782abefaf3dfa";

const defaultIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const rampIcon = new L.Icon({
  iconUrl: "https://example.com/new-ramp-icon.png", // Replace with a new URL
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const elevatorIcon = new L.Icon({
  iconUrl: "https://example.com/new-elevator-icon.png", // Replace with a new URL
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const escalatorIcon = new L.Icon({
  iconUrl: "https://example.com/new-escalator-icon.png", // Replace with a new URL
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const wheelchairIcon = new L.Icon({
  iconUrl: "https://example.com/new-wheelchair-icon.png", // Replace with a new URL
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

const FullScreenMap = ({ onLocationSelect, selectedType, onClearLocation, isReportingMode }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [marker, setMarker] = useState(null);
  const [backendIncidents, setBackendIncidents] = useState([]);

  const getIconByType = (type) => {
    switch (type) {
      case "ramp": return rampIcon;
      case "elevator": return elevatorIcon;
      case "escalator": return escalatorIcon;
      case "wheelchair": return wheelchairIcon;
      default: return defaultIcon;
    }
  };

  const fetchIncidents = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:5001/api/incidents');
      const data = await response.json();
      const valid = data.filter(inc => inc.latitude && inc.longitude);
      setBackendIncidents(valid);
    } catch (err) {
      console.error("Error fetching incidents:", err);
    }
  }, []);

  const getPlaceName = async (lat, lng) => {
    try {
      const res = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${OPENCAGE_API_KEY}&language=en`);
      const data = await res.json();
      return data?.results?.[0]?.formatted || `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
    } catch (err) {
      console.error("Error fetching place name:", err);
      return `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
    }
  };

  const clearMarker = useCallback(() => {
    if (map && marker) {
      map.removeLayer(marker);
      setMarker(null);
      onClearLocation();
    }
  }, [map, marker, onClearLocation]);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        console.error("Geolocation error:", err);
        alert("Enable location services to use the map.");
      }
    );
  }, []);

  useEffect(() => {
    if (currentPosition && !map) {
      const leafletMap = L.map(mapRef.current).setView([currentPosition.lat, currentPosition.lng], 15);

      L.tileLayer(`https://api.maptiler.com/maps/${MAP_ID}/256/{z}/{x}/{y}.png?key=${MAPTILER_API_KEY}`, {
        attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a>',
      }).addTo(leafletMap);

      if (!isReportingMode) {
        L.marker([currentPosition.lat, currentPosition.lng], { icon: defaultIcon })
          .addTo(leafletMap)
          .bindPopup(`Your current location`)
          .openPopup();
      }

      setMap(leafletMap);

      if (isReportingMode) {
        const handleMapClick = async (e) => {
          const { lat, lng } = e.latlng;
          if (marker) {
            leafletMap.removeLayer(marker);
            setMarker(null);
          }
          const placeName = await getPlaceName(lat, lng);
          const icon = getIconByType(selectedType);
          const newMarker = L.marker([lat, lng], { icon })
            .addTo(leafletMap)
            .bindPopup(
              `<b>Selected Location</b><br/>${placeName}<br/><span style="cursor:pointer; color:red;">Remove</span>`
            )
            .on("popupopen", (event) => {
              const content = event.popup.getElement();
              if (content) {
                const removeSpan = content.querySelector("span");
                if (removeSpan) {
                  removeSpan.addEventListener("click", clearMarker);
                }
              }
            })
            .openPopup();
          setMarker(newMarker);
          onLocationSelect(lat, lng, placeName);
        };

        leafletMap.on("click", handleMapClick);

        const provider = new OpenStreetMapProvider();
        const searchControl = new GeoSearchControl({
          provider,
          style: "bar",
          showMarker: false,
          showPopup: false,
          autoComplete: true,
          autoCompleteDelay: 250,
          retainZoomLevel: false,
          animateZoom: true,
          keepResult: false,
        });

        leafletMap.addControl(searchControl);

        leafletMap.on("geosearch/showlocation", async (result) => {
          const { location } = result;
          if (marker) {
            leafletMap.removeLayer(marker);
            setMarker(null);
          }
          const icon = getIconByType(selectedType);
          const placeName = await getPlaceName(location.lat, location.lng);
          const newMarker = L.marker([location.lat, location.lng], { icon })
            .addTo(leafletMap)
            .bindPopup(
              `<b>Selected Location</b><br/>${placeName}<br/><span style="cursor:pointer; color:red;">Remove</span>`
            )
            .on("popupopen", (event) => {
              const content = event.popup.getElement();
              if (content) {
                const removeSpan = content.querySelector("span");
                if (removeSpan) {
                  removeSpan.addEventListener("click", clearMarker);
                }
              }
            })
            .openPopup();
          setMarker(newMarker);
          onLocationSelect(location.lat, location.lng, placeName);
        });
      }
    }
  }, [currentPosition, map, isReportingMode, marker, onLocationSelect, selectedType, clearMarker]);

  useEffect(() => {
    if (map && !isReportingMode) {
      backendIncidents.forEach((incident) => {
        const icon = getIconByType(incident.type);
        L.marker([incident.latitude, incident.longitude], { icon })
          .addTo(map)
          .bindPopup(`<b>${incident.title}</b><br/>${incident.description}`);
      });
    }
  }, [map, backendIncidents, isReportingMode]);

  return (
    <div className={styles.mapContainer}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
};

export default FullScreenMap;
