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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>New Admin Report</DialogTitle>
          <DialogDescription>
            Enter the details of your report below.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <Textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="Enter report details..."
            className="min-h-[150px]"
            disabled={createReportMutation.isPending}
          />
        </div>
        <DialogFooter className="mt-6">
          <Button 
            variant="unstyled" 
            onClick={onClose} 
            disabled={createReportMutation.isPending} 
            className="bg-transparent text-white hover:bg-[#1A1A1A]"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={createReportMutation.isPending || !reportText.trim()}
          >
            {createReportMutation.isPending ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
