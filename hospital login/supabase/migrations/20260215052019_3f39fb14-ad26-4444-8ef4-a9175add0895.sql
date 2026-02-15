
-- Create role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'doctor', 'nurse', 'accounts');

-- Profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- User roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);

-- Employees table
CREATE TABLE public.employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('Doctor', 'Nurse', 'Admin', 'Technician')),
  department TEXT NOT NULL,
  years_of_experience INTEGER DEFAULT 0,
  contact_phone TEXT,
  contact_email TEXT,
  shift_timing TEXT DEFAULT 'Day',
  employment_status TEXT NOT NULL DEFAULT 'Active' CHECK (employment_status IN ('Active', 'On Leave', 'Resigned')),
  -- Doctor-specific fields
  specialization TEXT,
  medical_license_number TEXT,
  consultation_count INTEGER DEFAULT 0,
  patient_rating NUMERIC(3,2) DEFAULT 0,
  availability_slots JSONB,
  ai_performance_score NUMERIC(5,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Patients table
CREATE TABLE public.patients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  age INTEGER,
  gender TEXT CHECK (gender IN ('Male', 'Female', 'Other')),
  contact_phone TEXT,
  contact_email TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  insurance_provider TEXT,
  insurance_policy_number TEXT,
  assigned_doctor_id UUID REFERENCES public.employees(id),
  admission_date DATE,
  ward TEXT,
  room_number TEXT,
  risk_level TEXT DEFAULT 'Low' CHECK (risk_level IN ('Low', 'Medium', 'High', 'Critical')),
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Discharged', 'Critical', 'ICU')),
  allergies TEXT[],
  chronic_conditions TEXT[],
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Medical records table
CREATE TABLE public.medical_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  record_type TEXT NOT NULL CHECK (record_type IN ('Diagnosis', 'Prescription', 'Lab Report', 'Radiology', 'Treatment Plan')),
  title TEXT NOT NULL,
  description TEXT,
  data JSONB,
  ai_risk_score NUMERIC(5,2),
  created_by UUID REFERENCES public.employees(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Treatments table
CREATE TABLE public.treatments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  doctor_id UUID REFERENCES public.employees(id),
  treatment_type TEXT NOT NULL CHECK (treatment_type IN ('Ongoing', 'Surgery', 'ICU', 'Discharged')),
  title TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL DEFAULT CURRENT_DATE,
  end_date DATE,
  outcome TEXT CHECK (outcome IN ('Successful', 'Ongoing', 'Complicated', 'Failed')),
  status TEXT NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Completed', 'Cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Beds table
CREATE TABLE public.beds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bed_number TEXT NOT NULL UNIQUE,
  ward TEXT NOT NULL,
  bed_type TEXT NOT NULL DEFAULT 'General' CHECK (bed_type IN ('General', 'ICU', 'Operation Theatre')),
  status TEXT NOT NULL DEFAULT 'Available' CHECK (status IN ('Available', 'Occupied', 'Maintenance')),
  patient_id UUID REFERENCES public.patients(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beds ENABLE ROW LEVEL SECURITY;

-- Security definer function for role checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Trigger for auto-creating profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data ->> 'full_name');
  -- Default role: doctor (admin assigns roles later)
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'doctor');
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_employees_updated_at BEFORE UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_patients_updated_at BEFORE UPDATE ON public.patients FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_treatments_updated_at BEFORE UPDATE ON public.treatments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies

-- Profiles: users can read/update own profile
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- User roles: users can read own roles, admins can manage all
CREATE POLICY "Users can view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete roles" ON public.user_roles FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Employees: all authenticated can read, admins can write
CREATE POLICY "Authenticated can view employees" ON public.employees FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can insert employees" ON public.employees FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update employees" ON public.employees FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete employees" ON public.employees FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Patients: all authenticated can read, admins/doctors/nurses can write
CREATE POLICY "Authenticated can view patients" ON public.patients FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff can insert patients" ON public.patients FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'doctor') OR public.has_role(auth.uid(), 'nurse')
);
CREATE POLICY "Staff can update patients" ON public.patients FOR UPDATE TO authenticated USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'doctor') OR public.has_role(auth.uid(), 'nurse')
);
CREATE POLICY "Admins can delete patients" ON public.patients FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- Medical records: all authenticated can read, doctors/admins can write
CREATE POLICY "Authenticated can view records" ON public.medical_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Doctors and admins can insert records" ON public.medical_records FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'doctor')
);
CREATE POLICY "Doctors and admins can update records" ON public.medical_records FOR UPDATE TO authenticated USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'doctor')
);

-- Treatments: all authenticated can read, doctors/admins/nurses can write
CREATE POLICY "Authenticated can view treatments" ON public.treatments FOR SELECT TO authenticated USING (true);
CREATE POLICY "Staff can insert treatments" ON public.treatments FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'doctor') OR public.has_role(auth.uid(), 'nurse')
);
CREATE POLICY "Staff can update treatments" ON public.treatments FOR UPDATE TO authenticated USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'doctor') OR public.has_role(auth.uid(), 'nurse')
);

-- Beds: all authenticated can read, admins can write
CREATE POLICY "Authenticated can view beds" ON public.beds FOR SELECT TO authenticated USING (true);
CREATE POLICY "Admins can manage beds" ON public.beds FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));
