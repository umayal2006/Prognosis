import express from "express";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors({ origin: true }));
app.use(express.json());

// Health check – confirms backend is running
app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Backend is running" });
});

// In-memory patient store (use DB in production)
// Seed user: phone 1234567890, password password123
let nextPatientNum = 2;
const patients = new Map([
  [
    "1234567890",
    {
      id: "pat-001",
      phone: "1234567890",
      email: "patient@example.com",
      passwordHash: "password123", // plain for demo; use bcrypt in production
      name: "Demo Patient",
      dob: "",
      gender: "",
      blood: "",
      aadhaar: "",
      address: "",
      emergName: "",
      emergPhone: "",
    },
  ],
]);

function normalizePhone(phone) {
  return String(phone || "").replace(/\D/g, "").slice(-10);
}

app.post("/api/auth/patient/register", (req, res) => {
  const body = req.body || {};
  const {
    name,
    dob,
    gender,
    blood,
    aadhaar,
    password,
    phone,
    email,
    address,
    emergName,
    emergPhone,
  } = body;

  const normalizedPhone = normalizePhone(phone);
  if (!normalizedPhone || normalizedPhone.length < 10) {
    return res.status(400).json({
      success: false,
      message: "A valid phone number is required.",
    });
  }
  if (!password || String(password).length < 6) {
    return res.status(400).json({
      success: false,
      message: "Password must be at least 6 characters.",
    });
  }
  if (patients.has(normalizedPhone)) {
    return res.status(409).json({
      success: false,
      message: "An account with this phone number already exists.",
    });
  }

  const id = `pat-${String(nextPatientNum++).padStart(3, "0")}`;
  const patient = {
    id,
    phone: normalizedPhone,
    email: email || "",
    passwordHash: password, // use bcrypt in production
    name: name || "",
    dob: dob || "",
    gender: gender || "",
    blood: blood || "",
    aadhaar: aadhaar || "",
    address: address || "",
    emergName: emergName || "",
    emergPhone: emergPhone || "",
  };
  patients.set(normalizedPhone, patient);

  const token = `patient_${patient.id}_${Date.now()}`;
  res.status(201).json({
    success: true,
    message: "Registration successful.",
    token,
    user: {
      id: patient.id,
      phone: patient.phone,
      email: patient.email,
      name: patient.name,
    },
  });
});

app.post("/api/auth/patient/login", (req, res) => {
  const { phone, password } = req.body || {};
  const normalizedPhone = normalizePhone(phone);

  if (!normalizedPhone || !password) {
    return res.status(400).json({
      success: false,
      message: "Phone number and password are required.",
    });
  }

  const patient = patients.get(normalizedPhone) || patients.get(phone);
  if (!patient) {
    return res.status(401).json({
      success: false,
      message: "Invalid phone number or password.",
    });
  }

  if (patient.passwordHash !== password) {
    return res.status(401).json({
      success: false,
      message: "Invalid phone number or password.",
    });
  }

  const token = `patient_${patient.id}_${Date.now()}`;
  res.json({
    success: true,
    token,
    user: {
      id: patient.id,
      phone: patient.phone,
      email: patient.email,
      name: patient.name,
    },
  });
});

// In-memory hospital store (use DB in production)
// Seed: Hospital ID HOS123, password password123, phone 1234567890
const hospitals = new Map([
  [
    "HOS123",
    {
      id: "HOS123",
      name: "City General Hospital",
      passwordHash: "password123",
      phone: "1234567890",
    },
  ],
]);

app.post("/api/auth/hospital/login", (req, res) => {
  const { id, password, phone } = req.body || {};
  const hospitalId = String(id || "").trim().toUpperCase().replace(/[-.\s]/g, "");

  if (!hospitalId || !password) {
    return res.status(400).json({
      success: false,
      message: "Hospital ID and password are required.",
    });
  }

  const hospital = hospitals.get(hospitalId);
  if (!hospital) {
    return res.status(401).json({
      success: false,
      message: "Invalid Hospital ID or password.",
    });
  }

  if (hospital.passwordHash !== password) {
    return res.status(401).json({
      success: false,
      message: "Invalid Hospital ID or password.",
    });
  }

  const token = `hospital_${hospital.id}_${Date.now()}`;
  res.json({
    success: true,
    token,
    user: {
      id: hospital.id,
      name: hospital.name,
      phone: hospital.phone,
    },
  });
});

// In-memory admin store. Seed: Admin ID ADM-123 (or ADM123), password password123, phone 1234567890
const admins = new Map([
  [
    "ADM123",
    {
      id: "ADM-123",
      name: "System Administrator",
      passwordHash: "password123",
      phone: "1234567890",
    },
  ],
]);

