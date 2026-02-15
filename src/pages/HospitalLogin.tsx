import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/AuthLayout";
import FormField from "@/components/FormField";
import { toast } from "sonner";
import { UserPlus } from "lucide-react";
import { apiUrl } from "@/lib/api";

const HospitalLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ id: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(apiUrl("/api/auth/hospital/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: form.id.trim(),
          password: form.password,
          phone: form.phone,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Login failed.");
        return;
      }

      if (data.success && data.token && data.user) {
        localStorage.setItem("hospitalToken", data.token);
        localStorage.setItem("hospitalUser", JSON.stringify(data.user));
        toast.success("Login successful!");
        navigate("/hospital/dashboard");
      } else {
        toast.error("Invalid response from server.");
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === "AbortError") {
        toast.error("Request timed out. Is the backend running? Run 'npm start' from the Launch Signup folder.");
      } else {
        toast.error("Could not reach server. Run 'npm start' from the Launch Signup folder.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Hospital Login" subtitle="Access your hospital management portal">
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Hospital ID" name="id" placeholder="HOS-XXXXXX" required value={form.id} onChange={(v) => setForm({ ...form, id: v })} />
        <FormField label="Password" name="password" type="password" placeholder="••••••••" required value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
        <FormField label="Phone Number" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" required value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        <Button type="submit" className="w-full gradient-primary text-primary-foreground rounded-xl font-semibold h-12" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </Button>
        <Button
          type="button"
          variant="outline"
          className="w-full rounded-xl font-semibold h-12 gap-2 border-border/60 hover:bg-primary/5 hover:border-primary/30"
          onClick={() => navigate("/doctor-signup")}
        >
          <UserPlus className="w-4 h-4" />
          Add Doctor
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          New hospital?{" "}
          <a href="/hospital-register" className="text-primary font-medium hover:underline">Register here</a>
        </p>
      </form>
    </AuthLayout>
  );
};

export default HospitalLogin;
