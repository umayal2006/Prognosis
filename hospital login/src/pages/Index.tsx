import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import {
  Stethoscope,
  HeartPulse,
  ShieldCheck,
  Users,
  BedDouble,
  AlertTriangle,
  CalendarClock,
} from "lucide-react";

interface Metrics {
  totalDoctors: number;
  totalNurses: number;
  adminStaff: number;
  activePatients: number;
  occupiedBeds: number;
  totalBeds: number;
  criticalPatients: number;
  todayAppointments: number;
}

const Overview = () => {
  const [metrics, setMetrics] = useState<Metrics>({
    totalDoctors: 0,
    totalNurses: 0,
    adminStaff: 0,
    activePatients: 0,
    occupiedBeds: 0,
    totalBeds: 0,
    criticalPatients: 0,
    todayAppointments: 0,
  });

  useEffect(() => {
    const fetchMetrics = async () => {
      const [employees, patients, beds] = await Promise.all([
        supabase.from("employees").select("role"),
        supabase.from("patients").select("status"),
        supabase.from("beds").select("status"),
      ]);

      const empData = employees.data ?? [];
      const patData = patients.data ?? [];
      const bedData = beds.data ?? [];

      setMetrics({
        totalDoctors: empData.filter((e) => e.role === "Doctor").length,
        totalNurses: empData.filter((e) => e.role === "Nurse").length,
        adminStaff: empData.filter((e) => e.role === "Admin").length,
        activePatients: patData.filter((p) => p.status === "Active" || p.status === "Critical" || p.status === "ICU").length,
        occupiedBeds: bedData.filter((b) => b.status === "Occupied").length,
        totalBeds: bedData.length,
        criticalPatients: patData.filter((p) => p.status === "Critical").length,
        todayAppointments: 0,
      });
    };
    fetchMetrics();
  }, []);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Overview</h1>
          <p className="text-muted-foreground">Hospital at a glance</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Total Doctors" value={metrics.totalDoctors} icon={Stethoscope} color="blue" />
          <MetricCard title="Total Nurses" value={metrics.totalNurses} icon={HeartPulse} color="green" />
          <MetricCard title="Admin Staff" value={metrics.adminStaff} icon={ShieldCheck} color="orange" />
          <MetricCard title="Active Patients" value={metrics.activePatients} icon={Users} color="blue" />
          <MetricCard title="Beds" value={`${metrics.occupiedBeds} / ${metrics.totalBeds}`} icon={BedDouble} color="green" />
          <MetricCard title="Critical Patients" value={metrics.criticalPatients} icon={AlertTriangle} color="red" />
          <MetricCard title="Today's Appointments" value={metrics.todayAppointments} icon={CalendarClock} color="orange" />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Overview;
