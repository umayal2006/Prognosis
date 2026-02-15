import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Building2, LogOut, UserPlus, Stethoscope, Mail, Phone, User, Star, Award, MapPin, Calendar, Clock, Shield, TrendingUp, DollarSign } from "lucide-react";
import Logo from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { apiUrl } from "@/lib/api";

type Doctor = {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialization?: string | null;
  qualifications?: string | null;
  yearsOfPractice?: number | null;
  rating?: number | null;
  numberOfReviews?: number | null;
  hospitalsAttached?: string[] | string | null;
  consultationFeeInPerson?: string | null;
  consultationFeeOnline?: string | null;
  languagesSpoken?: string[] | string | null;
  consultationMode?: string[] | string | null;
  nextAvailableSlot?: string | null;
  medicalLicenseNumber?: string | null;
  registrationCouncil?: string | null;
  areasOfExpertise?: string[] | string | null;
  proceduresPerformed?: string[] | string | null;
  researchPublications?: string | null;
  awardsRecognitions?: string | null;
  hospitalClinicName?: string | null;
  address?: string | null;
  availableDays?: string | null;
  timeSlots?: string | null;
  onlineConsultationOption?: boolean | null;
  emergencyAvailability?: boolean | null;
  realTimeSlotBooking?: boolean | null;
  matchPercentage?: number | null;
  bestForCondition?: boolean | null;
  successRate?: number | null;
  patientSimilarityMatch?: number | null;
  estimatedTreatmentSuccess?: number | null;
  starRating?: number | null;
  reviewText?: string | null;
  reviewTags?: string[] | null;
  totalPatientsTreated?: number | null;
  commonConditionsTreated?: string[] | string | null;
  averageRecoveryTime?: string | null;
  revisitRate?: number | null;
  followUpFee?: string | null;
  procedurePriceRange?: string | null;
  insuranceAccepted?: string[] | string | null;
};

const val = (v: unknown, fallback = "N/A") => (v != null && v !== "" ? String(v) : fallback);
const arr = (v: unknown): string[] => {
  if (Array.isArray(v)) return v.map(String);
  if (v != null && v !== "") return [String(v)];
  return [];
};
const join = (v: unknown, sep = ", ") => arr(v).join(sep) || "N/A";

const SAMPLE: Record<string, unknown> = {
  specialization: "General Physician",
  qualifications: "MBBS, MD (General Medicine)",
  yearsOfPractice: 8,
  rating: 4.6,
  numberOfReviews: 342,
  hospitalsAttached: ["City General Hospital", "Metro Clinic"],
  consultationFeeInPerson: "₹500",
  consultationFeeOnline: "₹400",
  languagesSpoken: ["English", "Hindi", "Tamil"],
  consultationMode: ["In-person", "Video", "Chat"],
  nextAvailableSlot: "Tomorrow, 10:00 AM",
  medicalLicenseNumber: "MED/2018/12345",
  registrationCouncil: "Medical Council of India",
  areasOfExpertise: ["General Check-up", "Fever", "Chronic Care"],
  proceduresPerformed: ["Routine Check-up", "Vaccination", "Minor Procedures"],
  researchPublications: "3 papers in national journals",
  awardsRecognitions: "Excellence in Patient Care 2022",
  hospitalClinicName: "City General Hospital",
  address: "456 Health Avenue, Chennai - 600002",
  availableDays: "Mon - Sat",
  timeSlots: "9:00 AM - 5:00 PM",
  onlineConsultationOption: true,
  emergencyAvailability: true,
  realTimeSlotBooking: true,
  matchPercentage: 85,
  bestForCondition: true,
  successRate: 88,
  patientSimilarityMatch: 82,
  estimatedTreatmentSuccess: 86,
  starRating: 4.6,
  reviewText: "Good consultation. Doctor was helpful and explained things clearly.",
  reviewTags: ["Explains Clearly", "Friendly", "Affordable"],
  totalPatientsTreated: 2100,
  commonConditionsTreated: ["Hypertension", "Diabetes", "Respiratory Infections"],
  averageRecoveryTime: "1-2 weeks",
  revisitRate: 18,
  followUpFee: "₹300",
  procedurePriceRange: "₹200 - ₹15,000",
  insuranceAccepted: ["Star Health", "HDFC ERGO"],
};

