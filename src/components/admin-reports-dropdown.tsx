"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import AdminReportModal from "./admin-report-modal";
import AdminReportDetailModal, { AdminReport } from "./admin-report-detail-modal";

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
      .select("*")
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

  const openReportDetail = (report: AdminReport) => {
    setSelectedReport(report);
    setOpen(false);
  };

  return (
    <div className="relative">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <span className="text-sm font-medium">Reports</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-80 p-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Admin Reports</h3>
            <Button size="sm" onClick={() => { setShowModal(true); setOpen(false); }}>
              New Report
            </Button>
          </div>
          <ScrollArea className="h-[280px]">
            {loading ? (
              <div className="flex items-center justify-center h-20 text-muted-foreground">
                Loading...
              </div>
            ) : reports.length === 0 ? (
              <div className="flex items-center justify-center h-20 text-muted-foreground">
                No reports found.
              </div>
            ) : (
              <div className="space-y-2">
                {reports.map((report) => (
                  <button
                    key={report.id}
                    onClick={() => openReportDetail(report)}
                    className="w-full text-left p-3 rounded-md hover:bg-accent transition-colors"
                  >
                    <div className="text-sm font-medium">
                      {new Date(report.created_at).toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
                      {report.reports}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
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
