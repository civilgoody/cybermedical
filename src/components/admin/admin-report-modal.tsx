"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
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


interface AdminReportModalProps {
  onClose: () => void;
  onReportCreated: () => void;
}

export default function AdminReportModal({ onClose, onReportCreated }: AdminReportModalProps) {
  const [reportText, setReportText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!reportText.trim()) {
      toast.error("Please enter a report.");
      return;
    }
    setLoading(true);

    const {
      data: { user },
    } = await supabase().auth.getUser();
    if (!user) {
      toast.error("User not found.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase()
      .from("admin_reports")
      .insert({
        admin: user.id,
        reports: reportText.trim(),
      });

    if (insertError) {
      toast.error(insertError.message);
    } else {
      toast.success("Report submitted successfully.");
      setReportText("");
      onReportCreated();
      onClose();
    }
    setLoading(false);
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
          />
        </div>
        <DialogFooter className="mt-6">
          <Button variant="unstyled" onClick={onClose} disabled={loading} className="bg-transparent text-white hover:bg-[#1A1A1A]">
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit Report"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 