app.post("/api/auth/admin/login", (req, res) => {
  const { id, password, phone } = req.body || {};
  const adminId = String(id || "").trim().toUpperCase().replace(/[-.\s]/g, "");

  if (!adminId || !password) {
    return res.status(400).json({
      success: false,
      message: "Admin ID and password are required.",
    });
  }

  const admin = admins.get(adminId);
  if (!admin) {
    return res.status(401).json({
      success: false,
      message: "Invalid Admin ID or password.",
    });
  }

  if (admin.passwordHash !== password) {
    return res.status(401).json({
      success: false,
      message: "Invalid Admin ID or password.",
    });
  }

  const token = `admin_${admin.id.replace(/-/g, "")}_${Date.now()}`;
  res.json({
    success: true,
    token,
    user: {
      id: admin.id,
      name: admin.name,
      phone: admin.phone,
    },
  });
});

// Full doctor profile shape (all optional except id, name, email, phone)
const defaultDoctorProfile = () => ({
  specialization: null,
  qualifications: null,
  yearsOfPractice: null,
  rating: null,
  numberOfReviews: null,
  hospitalsAttached: null,
  consultationFeeInPerson: null,
  consultationFeeOnline: null,
  languagesSpoken: null,
  consultationMode: null,
  nextAvailableSlot: null,
  medicalLicenseNumber: null,
  registrationCouncil: null,
  areasOfExpertise: null,
  proceduresPerformed: null,
  researchPublications: null,
  awardsRecognitions: null,
  hospitalClinicName: null,
  address: null,
  availableDays: null,
  timeSlots: null,
  onlineConsultationOption: null,
  emergencyAvailability: null,
  realTimeSlotBooking: null,
  matchPercentage: null,
  bestForCondition: null,
  successRate: null,
  patientSimilarityMatch: null,
  estimatedTreatmentSuccess: null,
  starRating: null,
  reviewText: null,
  reviewTags: null,
  totalPatientsTreated: null,
  commonConditionsTreated: null,
  averageRecoveryTime: null,
  revisitRate: null,
  followUpFee: null,
  procedurePriceRange: null,
  insuranceAccepted: null,
});

function doctorToApi(d) {
  const base = { id: d.id, name: d.name, email: d.email, phone: d.phone };
  const sample = sampleDoctorProfile();
  const out = { ...base, ...sample };
  Object.keys(sample).forEach((k) => {
    const v = d[k];
    const has = v !== undefined && v !== null && v !== "" && (Array.isArray(v) ? v.length > 0 : true);
    if (has) out[k] = v;
    else if (out[k] === undefined || out[k] === null || (typeof out[k] === "string" && out[k].trim() === "")) {
      out[k] = typeof sample[k] === "boolean" ? sample[k] : (sample[k] != null ? sample[k] : "N/A");
    }
  });
  return out;
}

// Sample data – every field has a value so nothing is left empty
function sampleDoctorProfile() {
  return {
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
    areasOfExpertise: ["General Check-up", "Fever", "Chronic Care", "Preventive Care"],
    proceduresPerformed: ["Routine Check-up", "Vaccination", "Minor Procedures", "Blood Tests"],
    researchPublications: "3 papers in national journals; 1 international.",
    awardsRecognitions: "Excellence in Patient Care 2022",
    hospitalClinicName: "City General Hospital",
    address: "456 Health Avenue, Chennai - 600002",
    availableDays: "Mon, Tue, Wed, Thu, Fri, Sat",
    timeSlots: "9:00 AM - 1:00 PM, 3:00 PM - 5:00 PM",
    onlineConsultationOption: true,
    emergencyAvailability: true,
    realTimeSlotBooking: true,
    matchPercentage: 85,
    bestForCondition: true,
    successRate: 88,
    patientSimilarityMatch: 82,
    estimatedTreatmentSuccess: 86,
    starRating: 4.6,
    reviewText: "Good consultation. Doctor was helpful and explained things clearly. Would recommend.",
    reviewTags: ["Explains Clearly", "Friendly", "Affordable", "Less Waiting Time", "Worth the Cost"],
    totalPatientsTreated: 2100,
    commonConditionsTreated: ["Hypertension", "Diabetes", "Respiratory Infections", "Fever", "General Check-up"],
    averageRecoveryTime: "1-2 weeks",
    revisitRate: 18,
    followUpFee: "₹300",
    procedurePriceRange: "₹200 - ₹15,000",
    insuranceAccepted: ["Star Health", "HDFC ERGO", "ICICI Lombard", "New India Assurance"],
  };
}

let nextDoctorNum = 1;
const doctors = new Map();

