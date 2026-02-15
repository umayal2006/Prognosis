import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, RotateCcw, FileCheck } from "lucide-react";

const hospitals = [
  { name: "City General Hospital", docs: 12, status: "Verified", updated: "2026-02-14" },
  { name: "St. Mary's Medical Center", docs: 8, status: "Pending", updated: "2026-02-13" },
  { name: "Regional Health Institute", docs: 15, status: "Verified", updated: "2026-02-12" },
  { name: "Metro Children's Hospital", docs: 6, status: "Rejected", updated: "2026-02-11" },
  { name: "Sunrise Community Clinic", docs: 10, status: "Pending", updated: "2026-02-10" },
];

const statusStyles: Record<string, string> = {
  Verified: "bg-status-verified/10 text-status-verified",
  Pending: "bg-status-pending/10 text-status-pending",
  Rejected: "bg-status-critical/10 text-status-critical",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusStyles[status] ?? ""}`}>
      {status}
    </span>
  );
}

export function HospitalVerification() {
  return (
    <section>
      <h2 className="text-lg font-semibold text-foreground mb-4">Hospital Data Verification</h2>
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-primary" />
            Document Verification Queue
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hospital Name</TableHead>
                <TableHead className="text-center">Documents</TableHead>
                <TableHead className="text-center">Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hospitals.map((h) => (
                <TableRow key={h.name}>
                  <TableCell className="font-medium">{h.name}</TableCell>
                  <TableCell className="text-center">{h.docs}</TableCell>
                  <TableCell className="text-center"><StatusBadge status={h.status} /></TableCell>
                  <TableCell className="text-muted-foreground text-sm">{h.updated}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-status-verified hover:text-status-verified">
                        <CheckCircle2 className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-status-critical hover:text-status-critical">
                        <XCircle className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 px-2 text-status-warning hover:text-status-warning">
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
