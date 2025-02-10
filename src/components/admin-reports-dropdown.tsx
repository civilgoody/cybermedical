"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AdminReportModal from "./admin-report-modal";
import AdminReportDetailModal, { AdminReport } from "./admin-report-detail-modal";
import AdminReportItem from "./admin-report-item";
import { RxPlus } from "react-icons/rx";

export default function AdminReportsDropdown() {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchReports = async () => {
    setLoading(true);
    const { data, error } = await supabase()
      .from("admin_reports")
      .select(`
        *,
        profiles:admin (
          first_name
        )
      `)
      .order("created_at", { ascending: false })
      .limit(10);

    if (error) {
      console.error("Error fetching admin reports:", error.message);
    } else {
      setReports(data as AdminReport[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (open) {
      fetchReports();
    }
  }, [open]);

  const handleDelete = (id: string) => {
    setReports(reports.filter(report => report.id !== id));
    if (selectedReport?.id === id) {
      setSelectedReport(null);
    }
  };

  return (
    <div className="relative">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="unstyled" size="sm" className="flex items-center gap-2 text-muted hover:text-foreground">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="text-sm">Reports</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-4 bg-background border shadow-lg backdrop-blur-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Admin Reports</h3>
            <Button size="sm" onClick={() => { setShowModal(true); setOpen(false); }}>
              <RxPlus className="w-4 h-4" />
            </Button>
          </div>
          <div className="h-[280px] custom-scrollbar overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center h-20 text-muted-foreground">
                Loading...
              </div>
            ) : reports.length === 0 ? (
              <div className="flex items-center justify-center h-20 text-muted-foreground">
                No reports found.
              </div>
            ) : (
              <div className="space-y-2 pr-2">
                {reports.map((report) => (
                  <AdminReportItem
                    key={report.id}
                    report={report}
                    isSelected={selectedReport?.id === report.id}
                    onSelect={setSelectedReport}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
      {showModal && (
        <AdminReportModal onClose={() => setShowModal(false)} onReportCreated={fetchReports} />
      )}
      {selectedReport && (
        <AdminReportDetailModal report={selectedReport} onClose={() => setSelectedReport(null)} />
      )}
    </div>
  );
} 
