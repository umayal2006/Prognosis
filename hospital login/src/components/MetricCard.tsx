import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color?: "blue" | "green" | "orange" | "red";
}

const colorMap = {
  blue: "bg-[hsl(var(--medical-blue-light))] text-[hsl(var(--medical-blue))]",
  green: "bg-[hsl(var(--medical-green-light))] text-[hsl(var(--medical-green))]",
  orange: "bg-[hsl(var(--medical-orange-light))] text-[hsl(var(--medical-orange))]",
  red: "bg-[hsl(var(--medical-red-light))] text-[hsl(var(--medical-red))]",
};

export function MetricCard({ title, value, icon: Icon, color = "blue" }: MetricCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${colorMap[color]}`}>
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
