import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Activity, Shield, Brain, Heart, ChevronDown, ArrowRight, Sparkles, Users, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/Logo";

const Index = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen gradient-hero">
      {/* Nav */}
      <header className="relative z-20 flex items-center justify-between p-6 max-w-7xl mx-auto">
        <Logo />
        <div className="relative">
          <Button
            variant="outline"
            className="rounded-xl border-border/60 bg-card/60 backdrop-blur-sm font-medium gap-1.5"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            Get Started <ChevronDown className="w-4 h-4" />
          </Button>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute right-0 mt-2 w-44 glass-card-strong p-2 space-y-1 z-50"
            >
              <button
                onClick={() => { setMenuOpen(false); navigate("/login"); }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-primary/10 transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => { setMenuOpen(false); navigate("/launch"); }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-primary/10 transition-colors"
              >
                Launch (Patient / Admin / Hospital)
              </button>
              <button
                onClick={() => { setMenuOpen(false); navigate("/signup"); }}
                className="w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium text-foreground hover:bg-primary/10 transition-colors"
              >
                Sign Up
              </button>
            </motion.div>
          )}
        </div>
      </header>

      {/* Hero */}
      <main className="relative max-w-7xl mx-auto px-6 pt-12 pb-24">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Sparkles className="w-4 h-4" /> AI-Powered Healthcare
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold font-display text-foreground leading-tight mb-6">
              Smarter Health,{" "}
              <span className="text-gradient">Better Outcomes</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-md">
              Prognosis uses advanced AI to predict health risks, streamline hospital management, and empower patients with proactive care insights.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="gradient-primary text-primary-foreground rounded-xl font-semibold gap-2 shadow-lg hover:shadow-xl transition-shadow"
                onClick={() => navigate("/launch")}
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl border-border/60 font-semibold"
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative rounded-3xl overflow-hidden shadow-2xl float-animation aspect-[4/3] bg-gradient-to-br from-primary/20 via-primary/10 to-accent/20 flex items-center justify-center">
              <Heart className="w-24 h-24 text-primary/40" />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent" />
            </div>
          </motion.div>
        </div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="grid md:grid-cols-3 gap-6 mt-24"
        >
          {[
            { icon: Brain, title: "AI Predictions", desc: "Advanced models predict health risks before they escalate." },
            { icon: Shield, title: "Secure & Compliant", desc: "NABH/JCI compliant with encrypted data handling." },
            { icon: Heart, title: "Patient First", desc: "Personalized care insights for better health outcomes." },
          ].map((f, i) => (
            <div key={i} className="glass-card p-6 group hover:shadow-lg transition-all duration-300">
              <div className="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="w-6 h-6 text-primary-foreground" />
              </div>
              <h3 className="text-lg font-semibold font-display text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.6 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16"
        >
          {[
            { icon: Building2, val: "500+", label: "Hospitals" },
            { icon: Users, val: "10K+", label: "Doctors" },
            { icon: Heart, val: "1M+", label: "Patients" },
            { icon: Activity, val: "99.9%", label: "Uptime" },
          ].map((s, i) => (
            <div key={i} className="text-center glass-card p-6">
              <s.icon className="w-6 h-6 text-primary mx-auto mb-2" />
              <div className="text-2xl font-bold font-display text-foreground">{s.val}</div>
              <div className="text-sm text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        © 2026 Prognosis. All rights reserved. Predict. Prevent. Protect.
      </footer>
    </div>
  );
};

export default Index;
