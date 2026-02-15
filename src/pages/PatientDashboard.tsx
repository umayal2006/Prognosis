import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, LogOut } from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";

const PatientDashboard = () => {
  const navigate = useNavigate();
  const userStr = localStorage.getItem("patientUser");
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem("patientToken");
    localStorage.removeItem("patientUser");
    navigate("/patient-login");
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      <header className="p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Logo />
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl gap-2 border-border/60"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg text-center"
        >
          <div className="glass-card-strong p-8">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
              <Heart className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold font-display text-foreground mb-2">
              Welcome back{user?.name ? `, ${user.name}` : ""}
            </h1>
            <p className="text-muted-foreground mb-6">
              You are logged in as a patient. Your health dashboard will appear here once more features are connected.
            </p>
            <p className="text-sm text-muted-foreground">
              Logged in as: {user?.phone ?? user?.email ?? "Patient"}
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PatientDashboard;
