import React, { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-geosearch/dist/geosearch.css";
import { GeoSearchControl, OpenStreetMapProvider } from "leaflet-geosearch";
import { FaTimesCircle } from "react-icons/fa";
import styles from "../Styles/mapComponent.module.css";

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

const MapComponent = ({ onLocationSelect, selectedType, onClearLocation, isReportingMode, incidentData }) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [marker, setMarker] = useState(null);
  const [placeName, setPlaceName] = useState("");
  const [backendIncidents, setBackendIncidents] = useState([]);

  const getIconByType = (type) => {
    switch (type) {
      case "ramp":
        return rampIcon;
      case "elevator":
        return elevatorIcon;
      case "escalator":
        return escalatorIcon;
      case "wheelchair":
        return wheelchairIcon;
      default:
        return defaultIcon;
    }
  };

  const fetchIncidents = useCallback(async () => {
    try {
      const response = await fetch('https://access-map0.onrender.com/api/incidents');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const validIncidents = data.filter(incident => incident.latitude && incident.longitude);
      setBackendIncidents(validIncidents);
    } catch (error) {
      console.error("Error fetching incidents:", error);
      setBackendIncidents([]);
    }
  }, []);

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  useEffect(() => {
    if (map) {
      map.eachLayer((layer) => {
        if (layer instanceof L.Marker && layer !== marker) {
          map.removeLayer(layer);
        }
      });

      if (!isReportingMode) {
        backendIncidents.forEach((incident) => {
          if (incident.latitude && incident.longitude) {
            const incidentIcon = getIconByType(incident.type);
            L.marker([incident.latitude, incident.longitude], { icon: incidentIcon })
              .addTo(map)
              .bindPopup(`<b>${incident.title}</b><br/>${incident.description}`);
          }
        });
      }
    }
  }, [map, backendIncidents, getIconByType, marker, isReportingMode]);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCurrentPosition({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      (error) => {
        console.error("Error getting location", error);
        alert("Enable location services to use the map.");
      }
    );
  }, []);

  const getPlaceName = async (lat, lng) => {
    try {
      const response = await fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=${OPENCAGE_API_KEY}&language=en`
      );
      const data = await response.json();
      if (data?.results?.[0]?.formatted) {
        setPlaceName(data.results[0].formatted);
        return data.results[0].formatted;
      }
      setPlaceName(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
      return `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
    } catch (error) {
      console.error("Error fetching place name:", error);
      setPlaceName(`Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`);
      return `Lat: ${lat.toFixed(4)}, Lng: ${lng.toFixed(4)}`;
    }
  };

  const clearMarker = useCallback(() => {
    if (map && marker) {
      map.removeLayer(marker);
      setMarker(null);
      setPlaceName("");
      onClearLocation();
    }
  }, [map, marker, onClearLocation]);

  useEffect(() => {
    if (currentPosition && !map && typeof onLocationSelect === 'function') {
      const leafletMap = L.map(mapRef.current).setView(
        [currentPosition.lat, currentPosition.lng],
        15
      );

      L.tileLayer(
        `https://api.maptiler.com/maps/${MAP_ID}/256/{z}/{x}/{y}.png?key=${MAPTILER_API_KEY}`,
        {
          attribution: '&copy; <a href="https://www.maptiler.com/">MapTiler</a>',
        }
      ).addTo(leafletMap);

      if (isReportingMode) {
        const initialMarker = L.marker([currentPosition.lat, currentPosition.lng], {
          icon: defaultIcon,
        })
          .addTo(leafletMap)
          .bindPopup(`Your current location`)
          .openPopup();
        setMarker(initialMarker);
        getPlaceName(currentPosition.lat, currentPosition.lng).then((name) => {
          onLocationSelect(currentPosition.lat, currentPosition.lng, name);
        });

        const handleMapClick = async (e) => {
          const { lat, lng } = e.latlng;
          if (marker) {
            leafletMap.removeLayer(marker);
            setMarker(null);
          }
          const newPlaceName = await getPlaceName(lat, lng);
          const currentIcon = getIconByType(selectedType);
          const newMarker = L.marker([lat, lng], { icon: currentIcon })
            .addTo(leafletMap)
            .bindPopup(
              `<b>Selected Location</b><br/>${newPlaceName}<br/><span style="cursor:pointer; color:red;"><FaTimesCircle /> Remove</span>`
            )
            .on("popupopen", (event) => {
              const popupContent = event.popup.getElement();
              if (popupContent) {
                const removeSpan = popupContent.querySelector("span");
                if (removeSpan) {
                  removeSpan.addEventListener("click", clearMarker);
                }
              }
            })
            .openPopup();
          setMarker(newMarker);
          onLocationSelect(lat, lng, newPlaceName);
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
        leafletMap.on("geosearch/showlocation", (result) => {
          const { location } = result;
          if (marker) {
            leafletMap.removeLayer(marker);
            setMarker(null);
          }
          const newMarker = L.marker([location.lat, location.lng], { icon: getIconByType(selectedType) })
            .addTo(leafletMap)
            .bindPopup(
              `<b>Selected Location</b><br/>${location.formatted}<br/><span style="cursor:pointer; color:red;"><FaTimesCircle /> Remove</span>`
            )
            .on("popupopen", (event) => {
              const popupContent = event.popup.getElement();
              if (popupContent) {
                const removeSpan = popupContent.querySelector("span");
                if (removeSpan) {
                  removeSpan.addEventListener("click", clearMarker);
                }
              }
            })
            .openPopup();
          setMarker(newMarker);
          onLocationSelect(location.lat, location.lng, location.formatted);
        });
      } else {
        L.marker([currentPosition.lat, currentPosition.lng], {
          icon: defaultIcon,
        })
          .addTo(leafletMap)
          .bindPopup(`Your current location`)
          .openPopup();
      }

      setMap(leafletMap);
    }
  }, [currentPosition, map, onLocationSelect, selectedType, clearMarker, fetchIncidents, isReportingMode]);

  return (
    <div className={styles.mapContainer}>
      <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
      {incidentData.latitude && incidentData.longitude && (
        <div className={styles.locationInfo}>
          <p>Latitude: {incidentData.latitude}</p>
          <p>Longitude: {incidentData.longitude}</p>
        </div>
      )}
    </div>
  );
};

export default MapComponent;
