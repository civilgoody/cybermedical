"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import AdminReportModal from "@/components/admin-report-modal";


interface AdminReport {
  id: string;
  admin: string;
  reports: string;
  created_at: string;
}

export default function AdminReportsDropdown() {
  const [reports, setReports] = useState<AdminReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);
  const [showModal, setShowModal] = useState(false);

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
    if (showDropdown) {
      fetchReports();
    }
  }, [showDropdown]);

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const openReportDetail = (report: AdminReport) => {
    setSelectedReport(report);
  };

  return (
    <div className="relative">
      <button onClick={toggleDropdown} className="flex items-center gap-2 text-[#666666] hover:text-white transition-colors">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
          <path
            strokeLinecap="round"

            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <span className="text-sm">Reports</span>
      </button>
      {showDropdown && (
        <Card className="absolute right-0 mt-2 w-80 max-h-80 overflow-auto bg-[#141414] border-[#1F1F1F] p-4 rounded-lg z-10">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-white text-lg">Admin Reports</h3>
            <Button size="sm" onClick={() => setShowModal(true)}>
              New Report
            </Button>
          </div>
          {loading ? (
            <div className="text-white">Loading...</div>
          ) : reports.length === 0 ? (
            <div className="text-white">No reports found.</div>
          ) : (
            <ul>
              {reports.map((report) => (
                <li
                  key={report.id}
                  className="mb-2 p-2 rounded hover:bg-[#1A1A1A] cursor-pointer text-white"
                  onClick={() => openReportDetail(report)}
                >
                  <div className="text-sm font-semibold">
                    {new Date(report.created_at).toLocaleString()}
                  </div>
                  <div className="truncate">
                    {report.reports}
                  </div>
                </li>
              ))}
            </ul>
          )}
          {selectedReport && (
            <Card className="mt-4 bg-[#242424] border-[#1F1F1F] p-4 rounded-lg">
              <h4 className="text-white text-lg mb-2">
                {new Date(selectedReport.created_at).toLocaleString()}
              </h4>
              <p className="text-white">{selectedReport.reports}</p>
              <Button size="sm" onClick={() => setSelectedReport(null)} className="mt-2">
                Close
              </Button>
            </Card>
          )}
        </Card>
      )}
      {showModal && (
        <AdminReportModal onClose={() => setShowModal(false)} onReportCreated={fetchReports} />
      )}
    </div>
  );
} 
