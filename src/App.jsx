import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";
import { testConnection } from "./services/api";
import Homepage from "./pages/HomePage";
import SalonDetailsPage from "./pages/SalonDetailsPage";

function App() {
  const [message, setMessage] = useState("Loading...");
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkBackendConnection = async () => {
      try {
        const response = await testConnection();
        setMessage(response);
      } catch (err) {
        setError("Failed to connect to backend");
        console.error("Connection error:", err);
      }
    };

    checkBackendConnection();
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/salon/:salonId" element={<SalonDetailsPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
