"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useCreateAdminReport } from "@/hooks/use-admin-reports";

interface AdminReportModalProps {
  onClose: () => void;
  onReportCreated?: () => void;
}

export default function AdminReportModal({ onClose, onReportCreated }: AdminReportModalProps) {
  const [reportText, setReportText] = useState("");
  const createReportMutation = useCreateAdminReport();

  const handleSubmit = async () => {
    if (!reportText.trim()) {
      toast.error("Please enter a report.");
      return;
    }

    try {
      await createReportMutation.mutateAsync(reportText);
      toast.success("Report submitted successfully.");
      setReportText("");
      onReportCreated?.();
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to submit report");
    }
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="w-[95vw] max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">New Admin Report</DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Enter the details of your report below.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="Enter report details..."
            className="min-h-[120px] sm:min-h-[150px] text-sm sm:text-base"
            disabled={createReportMutation.isPending}
          />
        </div>
        <DialogFooter className="mt-6 flex-col sm:flex-row gap-2 sm:gap-0">
          <Button 
            variant="unstyled" 
            onClick={onClose} 
            disabled={createReportMutation.isPending} 
            className="bg-transparent text-white hover:bg-[#1A1A1A] w-full sm:w-auto order-2 sm:order-1"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={createReportMutation.isPending || !reportText.trim()}
            className="w-full sm:w-auto order-1 sm:order-2"
          >
            {createReportMutation.isPending ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
