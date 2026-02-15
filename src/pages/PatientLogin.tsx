import { useState } from "react";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/AuthLayout";
import FormField from "@/components/FormField";
import { toast } from "sonner";
import { apiUrl } from "@/lib/api";

const PatientLogin = () => {
  const [form, setForm] = useState({ phone: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(apiUrl("/api/auth/patient/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: form.phone,
          password: form.password,
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
        localStorage.setItem("patientToken", data.token);
        localStorage.setItem("patientUser", JSON.stringify(data.user));
        toast.success("Login successful!");
        const patientAppUrl = import.meta.env.VITE_PATIENT_APP_URL || "http://localhost:5174";
        window.location.href = patientAppUrl;
      } else {
        toast.error("Invalid response from server.");
      }
    } catch (err) {
      clearTimeout(timeoutId);
      if (err instanceof Error && err.name === "AbortError") {
        toast.error("Request timed out. Run 'npm start' from the Launch Signup folder.");
      } else {
        toast.error("Could not reach server. Run 'npm start' from the Launch Signup folder.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Patient Login" subtitle="Sign in with your mobile number">
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Mobile Number" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" required value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        <FormField label="Email (Optional)" name="email" type="email" placeholder="you@email.com" value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <FormField label="Password" name="password" type="password" placeholder="••••••••" required value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
        <Button type="submit" className="w-full gradient-primary text-primary-foreground rounded-xl font-semibold h-12" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{" "}
          <a href="/patient-register" className="text-primary font-medium hover:underline">Register</a>
        </p>
      </form>
    </AuthLayout>
  );
};

export default PatientLogin;
