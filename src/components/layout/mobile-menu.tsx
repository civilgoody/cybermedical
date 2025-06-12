"use client";

import { useState } from "react";
import { Menu, X, Bell, Search, Mail, Settings, FileText, Plus } from "lucide-react";
import { RxDashboard } from "react-icons/rx";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import AdminReportModal from "@/components/admin/admin-report-modal";
import AdminReportDetailModal from "@/components/admin/admin-report-detail-modal";
import AdminReportItem from "@/components/admin/admin-report-item";
import { useAdminReports, AdminReport } from "@/hooks/use-admin-reports";

export function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<AdminReport | null>(null);
  const pathname = usePathname();
  
  const { data: reports = [], isLoading, error } = useAdminReports();
  const displayReports = reports.slice(0, 5); // Show fewer reports in mobile

  const closeMenu = () => setIsOpen(false);

  const handleOpenReportModal = () => {
    setIsOpen(false); // Close mobile menu first
    setTimeout(() => setShowReportModal(true), 100); // Small delay to avoid conflicts
  };

  const handleSelectReport = (report: AdminReport) => {
    setIsOpen(false); // Close mobile menu first
    setTimeout(() => setSelectedReport(report), 100); // Small delay to avoid conflicts
  };

  const handleDelete = (id: string) => {
    if (selectedReport?.id === id) {
      setSelectedReport(null);
    }
  };

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] bg-black border-[#1F1F1F]">
          <SheetHeader>
            <SheetTitle className="text-white text-left">Menu</SheetTitle>
          </SheetHeader>
          
          <div className="flex flex-col gap-6 mt-6">
            {/* Navigation Links */}
            <nav className="flex flex-col gap-2">
              <Link
                href="/"
                onClick={closeMenu}
                className={`flex items-center gap-3 text-sm px-4 py-3 rounded-lg transition-colors ${
                  pathname === "/"
                    ? "bg-custom-gradient text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <RxDashboard className="w-5 h-5" />
                <span>Dashboard</span>
              </Link>
              
              <button 
                onClick={closeMenu}
                className="flex items-center gap-3 text-muted hover:text-foreground transition-colors text-sm px-4 py-3 rounded-lg"
              >
                <Bell className="w-5 h-5" />
                <span>Alerts</span>
              </button>
              
              <Link
                href="/settings"
                onClick={closeMenu}
                className={`flex items-center gap-3 text-sm px-4 py-3 rounded-lg transition-colors ${
                  pathname.startsWith("/settings")
                    ? "bg-custom-gradient text-foreground"
                    : "text-muted hover:text-foreground"
                }`}
              >
                <Settings className="w-5 h-5" />
                <span>Settings</span>
              </Link>
            </nav>

            {/* Admin Reports Section */}
            <div className="border-t border-[#1F1F1F] pt-4">
              <div className="flex items-center justify-between mb-3 px-4">
                <h3 className="text-sm font-medium text-muted">Admin Reports</h3>
                <Button 
                  size="sm" 
                  onClick={handleOpenReportModal}
                  className="h-6 w-6 p-0"
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              
              <div className="max-h-[200px] overflow-y-auto custom-scrollbar">
                {isLoading ? (
                  <div className="flex items-center justify-center h-16 px-4">
                    <LoadingSpinner size="sm" />
                  </div>
                ) : error ? (
                  <div className="flex items-center justify-center h-16 text-red-400 text-sm px-4">
                    Error loading reports
                  </div>
                ) : displayReports.length === 0 ? (
                  <div className="flex items-center justify-center h-16 text-muted-foreground text-sm px-4">
                    No reports found.
                  </div>
                ) : (
                  <div className="space-y-2 px-4">
                    {displayReports.map((report) => (
                      <div
                        key={report.id}
                        onClick={() => handleSelectReport(report)}
                        className="cursor-pointer p-2 rounded-md hover:bg-accent/50 bg-muted/50 transition-colors"
                      >
                        <div className="text-xs font-medium text-white">
                          {new Date(report.created_at).toLocaleDateString()}
                        </div>
                        <div className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {report.reports}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Utility Actions */}
            <div className="border-t border-[#1F1F1F] pt-4">
              <h3 className="text-sm font-medium text-muted mb-3 px-4">Quick Actions</h3>
              <div className="flex flex-col gap-2 px-4">
                <button 
                  onClick={closeMenu}
                  className="flex items-center gap-3 text-muted hover:text-foreground transition-colors text-sm px-4 py-3 rounded-lg w-full text-left"
                >
                  <Search className="w-5 h-5" />
                  <span>Search</span>
                </button>
                
                <button 
                  onClick={closeMenu}
                  className="flex items-center gap-3 text-muted hover:text-foreground transition-colors text-sm px-4 py-3 rounded-lg w-full text-left relative"
                >
                  <Bell className="w-5 h-5" />
                  <span>Notifications</span>
                  <span className="w-2 h-2 bg-red-500 rounded-full ml-auto"></span>
                </button>
                
                <button 
                  onClick={closeMenu}
                  className="flex items-center gap-3 text-muted hover:text-foreground transition-colors text-sm px-4 py-3 rounded-lg w-full text-left relative"
                >
                  <Mail className="w-5 h-5" />
                  <span>Messages</span>
                  <span className="w-2 h-2 bg-red-500 rounded-full ml-auto"></span>
                </button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Modals - rendered outside of Sheet to avoid z-index conflicts */}
      {showReportModal && (
        <AdminReportModal onClose={() => setShowReportModal(false)} />
      )}
      {selectedReport && (
        <AdminReportDetailModal 
          report={selectedReport} 
          onClose={() => setSelectedReport(null)} 
        />
      )}
    </>
  );
}
