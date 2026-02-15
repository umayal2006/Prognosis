import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import AuthLayout from "@/components/AuthLayout";
import FormField from "@/components/FormField";
import ProgressBar from "@/components/ProgressBar";
import { toast } from "sonner";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const stepLabels = [
  "Basic Info", "Location", "Doctors & Staff", "Departments",
  "Infrastructure", "Billing", "Scheduling", "Technical",
  "Legal", "Analytics",
];

const HospitalRegister = () => {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Record<string, string>>({});
  const [toggles, setToggles] = useState<Record<string, boolean>>({});

  const set = (key: string) => (v: string) => setForm((f) => ({ ...f, [key]: v }));
  const tog = (key: string) => setToggles((t) => ({ ...t, [key]: !t[key] }));

  const next = () => { if (step < stepLabels.length - 1) setStep(step + 1); };
  const prev = () => { if (step > 0) setStep(step - 1); };

  const handleSubmit = () => {
    toast.success("Registration submitted! Status: Pending Admin Verification.", { duration: 8000 });
  };

  const ToggleField = ({ label, id }: { label: string; id: string }) => (
    <div className="flex items-center justify-between py-2">
      <Label htmlFor={id} className="text-sm text-foreground">{label}</Label>
      <Switch id={id} checked={!!toggles[id]} onCheckedChange={() => tog(id)} />
    </div>
  );

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          <ProgressBar currentStep={step} totalSteps={stepLabels.length} labels={stepLabels} />
        </div>
      </div>

      <main className="flex-1 flex items-start justify-center p-6 pt-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold font-display text-foreground">Hospital Registration</h1>
            <p className="text-sm text-muted-foreground mt-1">{stepLabels[step]}</p>
          </div>

          <div className="glass-card-strong p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {step === 0 && (
                  <>
                    <FormField label="Hospital Name" name="name" placeholder="City General Hospital" required value={form.name} onChange={set("name")} />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="License Number" name="license" placeholder="REG-XXXXX" required value={form.license} onChange={set("license")} />
                      <FormField label="Year Established" name="year" type="number" placeholder="2000" value={form.year} onChange={set("year")} />
                    </div>
                    <FormField label="Type" name="type" value={form.type} onChange={set("type")} options={[
                      { value: "govt", label: "Government" }, { value: "private", label: "Private" },
                      { value: "trust", label: "Trust" }, { value: "clinic", label: "Clinic" },
                      { value: "multi", label: "Multi-Speciality" },
                    ]} />
                    <FormField label="Category" name="category" value={form.category} onChange={set("category")} options={[
                      { value: "primary", label: "Primary" }, { value: "secondary", label: "Secondary" },
                      { value: "tertiary", label: "Tertiary" },
                    ]} />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Official Email" name="email" type="email" required value={form.email} onChange={set("email")} />
                      <FormField label="Contact Number" name="phone" type="tel" required value={form.phone} onChange={set("phone")} />
                    </div>
                    <FormField label="Website" name="website" placeholder="https://hospital.com" value={form.website} onChange={set("website")} />
                    <FormField label="Password" name="password" type="password" placeholder="Create a strong password" required value={form.password} onChange={set("password")} />
                  </>
                )}

                {step === 1 && (
                  <>
                    <FormField label="Full Address" name="address" type="textarea" required value={form.address} onChange={set("address")} />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="City" name="city" required value={form.city} onChange={set("city")} />
                      <FormField label="State" name="state" required value={form.state} onChange={set("state")} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Pincode" name="pincode" required value={form.pincode} onChange={set("pincode")} />
                      <FormField label="Landmark" name="landmark" value={form.landmark} onChange={set("landmark")} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Latitude" name="lat" placeholder="28.6139" value={form.lat} onChange={set("lat")} />
                      <FormField label="Longitude" name="lng" placeholder="77.2090" value={form.lng} onChange={set("lng")} />
                    </div>
                  </>
                )}

                {step === 2 && (
                  <>
                    <FormField label="Total Doctors" name="totalDocs" type="number" value={form.totalDocs} onChange={set("totalDocs")} />
                    <FormField label="Specializations Available" name="specs" type="textarea" placeholder="Cardiology, Orthopedics, Neurology..." value={form.specs} onChange={set("specs")} />
                    <ToggleField label="On-call Doctors Available?" id="oncall" />
                    <ToggleField label="24x7 Emergency Staff?" id="emergency247" />
                  </>
                )}

                {step === 3 && (
                  <>
                    {["Emergency Medicine", "ICU / NICU / PICU", "Surgery", "Radiology", "Lab", "Ambulance", "Blood Bank", "Telemedicine"].map((dept) => (
                      <ToggleField key={dept} label={dept} id={dept.toLowerCase().replace(/\s/g, "_")} />
                    ))}
                    <ToggleField label="24x7 Pharmacy?" id="pharmacy247" />
                  </>
                )}

                {step === 4 && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Total Beds" name="beds" type="number" value={form.beds} onChange={set("beds")} />
                      <FormField label="ICU Beds" name="icuBeds" type="number" value={form.icuBeds} onChange={set("icuBeds")} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Ventilators" name="vents" type="number" value={form.vents} onChange={set("vents")} />
                      <FormField label="Operation Theatres" name="ots" type="number" value={form.ots} onChange={set("ots")} />
                    </div>
                    <FormField label="Ward Types" name="wards" placeholder="General, Private, Semi-Private" value={form.wards} onChange={set("wards")} />
                    <ToggleField label="Isolation Wards Available?" id="isolation" />
                  </>
                )}

                {step === 5 && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Avg Consultation Fee (₹)" name="consultFee" type="number" value={form.consultFee} onChange={set("consultFee")} />
                      <FormField label="Avg Emergency Cost (₹)" name="emergCost" type="number" value={form.emergCost} onChange={set("emergCost")} />
                    </div>
                    <FormField label="Insurance Partners" name="insurance" placeholder="Star Health, ICICI Lombard..." value={form.insurance} onChange={set("insurance")} />
                    <ToggleField label="Cashless Facility?" id="cashless" />
                    <ToggleField label="UPI / Card / EMI Accepted?" id="digitalPay" />
                  </>
                )}

                {step === 6 && (
                  <>
                    <FormField label="OPD Days" name="opdDays" placeholder="Mon-Sat" value={form.opdDays} onChange={set("opdDays")} />
                    <FormField label="Visiting Hours" name="visitHours" placeholder="10:00 AM - 8:00 PM" value={form.visitHours} onChange={set("visitHours")} />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Slot Duration (min)" name="slotDuration" type="number" placeholder="15" value={form.slotDuration} onChange={set("slotDuration")} />
                      <FormField label="Max Patients/Slot" name="maxPerSlot" type="number" placeholder="5" value={form.maxPerSlot} onChange={set("maxPerSlot")} />
                    </div>
                    <ToggleField label="Real-time Bed Availability?" id="bedAvail" />
                  </>
                )}

                {step === 7 && (
                  <>
                    <ToggleField label="API Available for Integration?" id="api" />
                    <FormField label="Hospital Management System" name="hms" placeholder="e.g., EHR Pro, HMS 360" value={form.hms} onChange={set("hms")} />
                    <ToggleField label="Data Sharing Consent?" id="dataConsent" />
                    <ToggleField label="Real-time Sync?" id="realtime" />
                    <FormField label="Preferred Data Format" name="dataFormat" value={form.dataFormat} onChange={set("dataFormat")} options={[
                      { value: "csv", label: "CSV Upload" }, { value: "api", label: "API Integration" },
                      { value: "both", label: "Both" },
                    ]} />
                  </>
                )}

                {step === 8 && (
                  <>
                    <FormField label="Accreditation" name="accred" value={form.accred} onChange={set("accred")} options={[
                      { value: "nabh", label: "NABH" }, { value: "jci", label: "JCI" },
                      { value: "both", label: "Both" }, { value: "none", label: "None" },
                    ]} />
                    <FormField label="GST Number" name="gst" placeholder="XXXXXXXXXXXX" value={form.gst} onChange={set("gst")} />
                    <ToggleField label="Privacy Policy Agreement" id="privacy" />
                    <ToggleField label="Terms & Conditions Accepted" id="terms" />
                    <ToggleField label="Emergency Protocol Confirmed" id="emergProto" />
                  </>
                )}

                {step === 9 && (
                  <>
                    <p className="text-sm text-muted-foreground mb-2">This section is optional but helps us serve you better.</p>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Avg Footfall/Day" name="footfall" type="number" value={form.footfall} onChange={set("footfall")} />
                      <FormField label="Avg Waiting Time (min)" name="waitTime" type="number" value={form.waitTime} onChange={set("waitTime")} />
                    </div>
                    <FormField label="Common Diseases (Top 10)" name="diseases" type="textarea" placeholder="Diabetes, Hypertension, Dengue..." value={form.diseases} onChange={set("diseases")} />
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Mortality Rate (%)" name="mortality" type="number" value={form.mortality} onChange={set("mortality")} />
                      <FormField label="Readmission Rate (%)" name="readmission" type="number" value={form.readmission} onChange={set("readmission")} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <FormField label="Patient Satisfaction (1-10)" name="satisfaction" type="number" value={form.satisfaction} onChange={set("satisfaction")} />
                      <FormField label="Infection Control Score" name="infection" type="number" value={form.infection} onChange={set("infection")} />
                    </div>
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
              {step < stepLabels.length - 1 ? (
                <Button onClick={next} className="flex-1 gradient-primary text-primary-foreground rounded-xl h-12 gap-2 font-semibold">
                  Next <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button onClick={handleSubmit} className="flex-1 gradient-primary text-primary-foreground rounded-xl h-12 gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Submit for Verification
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default HospitalRegister;
