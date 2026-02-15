import { Building2, Stethoscope, AlertTriangle, Activity } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const metrics = [
  { label: "Total Hospitals", value: "142", change: "+3 this month", icon: Building2, variant: "primary" as const },
  { label: "Total Doctors", value: "2,847", change: "+56 this month", icon: Stethoscope, variant: "accent" as const },
  { label: "High-Risk Cases", value: "89", change: "AI Flagged", icon: AlertTriangle, variant: "critical" as const },
  { label: "System Health", value: "Healthy", change: "All systems operational", icon: Activity, variant: "healthy" as const },
];

const variantStyles: Record<string, string> = {
  primary: "border-l-4 border-l-primary bg-card",
  accent: "border-l-4 border-l-accent bg-card",
  critical: "border-l-4 border-l-status-critical bg-card",
  healthy: "border-l-4 border-l-status-healthy bg-card",
};

const iconStyles: Record<string, string> = {
  primary: "text-primary bg-primary/10",
  accent: "text-accent bg-accent/10",
  critical: "text-status-critical bg-status-critical/10",
  healthy: "text-status-healthy bg-status-healthy/10",
};

export function OverviewMetrics() {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-4">Overview</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <Card key={m.label} className={`${variantStyles[m.variant]} shadow-sm`}>
            <CardContent className="p-5 flex items-start gap-4">
              <div className={`p-2.5 rounded-lg ${iconStyles[m.variant]}`}>
                <m.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{m.label}</p>
                <p className="text-2xl font-bold text-card-foreground mt-0.5">{m.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.change}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
