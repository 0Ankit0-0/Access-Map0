import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/navbar";
import HomePage from "./components/pages/Homepage";
import ReportIncident from "./components/Incident/ReportIncident";
import Login from "./components/forms/Login";
import Signup from "./components/forms/SignUp";
import FullScreenMap from "./components/FullScreenMap";
import Profile from "./components/pages/AboutUs";
import ProtectedRoute from "./components/ProtectedRoute";
import AboutUs from "./components/pages/AboutUs";

const App = () => {
  const [user, setUser] = useState(null); // State to hold user data

  return (
    <Router>
      <Navbar user={user} setUser={setUser} />
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute user={user}>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/map"
          element={
            <ProtectedRoute user={user}>
              <FullScreenMap />
            </ProtectedRoute>
          }
        />
        <Route
          path="/about"
          element={
            <ProtectedRoute user={user}>
              <AboutUs />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report-incident"
          element={
            <ProtectedRoute user={user}>
              <ReportIncident />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute user={user}>
              <Profile user={user} setUser={setUser} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
