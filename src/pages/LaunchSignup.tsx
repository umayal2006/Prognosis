import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { User, Building2, ShieldCheck } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";

const options = [
  { id: "patient", label: "Patient Login", path: "/patient-login", icon: User, color: "from-primary to-accent" },
  { id: "admin", label: "Admin Login", path: "/admin-login", icon: ShieldCheck, color: "from-primary to-info" },
  { id: "hospital", label: "Hospital Login", path: "/hospital-login", icon: Building2, color: "from-accent to-primary" },
];

const LaunchSignup = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout title="Welcome" subtitle="Choose how you want to sign in" showBack={false}>
      <div className="space-y-4">
        {options.map((opt, i) => (
          <motion.div
            key={opt.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center gap-4 p-4 h-auto rounded-xl border border-border/60 bg-background/50 hover:bg-primary/5 hover:border-primary/30 transition-all group text-left font-semibold"
              onClick={() => navigate(opt.path)}
            >
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${opt.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                <opt.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              {opt.label}
            </Button>
          </motion.div>
        ))}
      </div>
    </AuthLayout>
  );
};

export default LaunchSignup;
