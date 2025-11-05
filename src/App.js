import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import PatientDashboard from "./pages/PatientDashboard";
import ResearcherDashboard from "./pages/ResearcherDashboard";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";

function App() {

  
  return (
    <Router>
      <AuthProvider>
        {/* Navbar stays visible across all pages */}
        <Navbar />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/patient-dashboard" element={<PatientDashboard />} />
          <Route path="/researcher-dashboard" element={<ResearcherDashboard />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