function withFallbacks(doc: Doctor | null): Doctor | null {
  if (!doc) return null;
  const out = { ...doc };
  (Object.keys(SAMPLE) as (keyof Doctor)[]).forEach((k) => {
    const v = out[k];
    const empty = v === undefined || v === null || v === "" || (Array.isArray(v) && v.length === 0);
    if (empty && SAMPLE[k] !== undefined) (out as Record<string, unknown>)[k] = SAMPLE[k];
  });
  return out;
}

const Section = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="rounded-lg border border-border/60 p-4 space-y-2">
    <h3 className="font-semibold text-foreground flex items-center gap-2">
      {icon}
      {title}
    </h3>
    {children}
  </div>
);

const Row = ({ label, value }: { label: string; value?: string | number | null }) => {
  const display = value != null && value !== "" ? String(value) : "N/A";
  return (
    <div className="flex justify-between gap-4 py-1.5 border-b border-border/40 last:border-0">
      <dt className="text-muted-foreground shrink-0">{label}</dt>
      <dd className="font-medium text-foreground text-right">{display}</dd>
    </div>
  );
};

const HospitalDashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userStr = localStorage.getItem("hospitalUser");
  const user = userStr ? JSON.parse(userStr) : null;
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const hasAppliedNewDoctor = useRef(false);

  const openDoctorProfile = async (doc: Doctor) => {
    setLoadingProfile(true);
    setSelectedDoctor(doc);
    try {
      const res = await fetch(apiUrl(`/api/doctors/${doc.id}`));
      const data = await res.json();
      if (data.success && data.doctor) {
        setSelectedDoctor(data.doctor as Doctor);
      }
    } catch {
      setSelectedDoctor(doc);
    } finally {
      setLoadingProfile(false);
    }
  };

  const fetchDoctors = async () => {
    setLoadingDoctors(true);
    try {
      const res = await fetch(apiUrl("/api/doctors"));
      const data = await res.json();
      if (data.success && Array.isArray(data.doctors)) {
        setDoctors((prev) => {
          const fromApi = data.doctors as Doctor[];
          const apiIds = new Set(fromApi.map((d) => d.id));
          const onlyInPrev = prev.filter((d) => !apiIds.has(d.id));
          return [...onlyInPrev, ...fromApi];
        });
      }
    } catch {
      setDoctors((prev) => prev);
    } finally {
      setLoadingDoctors(false);
    }
  };

  useEffect(() => {
    const newDoctor = location.state?.newDoctor as Doctor | undefined;
    if (newDoctor && !hasAppliedNewDoctor.current) {
      hasAppliedNewDoctor.current = true;
      setDoctors((prev) => {
        if (prev.some((d) => d.id === newDoctor.id)) return prev;
        return [newDoctor, ...prev];
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
    fetchDoctors();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("hospitalToken");
    localStorage.removeItem("hospitalUser");
    navigate("/hospital-login");
  };

  return (
    <div className="min-h-screen gradient-hero flex flex-col">
      <header className="p-6 flex items-center justify-between max-w-7xl mx-auto w-full">
        <Logo />
        <Button
          variant="outline"
          size="sm"
          className="rounded-xl gap-2 border-border/60"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </header>

      <main className="flex-1 p-6 max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="glass-card-strong p-8 text-center">
            <div className="w-16 h-16 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-8 h-8 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold font-display text-foreground mb-2">
              Welcome, {user?.name ?? "Hospital"}
            </h1>
            <p className="text-muted-foreground mb-4">
              Hospital ID: {user?.id ?? "N/A"}
            </p>
            <Button
              variant="outline"
              className="rounded-xl gap-2"
              onClick={() => navigate("/doctor-signup")}
            >
              <UserPlus className="w-4 h-4" />
              Add Doctor
            </Button>
          </div>

          <div className="glass-card-strong p-6">
            <h2 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary" />
              Registered Doctors ({doctors.length})
            </h2>
            {loadingDoctors ? (
              <p className="text-sm text-muted-foreground">Loading doctors…</p>
            ) : doctors.length === 0 ? (
              <p className="text-sm text-muted-foreground">No doctors added yet. Click &quot;Add Doctor&quot; to register one.</p>
            ) : (
              <ul className="space-y-3">
                {doctors.map((doc) => (
                  <li key={doc.id}>
                    <Card
                      className="p-4 flex flex-wrap items-center justify-between gap-3 bg-background/50 border-border/60 cursor-pointer hover:border-primary/40 hover:bg-background/70 transition-colors"
                      onClick={() => openDoctorProfile(doc)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                          <Stethoscope className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground hover:underline">{doc.name}</p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="w-3 h-3" /> {doc.email}
                          </p>
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="w-3 h-3" /> {doc.phone}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">{doc.id}</span>
                    </Card>
                  </li>
                ))}
              </ul>
            )}

            <Dialog open={!!selectedDoctor} onOpenChange={(open) => !open && setSelectedDoctor(null)}>
              <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <User className="w-5 h-5 text-primary" />
                    {selectedDoctor?.name} – Full Profile
                  </DialogTitle>
                </DialogHeader>
                {loadingProfile && (
                  <p className="text-sm text-muted-foreground py-4">Loading profile…</p>
                )}
                {selectedDoctor && !loadingProfile && (() => {
                  const doc = withFallbacks(selectedDoctor)!;
                  return (
                  <div className="space-y-6 pt-2 text-sm">
                    {/* 1. Basic Information */}
                    <Section title="Basic Information" icon={<User className="w-4 h-4" />}>
                      <Row label="Doctor Name" value={doc.name} />
                      <Row label="Specialization" value={val(doc.specialization)} />
                      <Row label="Qualifications" value={val(doc.qualifications)} />
                      <Row label="Years of Practice" value={doc.yearsOfPractice != null ? `${doc.yearsOfPractice} years` : val(doc.yearsOfPractice)} />
                      <Row label="Rating" value={doc.rating != null ? `${doc.rating} ★ (${val(doc.numberOfReviews)} reviews)` : val(doc.rating)} />
                      <Row label="Hospital(s) Attached" value={join(doc.hospitalsAttached)} />
                      <Row label="Consultation Fee (In-person)" value={val(doc.consultationFeeInPerson)} />
                      <Row label="Consultation Fee (Online)" value={val(doc.consultationFeeOnline)} />
                      <Row label="Languages Spoken" value={join(doc.languagesSpoken)} />
                      <Row label="Consultation Mode" value={join(doc.consultationMode)} />
                      <Row label="Next Available Slot" value={val(doc.nextAvailableSlot)} />
                    </Section>

                    {/* 2. Professional Details */}
                    <Section title="Professional Details" icon={<Award className="w-4 h-4" />}>
                      <Row label="Medical License Number" value={val(doc.medicalLicenseNumber)} />
                      <Row label="Registration Council" value={val(doc.registrationCouncil)} />
                      <Row label="Areas of Expertise" value={join(doc.areasOfExpertise)} />
                      <Row label="Procedures Performed" value={join(doc.proceduresPerformed)} />
                      <Row label="Research Publications" value={val(doc.researchPublications)} />
                      <Row label="Awards / Recognitions" value={val(doc.awardsRecognitions)} />
                    </Section>

                    {/* 3. Practice & Availability */}
                    <Section title="Practice & Availability" icon={<MapPin className="w-4 h-4" />}>
                      <Row label="Hospital / Clinic Name" value={val(doc.hospitalClinicName)} />
                      <Row label="Address" value={val(doc.address)} />
                      <Row label="Available Days" value={val(doc.availableDays)} />
                      <Row label="Time Slots" value={val(doc.timeSlots)} />
                      <Row label="Online Consultation" value={doc.onlineConsultationOption != null ? (doc.onlineConsultationOption ? "Yes" : "No") : "N/A"} />
                      <Row label="Emergency Availability" value={doc.emergencyAvailability != null ? (doc.emergencyAvailability ? "Yes" : "No") : "N/A"} />
                      <Row label="Real-Time Slot Booking" value={doc.realTimeSlotBooking != null ? (doc.realTimeSlotBooking ? "Yes" : "No") : "N/A"} />
                    </Section>

                    {/* 4. AI Suitability Score */}
                    <Section title="AI Suitability Score" icon={<Shield className="w-4 h-4" />}>
                      <Row label="Match Percentage" value={doc.matchPercentage != null ? `${doc.matchPercentage}% Suitable for Your Condition` : val(doc.matchPercentage)} />
                      <Row label="Best for Your Condition" value={doc.bestForCondition != null ? (doc.bestForCondition ? "Yes" : "No") : "N/A"} />
                      <Row label="Success Rate" value={doc.successRate != null ? `${doc.successRate}%` : val(doc.successRate)} />
                      <Row label="Patient Similarity Match" value={doc.patientSimilarityMatch != null ? `${doc.patientSimilarityMatch}%` : val(doc.patientSimilarityMatch)} />
                      <Row label="Estimated Treatment Success" value={doc.estimatedTreatmentSuccess != null ? `${doc.estimatedTreatmentSuccess}%` : val(doc.estimatedTreatmentSuccess)} />
                    </Section>

                    {/* 5. Patient Reviews */}
                    <Section title="Patient Reviews" icon={<Star className="w-4 h-4" />}>
                      <Row label="Star Rating" value={doc.starRating != null ? `${doc.starRating} ★` : val(doc.starRating)} />
                      <Row label="Review" value={val(doc.reviewText)} />
                      <Row label="Tags" value={join(doc.reviewTags)} />
                    </Section>

                    {/* 6. Treatment Statistics */}
                    <Section title="Treatment Statistics" icon={<TrendingUp className="w-4 h-4" />}>
                      <Row label="Total Patients Treated" value={val(doc.totalPatientsTreated)} />
                      <Row label="Common Conditions Treated" value={join(doc.commonConditionsTreated)} />
                      <Row label="Average Recovery Time" value={val(doc.averageRecoveryTime)} />
                      <Row label="Revisit Rate" value={doc.revisitRate != null ? `${doc.revisitRate}%` : val(doc.revisitRate)} />
                    </Section>

                    {/* 7. Cost Transparency */}
                    <Section title="Cost Transparency" icon={<DollarSign className="w-4 h-4" />}>
                      <Row label="Consultation Fee" value={val(doc.consultationFeeInPerson)} />
                      <Row label="Follow-Up Fee" value={val(doc.followUpFee)} />
                      <Row label="Procedure Price Range" value={val(doc.procedurePriceRange)} />
                      <Row label="Insurance Accepted" value={join(doc.insuranceAccepted)} />
                    </Section>

                    <div className="rounded-lg border bg-secondary/50 p-3 flex flex-wrap gap-2">
                      <span className="text-muted-foreground">Contact:</span>
                      <span>{doc.email}</span>
                      <span className="text-muted-foreground">•</span>
                      <span>{doc.phone}</span>
                      <span className="text-muted-foreground">•</span>
                      <span className="font-mono">{doc.id}</span>
                    </div>
                  </div>
                  );
                })()}
              </DialogContent>
            </Dialog>

            {!loadingDoctors && doctors.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-3"
                onClick={fetchDoctors}
              >
                Refresh list
              </Button>
            )}
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default HospitalDashboard;
