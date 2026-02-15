import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";
import LaunchSignup from "./pages/LaunchSignup";
import Index from "./pages/Index";
import RoleSelect from "./pages/RoleSelect";
import PatientLogin from "./pages/PatientLogin";
import PatientRegister from "./pages/PatientRegister";
import HospitalLogin from "./pages/HospitalLogin";
import HospitalRegister from "./pages/HospitalRegister";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import AdminDashboard from "./pages/AdminDashboard";
import DoctorSignup from "./pages/DoctorSignup";
import PatientDashboard from "./pages/PatientDashboard";
import HospitalDashboard from "./pages/HospitalDashboard";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

function RedirectFromQuery() {
  const navigate = useNavigate();
  const location = useLocation();
  useEffect(() => {
    const go = new URLSearchParams(location.search).get("go");
    if (go && location.pathname === "/") {
      navigate(go.startsWith("/") ? go : `/${go}`, { replace: true });
    }
  }, [location.search, location.pathname, navigate]);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <RedirectFromQuery />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/launch" element={<LaunchSignup />} />
          <Route path="/patient-login" element={<PatientLogin />} />
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/admin-login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/hospital-login" element={<HospitalLogin />} />
          <Route path="/hospital/dashboard" element={<HospitalDashboard />} />
          <Route path="/doctor-signup" element={<DoctorSignup />} />
          <Route path="/home" element={<Index />} />
          <Route path="/login" element={<RoleSelect />} />
          <Route path="/signup" element={<RoleSelect />} />
          <Route path="/patient-register" element={<PatientRegister />} />
          <Route path="/hospital-register" element={<HospitalRegister />} />
          <Route path="/admin-register" element={<AdminRegister />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
