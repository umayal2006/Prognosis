import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/AuthLayout";
import FormField from "@/components/FormField";
import { toast } from "sonner";
import { apiUrl } from "@/lib/api";

const AdminLogin = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ id: "", password: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [backendReachable, setBackendReachable] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(apiUrl("/api/health"), { method: "GET", mode: "cors" })
      .then((r) => r.ok)
      .then((ok) => { if (!cancelled) setBackendReachable(ok); })
      .catch(() => { if (!cancelled) setBackendReachable(false); });
    return () => { cancelled = true; };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(apiUrl("/api/auth/admin/login"), {
        method: "POST",
        mode: "cors",
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
        localStorage.setItem("adminToken", data.token);
        localStorage.setItem("adminUser", JSON.stringify(data.user));
        toast.success("Login successful!");
        navigate("/admin/dashboard");
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
    <AuthLayout title="Admin Login" subtitle="System administration access">
      {backendReachable === false && (
        <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 px-4 py-3 text-sm text-amber-800 dark:text-amber-200 mb-5">
          <strong>Backend not reachable.</strong> Open a terminal in the <strong>Launch Signup</strong> folder and run: <code className="bg-black/10 px-1.5 py-0.5 rounded">npm start</code>. Then open this app at <a href={`http://localhost:3000/admin-login`} className="underline font-medium">http://localhost:3000/admin-login</a> and try again.
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-5">
        <FormField label="Admin ID" name="id" placeholder="ADM-XXXXXX" required value={form.id} onChange={(v) => setForm({ ...form, id: v })} />
        <FormField label="Password" name="password" type="password" placeholder="••••••••" required value={form.password} onChange={(v) => setForm({ ...form, password: v })} />
        <FormField label="Phone Number" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" required value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        <Button type="submit" className="w-full gradient-primary text-primary-foreground rounded-xl font-semibold h-12" disabled={loading}>
          {loading ? "Signing in…" : "Sign In"}
        </Button>
      </form>
    </AuthLayout>
  );
};

export default AdminLogin;
