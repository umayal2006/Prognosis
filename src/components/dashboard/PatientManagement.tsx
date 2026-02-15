import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, AlertTriangle, Bell, ShieldCheck, Search } from "lucide-react";

const patientStats = [
  { label: "New Today", value: "47", icon: UserPlus },
  { label: "High-Risk (AI)", value: "23", icon: AlertTriangle },
  { label: "Emergency Alerts", value: "5", icon: Bell },
  { label: "Insurance Verified", value: "89%", icon: ShieldCheck },
];

const patients = [
  { name: "Maria Garcia", id: "PT-4821", risk: "Critical", insurance: "Verified", alert: true, condition: "COVID-19" },
  { name: "James Wilson", id: "PT-4822", risk: "High", insurance: "Pending", alert: false, condition: "Dengue" },
  { name: "Li Wei", id: "PT-4823", risk: "Critical", insurance: "Verified", alert: true, condition: "Malaria" },
  { name: "Anna Schmidt", id: "PT-4824", risk: "Medium", insurance: "Verified", alert: false, condition: "Tuberculosis" },
];

const riskStyle: Record<string, string> = {
  Critical: "bg-status-critical/10 text-status-critical",
  High: "bg-status-warning/10 text-status-warning",
  Medium: "bg-primary/10 text-primary",
  Low: "bg-status-verified/10 text-status-verified",
};

const insuranceStyle: Record<string, string> = {
  Verified: "bg-status-verified/10 text-status-verified",
  Pending: "bg-status-pending/10 text-status-pending",
  Rejected: "bg-status-critical/10 text-status-critical",
};

export function PatientManagement() {
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("all");

  const filtered = patients.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase());
    const matchRisk = riskFilter === "all" || p.risk === riskFilter;
    return matchSearch && matchRisk;
  });

  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-4">Patient Management</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {patientStats.map((s) => (
          <Card key={s.label} className="shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <s.icon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{s.label}</p>
                <p className="text-lg font-bold text-card-foreground">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Patient Registry</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                <Input
                  placeholder="Search patients..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="h-8 w-[180px] pl-8 text-xs"
                />
              </div>
              <Select value={riskFilter} onValueChange={setRiskFilter}>
                <SelectTrigger className="w-[130px] h-8 text-xs">
                  <SelectValue placeholder="Risk Level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="Critical">Critical</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filtered.map((p) => (
              <div key={p.id} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  {p.alert && (
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-status-critical opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-status-critical" />
                    </span>
                  )}
                  <div>
                    <p className="text-sm font-medium text-card-foreground">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.id} · {p.condition}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${riskStyle[p.risk] ?? ""}`}>
                    {p.risk}
                  </span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${insuranceStyle[p.insurance] ?? ""}`}>
                    {p.insurance}
                  </span>
                </div>
              </div>
            ))}
            {filtered.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-6">No patients match your filters.</p>
            )}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
