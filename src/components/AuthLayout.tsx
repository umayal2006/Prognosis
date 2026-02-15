import { ReactNode } from "react";
import { motion } from "framer-motion";
import Logo from "./Logo";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
  showBack?: boolean;
}

const AuthLayout = ({ children, title, subtitle, showBack = true }: AuthLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      <header className="p-6 flex items-center justify-between">
        <Logo />
        {showBack && (
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-lg"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold font-display text-foreground">{title}</h1>
            {subtitle && <p className="mt-2 text-muted-foreground">{subtitle}</p>}
          </div>
          <div className="glass-card-strong p-8">
            {children}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AuthLayout;
