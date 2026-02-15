import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Eye, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Patient = {
  id: string;
  full_name: string;
  age: number | null;
  gender: string | null;
  contact_phone: string | null;
  contact_email: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  insurance_provider: string | null;
  insurance_policy_number: string | null;
  assigned_doctor_id: string | null;
  admission_date: string | null;
  ward: string | null;
  room_number: string | null;
  risk_level: string;
  status: string;
  allergies: string[] | null;
  chronic_conditions: string[] | null;
};

const defaultForm = {
  full_name: "",
  age: "",
  gender: "Male",
  contact_phone: "",
  ward: "",
  room_number: "",
  risk_level: "Low",
  status: "Active",
  insurance_provider: "",
  emergency_contact_name: "",
  emergency_contact_phone: "",
};

const Patients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");
  const [openAdd, setOpenAdd] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [form, setForm] = useState(defaultForm);
  const { toast } = useToast();

  const fetchPatients = async () => {
    const { data } = await supabase.from("patients").select("*").order("created_at", { ascending: false });
    setPatients((data as Patient[]) ?? []);
  };

  useEffect(() => { fetchPatients(); }, []);

  const handleAdd = async () => {
    const { error } = await supabase.from("patients").insert({
      full_name: form.full_name,
      age: parseInt(form.age) || null,
      gender: form.gender,
      contact_phone: form.contact_phone || null,
      ward: form.ward || null,
      room_number: form.room_number || null,
      risk_level: form.risk_level,
      status: form.status,
      insurance_provider: form.insurance_provider || null,
      emergency_contact_name: form.emergency_contact_name || null,
      emergency_contact_phone: form.emergency_contact_phone || null,
    });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    setOpenAdd(false);
    setForm(defaultForm);
    fetchPatients();
  };

  const riskColor = (r: string) =>
    r === "Critical" ? "destructive" : r === "High" ? "destructive" : r === "Medium" ? "secondary" : "default";

  const filtered = patients.filter((p) => {
    const matchesSearch = p.full_name.toLowerCase().includes(search.toLowerCase());
    const matchesRisk = riskFilter === "all" || p.risk_level === riskFilter;
    return matchesSearch && matchesRisk;
  });

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Patients</h1>
            <p className="text-muted-foreground">Manage patient records</p>
          </div>
          <Dialog open={openAdd} onOpenChange={setOpenAdd}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />Add Patient</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>Add Patient</DialogTitle></DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Full Name</Label>
                  <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Age</Label>
                    <Input type="number" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Gender</Label>
                    <Select value={form.gender} onValueChange={(v) => setForm({ ...form, gender: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Male", "Female", "Other"].map((g) => (<SelectItem key={g} value={g}>{g}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2"><Label>Ward</Label><Input value={form.ward} onChange={(e) => setForm({ ...form, ward: e.target.value })} /></div>
                  <div className="grid gap-2"><Label>Room</Label><Input value={form.room_number} onChange={(e) => setForm({ ...form, room_number: e.target.value })} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Risk Level</Label>
                    <Select value={form.risk_level} onValueChange={(v) => setForm({ ...form, risk_level: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Low", "Medium", "High", "Critical"].map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Status</Label>
                    <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Active", "Discharged", "Critical", "ICU"].map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <Button onClick={handleAdd}>Add Patient</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search patients..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={riskFilter} onValueChange={setRiskFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Risk" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Risks</SelectItem>
              {["Low", "Medium", "High", "Critical"].map((r) => (<SelectItem key={r} value={r}>{r}</SelectItem>))}
            </SelectContent>
          </Select>
        </div>

        {selectedPatient ? (
          <div className="space-y-4">
            <Button variant="ghost" onClick={() => setSelectedPatient(null)}><X className="mr-2 h-4 w-4" />Back to list</Button>
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader><CardTitle>Patient Profile</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Name:</span> {selectedPatient.full_name}</p>
                  <p><span className="text-muted-foreground">Age/Gender:</span> {selectedPatient.age} / {selectedPatient.gender}</p>
                  <p><span className="text-muted-foreground">Phone:</span> {selectedPatient.contact_phone || "—"}</p>
                  <p><span className="text-muted-foreground">Emergency:</span> {selectedPatient.emergency_contact_name || "—"} ({selectedPatient.emergency_contact_phone || "—"})</p>
                  <p><span className="text-muted-foreground">Insurance:</span> {selectedPatient.insurance_provider || "—"}</p>
                  <p><span className="text-muted-foreground">Ward/Room:</span> {selectedPatient.ward || "—"} / {selectedPatient.room_number || "—"}</p>
                  <p><span className="text-muted-foreground">Admission:</span> {selectedPatient.admission_date || "—"}</p>
                  <p><span className="text-muted-foreground">Risk:</span> <Badge variant={riskColor(selectedPatient.risk_level)}>{selectedPatient.risk_level}</Badge></p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle>Medical View</CardTitle></CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <p><span className="text-muted-foreground">Allergies:</span> {selectedPatient.allergies?.join(", ") || "None recorded"}</p>
                  <p><span className="text-muted-foreground">Chronic Conditions:</span> {selectedPatient.chronic_conditions?.join(", ") || "None recorded"}</p>
                  <p className="text-muted-foreground pt-4">Medical records, lab reports, and treatment plans will appear here once data is added.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Age/Gender</TableHead>
                  <TableHead>Ward</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">No patients found</TableCell></TableRow>
                ) : (
                  filtered.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell className="font-medium">{p.full_name}</TableCell>
                      <TableCell>{p.age ?? "—"} / {p.gender ?? "—"}</TableCell>
                      <TableCell>{p.ward || "—"}</TableCell>
                      <TableCell><Badge variant={riskColor(p.risk_level)}>{p.risk_level}</Badge></TableCell>
                      <TableCell>{p.status}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedPatient(p)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Patients;
