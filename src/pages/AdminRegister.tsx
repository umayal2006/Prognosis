import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import FormField from "@/components/FormField";
import ProgressBar from "@/components/ProgressBar";
import Logo from "@/components/Logo";
import { toast } from "sonner";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertTriangle,
  Upload,
  ArrowLeftIcon,
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useNavigate } from "react-router-dom";

const stepLabels = [
  "Identity Verification",
  "Account Credentials",
  "Security Layer",
  "Final Confirmation",
];

const securityQuestions = [
  { value: "pet", label: "What was the name of your first pet?" },
  { value: "school", label: "What school did you attend in 6th grade?" },
  { value: "city", label: "In what city were you born?" },
  { value: "mother", label: "What is your mother's maiden name?" },
  { value: "book", label: "What was the first book you read?" },
];

const adminRoles = [
  { value: "super", label: "Super Admin" },
  { value: "system", label: "System Admin" },
  { value: "monitoring", label: "Monitoring Admin" },
  { value: "verification", label: "Verification Admin" },
];

const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

const AdminRegister = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [twoFactor, setTwoFactor] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [responsibilityAccepted, setResponsibilityAccepted] = useState(false);
  const [confirmAuth, setConfirmAuth] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const generatedAdminId = useMemo(
    () => "ADM-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
    []
  );

  const set = (key: string) => (v: string) => {
    setForm((f) => ({ ...f, [key]: v }));
    setErrors((e) => {
      const n = { ...e };
      delete n[key];
      return n;
    });
  };

  const passwordStrength = useMemo(() => {
    const p = form.password || "";
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/\d/.test(p)) score++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(p)) score++;
    if (p.length >= 12) score++;
    return score;
  }, [form.password]);

  const strengthLabel = ["", "Weak", "Fair", "Good", "Strong", "Excellent"][passwordStrength];
  const strengthColor = [
    "bg-muted",
    "bg-destructive",
    "bg-warning",
    "bg-warning",
    "bg-success",
    "bg-success",
  ][passwordStrength];

  const validateStep0 = () => {
    const errs: Record<string, string> = {};
    if (!form.fullName?.trim()) errs.fullName = "Full name is required";
    if (!form.email?.trim()) {
      errs.email = "Email is required";
    } else {
      const emailLower = form.email.toLowerCase();
      const freeProviders = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "aol.com", "icloud.com"];
      const domain = emailLower.split("@")[1];
      if (!domain || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailLower)) {
        errs.email = "Invalid email format";
      } else if (freeProviders.includes(domain)) {
        errs.email = "Please use a domain-based email (not Gmail, Yahoo, etc.)";
      }
    }
    if (!form.phone?.trim()) {
      errs.phone = "Phone number is required";
    } else if (!/^\+?\d{10,15}$/.test(form.phone.replace(/\s/g, ""))) {
      errs.phone = "Invalid phone number";
    }
    if (!uploadedFile) errs.file = "Government ID is required";
    if (!form.role) errs.role = "Select an admin role";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep1 = () => {
    const errs: Record<string, string> = {};
    if (!form.password) {
      errs.password = "Password is required";
    } else if (!PASSWORD_REGEX.test(form.password)) {
      errs.password = "Must be 8+ chars with uppercase, number & special char";
    }
    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: Record<string, string> = {};
    if (!form.securityQ) errs.securityQ = "Select a security question";
    if (!form.securityA?.trim()) errs.securityA = "Answer is required";
    if (!privacyAccepted) errs.privacy = "You must accept the data privacy policy";
    if (!responsibilityAccepted) errs.responsibility = "You must accept the admin responsibility agreement";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const next = () => {
    if (step === 0 && !validateStep0()) return;
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    if (step < stepLabels.length - 1) setStep(step + 1);
  };

  const prev = () => {
    if (step > 0) setStep(step - 1);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowed = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!allowed.includes(file.type)) {
      setFileError("Only PDF, PNG, or JPG files are allowed");
      setUploadedFile(null);
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setFileError("File must be under 5MB");
      setUploadedFile(null);
      return;
    }
    setFileError("");
    setUploadedFile(file);
    setErrors((e) => {
      const n = { ...e };
      delete n.file;
      return n;
    });
  };

  const handleSubmit = () => {
    if (!confirmAuth) {
      toast.error("Please confirm that all details are authentic.");
      return;
    }
    setSubmitted(true);
    toast.success("Admin account submitted for Super Admin approval.", { duration: 8000 });
  };

  const preventCopyPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    toast.error("Copy/paste is disabled for password fields.", { duration: 2000 });
  };

  const ErrorText = ({ field }: { field: string }) =>
    errors[field] ? (
      <p className="text-destructive text-xs mt-1 flex items-center gap-1">
        <AlertTriangle className="w-3 h-3" />
        {errors[field]}
      </p>
    ) : null;

  if (submitted) {
    return (
      <div className="min-h-screen gradient-hero flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card-strong p-10 max-w-md w-full text-center space-y-6"
        >
          <div className="w-16 h-16 rounded-full bg-warning/20 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8 text-warning" />
          </div>
          <h2 className="text-2xl font-bold font-display text-foreground">
            Admin Account Submitted
          </h2>
          <p className="text-muted-foreground">
            Your account has been submitted for Super Admin approval. You will be notified once verified.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-warning/10 border border-warning/30 text-warning text-sm font-medium">
            🟡 Pending Approval
          </div>
          <p className="text-xs text-muted-foreground">
            Admin ID: <span className="font-mono font-semibold text-foreground">{generatedAdminId}</span>
          </p>
          <Button
            onClick={() => navigate("/")}
            variant="outline"
            className="rounded-xl"
          >
            Return to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      <header className="p-6 flex items-center justify-between">
        <Logo />
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Back
        </button>
      </header>

      <div className="px-6">
        <div className="max-w-2xl mx-auto">
          <ProgressBar currentStep={step} totalSteps={stepLabels.length} labels={stepLabels} />
        </div>
      </div>

      <main className="flex-1 flex items-start justify-center p-6 pt-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-2xl"
        >
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold font-display text-foreground">Admin Registration</h1>
            <p className="text-sm text-muted-foreground mt-1">{stepLabels[step]}</p>
          </div>

          <div className="glass-card-strong p-8">
            {/* Security Warning */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-warning/10 border border-warning/20 text-warning text-xs mb-6">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Unauthorized admin access is monitored and logged.</span>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* Step 0: Identity Verification */}
                {step === 0 && (
                  <>
                    <div>
                      <FormField label="Full Name" name="fullName" placeholder="Dr. John Doe" required value={form.fullName} onChange={set("fullName")} />
                      <ErrorText field="fullName" />
                    </div>
                    <div>
                      <FormField label="Official Email ID" name="email" type="email" placeholder="admin@hospital.org" required value={form.email} onChange={set("email")} />
                      <ErrorText field="email" />
                      <p className="text-xs text-muted-foreground mt-1">Must be a domain-based email (not Gmail, Yahoo, etc.)</p>
                    </div>
                    <div>
                      <FormField label="Phone Number" name="phone" type="tel" placeholder="+91 XXXXX XXXXX" required value={form.phone} onChange={set("phone")} />
                      <ErrorText field="phone" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-foreground">
                        Government Issued ID <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <input
                          type="file"
                          accept=".pdf,.png,.jpg,.jpeg"
                          onChange={handleFileUpload}
                          className="hidden"
                          id="gov-id-upload"
                        />
                        <label
                          htmlFor="gov-id-upload"
                          className="flex items-center gap-3 p-3 rounded-xl bg-background/50 border border-border/60 cursor-pointer hover:border-primary/30 transition-colors"
                        >
                          <Upload className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {uploadedFile ? uploadedFile.name : "Upload PDF, PNG, or JPG (max 5MB)"}
                          </span>
                        </label>
                      </div>
                      {fileError && (
                        <p className="text-destructive text-xs flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          {fileError}
                        </p>
                      )}
                      <ErrorText field="file" />
                    </div>
                    <div>
                      <FormField
                        label="Admin Role Type"
                        name="role"
                        required
                        value={form.role}
                        onChange={set("role")}
                        options={adminRoles}
                      />
                      <ErrorText field="role" />
                    </div>
                  </>
                )}

                {/* Step 1: Account Credentials */}
                {step === 1 && (
                  <>
                    <div className="space-y-1.5">
                      <Label className="text-sm font-medium text-foreground">Unique Admin ID</Label>
                      <div className="flex items-center px-3 py-2.5 rounded-xl bg-muted/50 border border-border/60">
                        <span className="font-mono text-sm font-semibold text-foreground">{generatedAdminId}</span>
                        <span className="ml-auto text-xs text-muted-foreground">Auto-generated</span>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="password" className="text-sm font-medium text-foreground">
                        Password <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Create a strong password"
                          value={form.password || ""}
                          onChange={(e) => set("password")(e.target.value)}
                          onCopy={preventCopyPaste}
                          onPaste={preventCopyPaste}
                          onCut={preventCopyPaste}
                          className="flex h-10 w-full rounded-xl border border-border/60 bg-background/50 px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <ErrorText field="password" />
                      {/* Strength Indicator */}
                      {form.password && (
                        <div className="space-y-1.5">
                          <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((i) => (
                              <div
                                key={i}
                                className={`h-1.5 flex-1 rounded-full transition-colors ${
                                  i <= passwordStrength ? strengthColor : "bg-muted"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Strength: <span className="font-medium text-foreground">{strengthLabel}</span>
                          </p>
                        </div>
                      )}
                      <ul className="text-xs text-muted-foreground space-y-0.5 mt-1">
                        <li className={form.password?.length >= 8 ? "text-success" : ""}>• Minimum 8 characters</li>
                        <li className={/[A-Z]/.test(form.password || "") ? "text-success" : ""}>• At least 1 uppercase letter</li>
                        <li className={/\d/.test(form.password || "") ? "text-success" : ""}>• At least 1 number</li>
                        <li className={/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(form.password || "") ? "text-success" : ""}>• At least 1 special character</li>
                      </ul>
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                        Confirm Password <span className="text-destructive">*</span>
                      </Label>
                      <div className="relative">
                        <input
                          id="confirmPassword"
                          type={showConfirm ? "text" : "password"}
                          placeholder="Re-enter your password"
                          value={form.confirmPassword || ""}
                          onChange={(e) => set("confirmPassword")(e.target.value)}
                          onCopy={preventCopyPaste}
                          onPaste={preventCopyPaste}
                          onCut={preventCopyPaste}
                          className="flex h-10 w-full rounded-xl border border-border/60 bg-background/50 px-3 py-2 pr-10 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30 focus-visible:ring-offset-1"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <ErrorText field="confirmPassword" />
                    </div>
                  </>
                )}

                {/* Step 2: Security Layer */}
                {step === 2 && (
                  <>
                    <div>
                      <FormField
                        label="Security Question"
                        name="securityQ"
                        required
                        value={form.securityQ}
                        onChange={set("securityQ")}
                        options={securityQuestions}
                      />
                      <ErrorText field="securityQ" />
                    </div>
                    <div>
                      <FormField label="Security Answer" name="securityA" placeholder="Your answer" required value={form.securityA} onChange={set("securityA")} />
                      <ErrorText field="securityA" />
                    </div>
                    <div className="flex items-center justify-between py-3 border-b border-border/40">
                      <div>
                        <Label className="text-sm font-medium text-foreground">Two-Factor Authentication</Label>
                        <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
                      </div>
                      <Switch checked={twoFactor} onCheckedChange={setTwoFactor} />
                    </div>
                    <div className="space-y-3 pt-2">
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="privacy"
                          checked={privacyAccepted}
                          onCheckedChange={(v) => {
                            setPrivacyAccepted(!!v);
                            setErrors((e) => { const n = { ...e }; delete n.privacy; return n; });
                          }}
                        />
                        <label htmlFor="privacy" className="text-sm text-foreground leading-tight cursor-pointer">
                          I accept the <span className="text-primary font-medium">Data Privacy Policy</span>
                        </label>
                      </div>
                      <ErrorText field="privacy" />
                      <div className="flex items-start gap-3">
                        <Checkbox
                          id="responsibility"
                          checked={responsibilityAccepted}
                          onCheckedChange={(v) => {
                            setResponsibilityAccepted(!!v);
                            setErrors((e) => { const n = { ...e }; delete n.responsibility; return n; });
                          }}
                        />
                        <label htmlFor="responsibility" className="text-sm text-foreground leading-tight cursor-pointer">
                          I accept the <span className="text-primary font-medium">Admin Responsibility Agreement</span>
                        </label>
                      </div>
                      <ErrorText field="responsibility" />
                    </div>
                  </>
                )}

                {/* Step 3: Final Confirmation */}
                {step === 3 && (
                  <>
                    <h3 className="text-sm font-semibold text-foreground mb-3">Review Your Details</h3>
                    <div className="space-y-2 text-sm">
                      {[
                        ["Full Name", form.fullName],
                        ["Email", form.email],
                        ["Phone", form.phone],
                        ["Admin Role", adminRoles.find((r) => r.value === form.role)?.label],
                        ["Government ID", uploadedFile?.name],
                        ["Admin ID", generatedAdminId],
                        ["2FA", twoFactor ? "Enabled" : "Disabled"],
                        ["Security Question", securityQuestions.find((q) => q.value === form.securityQ)?.label],
                      ].map(([label, value]) => (
                        <div key={label} className="flex justify-between py-2 border-b border-border/30">
                          <span className="text-muted-foreground">{label}</span>
                          <span className="font-medium text-foreground text-right max-w-[60%] truncate">{value || "—"}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-start gap-3 pt-4">
                      <Checkbox
                        id="confirmAuth"
                        checked={confirmAuth}
                        onCheckedChange={(v) => setConfirmAuth(!!v)}
                      />
                      <label htmlFor="confirmAuth" className="text-sm text-foreground leading-tight cursor-pointer">
                        I confirm that all provided details are <span className="font-semibold">authentic and verifiable</span>.
                      </label>
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
                <Button
                  onClick={handleSubmit}
                  disabled={!confirmAuth}
                  className="flex-1 gradient-primary text-primary-foreground rounded-xl h-12 gap-2 font-semibold disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" /> Submit for Approval
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default AdminRegister;
