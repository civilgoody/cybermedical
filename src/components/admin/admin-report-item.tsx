"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AdminReport } from "./admin-report-detail-modal";
import { supabase } from "@/utils/supabase/client";
import { toast } from "sonner";

interface AdminReportItemProps {
  report: AdminReport;
  isSelected: boolean;
  onSelect: (report: AdminReport) => void;
  onDelete: (id: string) => void;
}

export default function AdminReportItem({ report, isSelected, onSelect, onDelete }: AdminReportItemProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the report detail
    if (isDeleting) return;

    setIsDeleting(true);
    const { error } = await supabase()
      .from("admin_reports")
      .delete()
      .eq("id", report.id);

    if (error) {
      toast.error("Failed to delete report", {
        description: "Please try again or contact support.",
      });
    } else {
      toast.success("Report deleted successfully");
      onDelete(report.id);
    }
    setIsDeleting(false);
  };

  return (
    <div
      onClick={() => onSelect(report)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group w-full cursor-pointer text-left p-3 rounded-md hover:bg-accent/50 bg-muted/50 transition-colors relative"
    >
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1">
          <div className="text-sm font-medium">
            {new Date(report.created_at).toLocaleString()}
          </div>
          <div className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {report.reports}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isSelected && (
            <div className="shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
          )}
          {isHovered && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              <Trash2 className="h-4 w-4" />
              <span className="sr-only">Delete report</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 
