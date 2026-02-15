import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, User, ShieldCheck } from "lucide-react";
import AuthLayout from "@/components/AuthLayout";

const roles = [
  { id: "patient", label: "Patient", icon: User, desc: "Access your health records and AI insights", color: "from-primary to-accent" },
  { id: "hospital", label: "Hospital", icon: Building2, desc: "Manage your hospital, staff and patients", color: "from-accent to-primary" },
  { id: "admin", label: "Admin", icon: ShieldCheck, desc: "System administration and monitoring", color: "from-primary to-info" },
];

const RoleSelect = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isLogin = location.pathname === "/login";

  const availableRoles = roles;

  const handleSelect = (roleId: string) => {
    if (isLogin) {
      navigate(`/${roleId}-login`);
    } else {
      navigate(`/${roleId}-register`);
    }
  };

  return (
    <AuthLayout
      title={isLogin ? "Welcome Back" : "Create Account"}
      subtitle={`Select your role to ${isLogin ? "login" : "register"}`}
    >
      <div className="space-y-4">
        {availableRoles.map((role, i) => (
          <motion.button
            key={role.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            onClick={() => handleSelect(role.id)}
            className="w-full flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-background/50 hover:bg-primary/5 hover:border-primary/30 transition-all group text-left"
          >
            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
              <role.icon className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <div className="font-semibold text-foreground">{role.label}</div>
              <div className="text-sm text-muted-foreground">{role.desc}</div>
            </div>
          </motion.button>
        ))}
      </div>
    </AuthLayout>
  );
};

export default RoleSelect;
