import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/AuthLayout";
import FormField from "@/components/FormField";
import ProgressBar from "@/components/ProgressBar";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { apiUrl } from "@/lib/api";

const steps = ["Basic Information", "Contact Information"];

const PatientRegister = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const set = (key: string) => (v: string) => setForm((f) => ({ ...f, [key]: v }));

  const next = () => { if (step < steps.length - 1) setStep(step + 1); };
  const prev = () => { if (step > 0) setStep(step - 1); };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl("/api/auth/patient/register"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          dob: form.dob,
          gender: form.gender,
          blood: form.blood,
          aadhaar: form.aadhaar,
          password: form.password,
          phone: form.phone,
          email: form.email,
          address: form.address,
          emergName: form.emergName,
          emergPhone: form.emergPhone,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message || "Registration failed.");
        return;
      }

      if (data.success && data.token && data.user) {
        localStorage.setItem("patientToken", data.token);
        localStorage.setItem("patientUser", JSON.stringify(data.user));
        toast.success(`Registration successful! Your Patient ID: ${data.user.id}`, { duration: 5000 });
        const patientAppUrl = import.meta.env.VITE_PATIENT_APP_URL || "http://localhost:5174";
        window.location.href = patientAppUrl;
      } else {
        toast.error("Invalid response from server.");
      }
    } catch {
      toast.error("Could not reach server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Patient Registration" subtitle="Create your health profile">
      <ProgressBar currentStep={step} totalSteps={steps.length} labels={steps} />

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="mt-6 space-y-4"
        >
          {step === 0 && (
            <>
              <FormField label="Full Name" name="name" placeholder="John Doe" required value={form.name} onChange={set("name")} />
              <div className="grid grid-cols-2 gap-4">
                <FormField label="Date of Birth" name="dob" type="date" required value={form.dob} onChange={set("dob")} />
                <FormField label="Gender" name="gender" required value={form.gender} onChange={set("gender")} options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]} />
              </div>
              <FormField label="Blood Group" name="blood" value={form.blood} onChange={set("blood")} options={[
                { value: "A+", label: "A+" }, { value: "A-", label: "A-" },
                { value: "B+", label: "B+" }, { value: "B-", label: "B-" },
                { value: "O+", label: "O+" }, { value: "O-", label: "O-" },
                { value: "AB+", label: "AB+" }, { value: "AB-", label: "AB-" },
              ]} />
              <FormField label="Aadhaar / National ID (Optional)" name="aadhaar" placeholder="XXXX-XXXX-XXXX" value={form.aadhaar} onChange={set("aadhaar")} />
              <FormField label="Password" name="password" type="password" placeholder="Create a strong password" required value={form.password} onChange={set("password")} />
            </>
          )}

          {step === 1 && (
            <>
              <FormField label="Phone Number" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" required value={form.phone} onChange={set("phone")} />
              <FormField label="Email" name="email" type="email" placeholder="you@email.com" value={form.email} onChange={set("email")} />
              <FormField label="Address" name="address" type="textarea" placeholder="Full address" value={form.address} onChange={set("address")} />
              <FormField label="Emergency Contact Name" name="emergName" placeholder="Contact name" required value={form.emergName} onChange={set("emergName")} />
              <FormField label="Emergency Contact Number" name="emergPhone" type="tel" placeholder="+91 XXXXX XXXXX" required value={form.emergPhone} onChange={set("emergPhone")} />
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <Button variant="outline" onClick={prev} className="flex-1 rounded-xl h-12 gap-2 font-medium">
            <ArrowLeft className="w-4 h-4" /> Back
          </Button>
        )}
        {step < steps.length - 1 ? (
          <Button onClick={next} className="flex-1 gradient-primary text-primary-foreground rounded-xl h-12 gap-2 font-semibold">
            Next <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={handleSubmit} className="flex-1 gradient-primary text-primary-foreground rounded-xl h-12 gap-2 font-semibold" disabled={loading}>
            <CheckCircle2 className="w-4 h-4" /> {loading ? "Registering…" : "Submit Registration"}
          </Button>
        )}
      </div>
    </AuthLayout>
  );
};

export default PatientRegister;