// Seed one doctor with sample data for demo
const seedDoctor = {
  id: "doc-001",
  name: "Dr. Sarah Mitchell",
  email: "sarah.mitchell@hospital.com",
  phone: "9876543210",
  passwordHash: "demo",
  specialization: "Cardiologist",
  qualifications: "MBBS, MD, DM (Cardiology)",
  yearsOfPractice: 12,
  rating: 4.8,
  numberOfReviews: 1247,
  hospitalsAttached: ["City General Hospital", "Metro Heart Institute"],
  consultationFeeInPerson: "₹800",
  consultationFeeOnline: "₹600",
  languagesSpoken: ["English", "Hindi", "Tamil"],
  consultationMode: ["In-person", "Video", "Chat"],
  nextAvailableSlot: "Today, 4:00 PM",
  medicalLicenseNumber: "MED/2020/45678",
  registrationCouncil: "Medical Council of India",
  areasOfExpertise: ["Heart Failure", "Arrhythmia", "Hypertension"],
  proceduresPerformed: ["ECG", "Echocardiography", "Stress Test", "Angioplasty"],
  researchPublications: "15 papers in peer-reviewed journals",
  awardsRecognitions: "Best Cardiologist 2023 - State Medical Board",
  hospitalClinicName: "City General Hospital",
  address: "123 Medical Complex, Chennai - 600001",
  availableDays: "Mon, Wed, Fri, Sat",
  timeSlots: "9:00 AM - 1:00 PM, 4:00 PM - 7:00 PM",
  onlineConsultationOption: true,
  emergencyAvailability: true,
  realTimeSlotBooking: true,
  matchPercentage: 92,
  bestForCondition: true,
  successRate: 94,
  patientSimilarityMatch: 88,
  estimatedTreatmentSuccess: 91,
  starRating: 4.8,
  reviewText: "Dr. Mitchell explained everything clearly. Very satisfied with the treatment.",
  reviewTags: ["Explains Clearly", "Friendly", "Less Waiting Time", "Worth the Cost"],
  totalPatientsTreated: 5200,
  commonConditionsTreated: ["Hypertension", "CAD", "Arrhythmia", "Heart Failure"],
  averageRecoveryTime: "2-4 weeks",
  revisitRate: 12,
  followUpFee: "₹400",
  procedurePriceRange: "₹5,000 - ₹2,50,000",
  insuranceAccepted: ["Star Health", "HDFC ERGO", "ICICI Lombard"],
};
doctors.set("doc-001", seedDoctor);
nextDoctorNum = 2;

app.post("/api/auth/doctor/register", (req, res) => {
  const body = req.body || {};
  const { name, email, phone, password } = body;
  const normalizedPhone = normalizePhone(phone);
  const emailTrim = String(email || "").trim().toLowerCase();

  if (!name || !name.trim()) {
    return res.status(400).json({ success: false, message: "Full name is required." });
  }
  if (!emailTrim) {
    return res.status(400).json({ success: false, message: "Email is required." });
  }
  if (!normalizedPhone || normalizedPhone.length < 10) {
    return res.status(400).json({ success: false, message: "A valid phone number is required." });
  }
  if (!password || String(password).length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
  }

  const id = `doc-${String(nextDoctorNum++).padStart(3, "0")}`;
  const profile = { ...sampleDoctorProfile() };
  [
    "specialization", "qualifications", "yearsOfPractice", "rating", "numberOfReviews",
    "hospitalsAttached", "consultationFeeInPerson", "consultationFeeOnline", "languagesSpoken",
    "consultationMode", "nextAvailableSlot", "medicalLicenseNumber", "registrationCouncil",
    "areasOfExpertise", "proceduresPerformed", "researchPublications", "awardsRecognitions",
    "hospitalClinicName", "address", "availableDays", "timeSlots", "onlineConsultationOption",
    "emergencyAvailability", "realTimeSlotBooking", "matchPercentage", "bestForCondition",
    "successRate", "patientSimilarityMatch", "estimatedTreatmentSuccess", "starRating",
    "reviewText", "reviewTags", "totalPatientsTreated", "commonConditionsTreated",
    "averageRecoveryTime", "revisitRate", "followUpFee", "procedurePriceRange", "insuranceAccepted",
  ].forEach((k) => { if (body[k] != null) profile[k] = body[k]; });

  const doctor = {
    id,
    name: name.trim(),
    email: emailTrim,
    phone: normalizedPhone,
    passwordHash: password,
    ...profile,
  };
  doctors.set(id, doctor);

  res.status(201).json({
    success: true,
    message: "Doctor registered successfully.",
    doctor: doctorToApi(doctor),
  });
});

app.get("/api/doctors", (req, res) => {
  const list = Array.from(doctors.values()).map(doctorToApi);
  res.json({ success: true, doctors: list });
});

app.get("/api/doctors/:id", (req, res) => {
  const doctor = doctors.get(req.params.id);
  if (!doctor) {
    return res.status(404).json({ success: false, message: "Doctor not found." });
  }
  res.json({ success: true, doctor: doctorToApi(doctor) });
});

app.listen(PORT, () => {
  console.log(`API running at http://localhost:${PORT}`);
});
