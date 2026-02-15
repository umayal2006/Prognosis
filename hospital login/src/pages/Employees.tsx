import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Pencil, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type Employee = {
  id: string;
  full_name: string;
  role: string;
  department: string;
  years_of_experience: number;
  contact_phone: string | null;
  contact_email: string | null;
  shift_timing: string;
  employment_status: string;
  specialization: string | null;
  medical_license_number: string | null;
  consultation_count: number;
  patient_rating: number;
  ai_performance_score: number | null;
};

const defaultForm = {
  full_name: "",
  role: "Doctor",
  department: "",
  years_of_experience: 0,
  contact_phone: "",
  contact_email: "",
  shift_timing: "Day",
  employment_status: "Active",
  specialization: "",
  medical_license_number: "",
};

const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deptFilter, setDeptFilter] = useState("all");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(defaultForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchEmployees = async () => {
    const { data } = await supabase.from("employees").select("*").order("created_at", { ascending: false });
    setEmployees((data as Employee[]) ?? []);
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleSave = async () => {
    const payload: any = { ...form };
    if (form.role !== "Doctor") {
      payload.specialization = null;
      payload.medical_license_number = null;
    }

    if (editingId) {
      const { error } = await supabase.from("employees").update(payload).eq("id", editingId);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    } else {
      const { error } = await supabase.from("employees").insert(payload);
      if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    }
    setOpen(false);
    setForm(defaultForm);
    setEditingId(null);
    fetchEmployees();
  };

  const handleEdit = (emp: Employee) => {
    setForm({
      full_name: emp.full_name,
      role: emp.role,
      department: emp.department,
      years_of_experience: emp.years_of_experience,
      contact_phone: emp.contact_phone ?? "",
      contact_email: emp.contact_email ?? "",
      shift_timing: emp.shift_timing,
      employment_status: emp.employment_status,
      specialization: emp.specialization ?? "",
      medical_license_number: emp.medical_license_number ?? "",
    });
    setEditingId(emp.id);
    setOpen(true);
  };

  const handleDelete = async (id: string) => {
    await supabase.from("employees").delete().eq("id", id);
    fetchEmployees();
  };

  const departments = [...new Set(employees.map((e) => e.department).filter(Boolean))];

  const filtered = employees.filter((e) => {
    const matchesSearch = e.full_name.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "all" || e.role === roleFilter;
    const matchesDept = deptFilter === "all" || e.department === deptFilter;
    return matchesSearch && matchesRole && matchesDept;
  });

  const statusColor = (s: string) =>
    s === "Active" ? "default" : s === "On Leave" ? "secondary" : "destructive";

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Employees</h1>
            <p className="text-muted-foreground">Manage hospital workforce</p>
          </div>
          <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setEditingId(null); setForm(defaultForm); } }}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />Add Employee</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit Employee" : "Add Employee"}</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>Full Name</Label>
                  <Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Role</Label>
                    <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Doctor", "Nurse", "Admin", "Technician"].map((r) => (
                          <SelectItem key={r} value={r}>{r}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Department</Label>
                    <Input value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Experience (years)</Label>
                    <Input type="number" value={form.years_of_experience} onChange={(e) => setForm({ ...form, years_of_experience: parseInt(e.target.value) || 0 })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Shift</Label>
                    <Select value={form.shift_timing} onValueChange={(v) => setForm({ ...form, shift_timing: v })}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {["Day", "Night", "Rotating"].map((s) => (
                          <SelectItem key={s} value={s}>{s}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Phone</Label>
                    <Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Email</Label>
                    <Input value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label>Status</Label>
                  <Select value={form.employment_status} onValueChange={(v) => setForm({ ...form, employment_status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {["Active", "On Leave", "Resigned"].map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {form.role === "Doctor" && (
                  <>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label>Specialization</Label>
                        <Input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
                      </div>
                      <div className="grid gap-2">
                        <Label>License Number</Label>
                        <Input value={form.medical_license_number} onChange={(e) => setForm({ ...form, medical_license_number: e.target.value })} />
                      </div>
                    </div>
                  </>
                )}
                <Button onClick={handleSave}>{editingId ? "Update" : "Add"} Employee</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" placeholder="Search employees..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[140px]"><SelectValue placeholder="Role" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              {["Doctor", "Nurse", "Admin", "Technician"].map((r) => (
                <SelectItem key={r} value={r}>{r}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={deptFilter} onValueChange={setDeptFilter}>
            <SelectTrigger className="w-[160px]"><SelectValue placeholder="Department" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Depts</SelectItem>
              {departments.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Department</TableHead>
                <TableHead>Experience</TableHead>
                <TableHead>Shift</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">No employees found</TableCell></TableRow>
              ) : (
                filtered.map((emp) => (
                  <TableRow key={emp.id}>
                    <TableCell className="font-medium">{emp.full_name}</TableCell>
                    <TableCell>{emp.role}</TableCell>
                    <TableCell>{emp.department}</TableCell>
                    <TableCell>{emp.years_of_experience} yrs</TableCell>
                    <TableCell>{emp.shift_timing}</TableCell>
                    <TableCell><Badge variant={statusColor(emp.employment_status)}>{emp.employment_status}</Badge></TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => handleEdit(emp)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(emp.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Employees;
