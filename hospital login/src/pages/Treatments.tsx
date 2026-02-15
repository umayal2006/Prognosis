import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { DashboardLayout } from "@/components/DashboardLayout";
import { MetricCard } from "@/components/MetricCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Activity, Syringe, HeartPulse, UserCheck, BarChart3 } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

type Treatment = {
  id: string;
  patient_id: string;
  doctor_id: string | null;
  treatment_type: string;
  title: string;
  description: string | null;
  start_date: string;
  end_date: string | null;
  outcome: string | null;
  status: string;
};

const COLORS = ["hsl(217,91%,60%)", "hsl(142,71%,45%)", "hsl(25,95%,53%)", "hsl(0,72%,51%)"];

const Treatments = () => {
  const [treatments, setTreatments] = useState<Treatment[]>([]);

  useEffect(() => {
    const fetchTreatments = async () => {
      const { data } = await supabase.from("treatments").select("*").order("created_at", { ascending: false });
      setTreatments((data as Treatment[]) ?? []);
    };
    fetchTreatments();
  }, []);

  const ongoing = treatments.filter((t) => t.treatment_type === "Ongoing" && t.status === "Active");
  const surgeries = treatments.filter((t) => t.treatment_type === "Surgery");
  const icu = treatments.filter((t) => t.treatment_type === "ICU");
  const discharged = treatments.filter((t) => t.treatment_type === "Discharged" || t.status === "Completed");

  const completed = treatments.filter((t) => t.status === "Completed");
  const successful = completed.filter((t) => t.outcome === "Successful");
  const successRate = completed.length > 0 ? Math.round((successful.length / completed.length) * 100) : 0;

  const typeData = [
    { name: "Ongoing", value: ongoing.length },
    { name: "Surgery", value: surgeries.length },
    { name: "ICU", value: icu.length },
    { name: "Discharged", value: discharged.length },
  ];

  const outcomeData = [
    { name: "Successful", value: successful.length },
    { name: "Ongoing", value: treatments.filter((t) => t.outcome === "Ongoing").length },
    { name: "Complicated", value: treatments.filter((t) => t.outcome === "Complicated").length },
    { name: "Failed", value: treatments.filter((t) => t.outcome === "Failed").length },
  ].filter((d) => d.value > 0);

  const TreatmentTable = ({ items }: { items: Treatment[] }) => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Start</TableHead>
          <TableHead>Outcome</TableHead>
          <TableHead>Status</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {items.length === 0 ? (
          <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-8">No treatments found</TableCell></TableRow>
        ) : (
          items.map((t) => (
            <TableRow key={t.id}>
              <TableCell className="font-medium">{t.title}</TableCell>
              <TableCell>{t.treatment_type}</TableCell>
              <TableCell>{t.start_date}</TableCell>
              <TableCell>{t.outcome ?? "—"}</TableCell>
              <TableCell><Badge variant={t.status === "Active" ? "default" : "secondary"}>{t.status}</Badge></TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Treatment & Case Tracking</h1>
          <p className="text-muted-foreground">Monitor treatments and outcomes</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard title="Ongoing" value={ongoing.length} icon={Activity} color="blue" />
          <MetricCard title="Surgeries" value={surgeries.length} icon={Syringe} color="orange" />
          <MetricCard title="ICU Patients" value={icu.length} icon={HeartPulse} color="red" />
          <MetricCard title="Success Rate" value={`${successRate}%`} icon={UserCheck} color="green" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader><CardTitle className="text-base">Treatments by Type</CardTitle></CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={typeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(214,32%,91%)" />
                  <XAxis dataKey="name" fontSize={12} />
                  <YAxis fontSize={12} />
                  <Tooltip />
                  <Bar dataKey="value" fill="hsl(217,91%,60%)" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="text-base">Outcome Distribution</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-center">
              {outcomeData.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={outcomeData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                      {outcomeData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-muted-foreground text-sm py-16">No outcome data yet</p>
              )}
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="ongoing">
          <TabsList>
            <TabsTrigger value="ongoing">Ongoing</TabsTrigger>
            <TabsTrigger value="surgery">Surgery</TabsTrigger>
            <TabsTrigger value="icu">ICU</TabsTrigger>
            <TabsTrigger value="discharged">Discharged</TabsTrigger>
          </TabsList>
          <TabsContent value="ongoing"><div className="rounded-lg border"><TreatmentTable items={ongoing} /></div></TabsContent>
          <TabsContent value="surgery"><div className="rounded-lg border"><TreatmentTable items={surgeries} /></div></TabsContent>
          <TabsContent value="icu"><div className="rounded-lg border"><TreatmentTable items={icu} /></div></TabsContent>
          <TabsContent value="discharged"><div className="rounded-lg border"><TreatmentTable items={discharged} /></div></TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
};

export default Treatments;
