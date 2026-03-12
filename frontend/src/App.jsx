import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Onboarding from "./pages/Onboarding";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SelectRole from "./pages/SelectRole";
import Login from "./pages/Login";
import RegisterOwner from "./pages/RegisterOwner";
import RegisterService from "./pages/RegisterService";
import ServiceMap from "./pages/ServiceMap";
import PredictAI from "./pages/PredictAI";
import ServiceDashboard from "./components/ServiceDashboard";
function App() {
  return (
    <Router>

      <Routes>

        {/* Landing Page */}
        <Route path="/" element={<Onboarding />} />

        {/* Role Selection */}
        <Route path="/select-role" element={<SelectRole />} />

        {/* Registration */}
        <Route path="/register-owner" element={<RegisterOwner />} />
        <Route path="/register-service" element={<RegisterService />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path='/login' element={<Login />} />
        <Route path='/service-map' element={<ServiceMap />} />
    <Route path='/predictive-ai' element={<PredictAI />} />
    <Route path="/admin-dashboard" element={<AdminDashboard/>}/>
        <Route path='/service-dashboard' element={<ServiceDashboard />} />
      </Routes>

    </Router>
  );
}

export default App;