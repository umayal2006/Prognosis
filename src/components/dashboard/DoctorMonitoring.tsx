import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Star, AlertTriangle, MessageSquare } from "lucide-react";

const doctorStats = [
  { label: "Active Online", value: "187", icon: Users },
  { label: "Consultations Today", value: "1,243", icon: MessageSquare },
  { label: "Avg Feedback Rating", value: "4.6 / 5", icon: Star },
  { label: "AI Flagged Cases", value: "34", icon: AlertTriangle },
];

const doctors = [
  { name: "Dr. Sarah Chen", hospital: "City General", dept: "Cardiology", consultations: 28, rating: 4.8, flagged: 2 },
  { name: "Dr. Raj Patel", hospital: "St. Mary's", dept: "Neurology", consultations: 22, rating: 4.5, flagged: 5 },
  { name: "Dr. Emily Johnson", hospital: "Regional Health", dept: "Oncology", consultations: 19, rating: 4.9, flagged: 1 },
  { name: "Dr. Michael Torres", hospital: "Metro Children's", dept: "Pediatrics", consultations: 31, rating: 4.7, flagged: 3 },
  { name: "Dr. Aisha Khan", hospital: "City General", dept: "Emergency", consultations: 35, rating: 4.4, flagged: 8 },
];

export function DoctorMonitoring() {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-4">Doctor Monitoring</h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
        {doctorStats.map((s) => (
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
            <CardTitle className="text-sm font-medium text-muted-foreground">Doctor Performance</CardTitle>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[160px] h-8 text-xs">
                  <SelectValue placeholder="Filter by Hospital" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Hospitals</SelectItem>
                  <SelectItem value="city-general">City General</SelectItem>
                  <SelectItem value="st-marys">St. Mary's</SelectItem>
                  <SelectItem value="regional">Regional Health</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[160px] h-8 text-xs">
                  <SelectValue placeholder="Filter by Dept" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="cardiology">Cardiology</SelectItem>
                  <SelectItem value="neurology">Neurology</SelectItem>
                  <SelectItem value="emergency">Emergency</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {doctors.map((d) => (
              <div key={d.name} className="flex items-center justify-between p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-card-foreground">{d.name}</p>
                  <p className="text-xs text-muted-foreground">{d.hospital} · {d.dept}</p>
                </div>
                <div className="flex items-center gap-5 text-sm">
                  <div className="text-center hidden sm:block">
                    <p className="font-semibold text-card-foreground">{d.consultations}</p>
                    <p className="text-[10px] text-muted-foreground">Consults</p>
                  </div>
                  <div className="text-center hidden sm:block">
                    <p className="font-semibold text-card-foreground flex items-center gap-1">
                      <Star className="h-3 w-3 text-status-warning fill-status-warning" />
                      {d.rating}
                    </p>
                    <p className="text-[10px] text-muted-foreground">Rating</p>
                  </div>
                  <div className="text-center">
                    <p className={d.flagged > 4 ? "font-semibold text-status-critical" : "font-semibold text-card-foreground"}>{d.flagged}</p>
                    <p className="text-[10px] text-muted-foreground">Flagged</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
