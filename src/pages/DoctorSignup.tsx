import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/AuthLayout";
import FormField from "@/components/FormField";
import { toast } from "sonner";
import { apiUrl } from "@/lib/api";

const DoctorSignup = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(apiUrl("/api/auth/doctor/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone,
          password: form.password,
        }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed.");
        return;
      }

      if (data.success && data.doctor) {
        toast.success("Doctor registered successfully.");
        setForm({ name: "", email: "", phone: "", password: "" });
        navigate("/hospital/dashboard", { state: { newDoctor: data.doctor } });
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
    <AuthLayout title="Add Doctor" subtitle="Register a new doctor for your hospital">
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Full Name" name="name" placeholder="Dr. John Doe" required value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
        <FormField label="Email" name="email" type="email" placeholder="doctor@hospital.com" required value={form.email} onChange={(v) => setForm({ ...form, email: v })} />
        <FormField label="Phone Number" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" required value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        <FormField label="Password" name="password" type="password" placeholder="••••••••" required value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
        <Button type="submit" className="w-full gradient-primary text-primary-foreground rounded-xl font-semibold h-12" disabled={loading}>
          {loading ? "Adding…" : "Add Doctor"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default DoctorSignup;
