import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { OverviewMetrics } from "@/components/dashboard/OverviewMetrics";
import { AIMonitoring } from "@/components/dashboard/AIMonitoring";
import { HospitalVerification } from "@/components/dashboard/HospitalVerification";
import { DoctorMonitoring } from "@/components/dashboard/DoctorMonitoring";
import { PatientManagement } from "@/components/dashboard/PatientManagement";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem("adminUser");
  const user = userStr ? JSON.parse(userStr) : null;

  useEffect(() => {
    if (!localStorage.getItem("adminToken")) {
      navigate("/admin-login", { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminUser");
    navigate("/admin-login");
  };

  if (!localStorage.getItem("adminToken")) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-primary text-primary-foreground">
              <Shield className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-foreground leading-tight">HealthCommand</h1>
              <p className="text-[10px] text-muted-foreground leading-tight">Central Admin Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground hidden sm:block">
              Role: <span className="font-medium text-foreground">Super Admin</span>
            </span>
            <span className="text-xs text-muted-foreground hidden sm:block truncate max-w-[120px]">
              {user?.name ?? user?.id ?? "Admin"}
            </span>
            <Button variant="outline" size="sm" className="h-8 gap-1.5 rounded-lg" onClick={handleLogout}>
              <LogOut className="h-3.5 w-3.5" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        <OverviewMetrics />
        <AIMonitoring />
        <HospitalVerification />
        <DoctorMonitoring />
        <PatientManagement />
      </main>
    </div>
  );
};

export default AdminDashboard;
