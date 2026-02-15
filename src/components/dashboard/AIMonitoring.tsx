import { useState } from "react";
import { Brain, FileText, AlertCircle, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

const aiMetrics = [
  { label: "Model Accuracy", value: "94.7%", progress: 94.7, icon: TrendingUp },
  { label: "False Positive Rate", value: "3.2%", progress: 3.2, icon: AlertCircle },
  { label: "False Negative Rate", value: "2.7%", progress: 2.7, icon: AlertCircle },
];

const flaggedCases = [
  { disease: "COVID-19", count: 32, severity: "High" },
  { disease: "Dengue", count: 24, severity: "High" },
  { disease: "Malaria", count: 18, severity: "Medium" },
  { disease: "Tuberculosis", count: 15, severity: "Medium" },
];

const sampleLogs = [
  { id: 1, time: "2026-02-14 10:32:15", model: "Risk Classifier v2.1", caseId: "PT-4821", outcome: "High risk", confidence: 0.94, factors: "Fever, cough, SpO2 92%" },
  { id: 2, time: "2026-02-14 10:28:44", model: "Risk Classifier v2.1", caseId: "PT-4819", outcome: "Medium risk", confidence: 0.78, factors: "Dengue markers, platelet count" },
  { id: 3, time: "2026-02-14 10:15:22", model: "Risk Classifier v2.1", caseId: "PT-4815", outcome: "Low risk", confidence: 0.91, factors: "Routine check, vitals normal" },
  { id: 4, time: "2026-02-14 09:58:03", model: "Risk Classifier v2.1", caseId: "PT-4812", outcome: "High risk", confidence: 0.88, factors: "TB screening positive, weight loss" },
  { id: 5, time: "2026-02-14 09:41:50", model: "Risk Classifier v2.1", caseId: "PT-4808", outcome: "Medium risk", confidence: 0.82, factors: "Malaria suspected, travel history" },
];

export function AIMonitoring() {
  const [logsOpen, setLogsOpen] = useState(false);
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-4">AI Monitoring</h2>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Brain className="h-4 w-4 text-primary" />
              AI Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {aiMetrics.map((m) => (
              <div key={m.label}>
                <div className="flex justify-between items-center mb-1.5">
                  <span className="text-sm text-card-foreground">{m.label}</span>
                  <span className="text-sm font-semibold text-card-foreground">{m.value}</span>
                </div>
                <Progress value={m.progress} className="h-2" />
              </div>
            ))}
            <Button variant="outline" size="sm" className="mt-3 gap-2" onClick={() => setLogsOpen(true)}>
              <FileText className="h-4 w-4" />
              View Explainability Logs
            </Button>
          </CardContent>
        </Card>
        <Dialog open={logsOpen} onOpenChange={setLogsOpen}>
          <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                AI Explainability Logs
              </DialogTitle>
            </DialogHeader>
            <ScrollArea className="flex-1 min-h-[280px] rounded-md border p-3">
              <div className="space-y-3">
                {sampleLogs.map((log) => (
                  <div key={log.id} className="rounded-lg border bg-muted/30 p-3 text-sm space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                      <span className="font-mono text-xs">{log.time}</span>
                      <span className="text-xs">·</span>
                      <span className="text-xs">{log.model}</span>
                      <span className="text-xs">·</span>
                      <span className="font-medium text-foreground">{log.caseId}</span>
                    </div>
                    <p className="text-foreground font-medium">{log.outcome} (confidence: {(log.confidence * 100).toFixed(0)}%)</p>
                    <p className="text-muted-foreground text-xs">Factors: {log.factors}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </DialogContent>
        </Dialog>
        <Card className="shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              AI-Flagged High-Risk Cases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-card-foreground mb-4">89</p>
            <div className="space-y-3">
              {flaggedCases.map((c) => (
                <div key={c.disease} className="flex items-center justify-between">
                  <span className="text-sm text-card-foreground">{c.disease}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-card-foreground">{c.count}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
                      c.severity === "High" ? "bg-status-critical/10 text-status-critical" : "bg-status-warning/10 text-status-warning"
                    }`}>
                      {c.severity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
