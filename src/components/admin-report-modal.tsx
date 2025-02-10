"use client";

import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AdminReportModalProps {
  onClose: () => void;
  onReportCreated: () => void;
}

export default function AdminReportModal({ onClose, onReportCreated }: AdminReportModalProps) {
  const [reportText, setReportText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!reportText) {
      setError("Please enter a report.");
      return;
    }
    setLoading(true);
    setError(null);

    // Get the current user to record who made the report.
    const {
      data: { user },
    } = await supabase().auth.getUser();
    if (!user) {
      setError("User not found.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase()
      .from("admin_reports")
      .insert({
        admin: user.id,
        reports: reportText,
      });
    if (insertError) {
      setError(insertError.message);
    } else {
      setReportText("");
      onReportCreated();
      onClose();
    }
    setLoading(false);
  };

  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="bg-[#141414] border-[#1F1F1F] p-6 rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-white">New Admin Report</DialogTitle>
          <DialogDescription className="text-[#666666]">
            Enter the details of the report.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4">
          <textarea
            value={reportText}
            onChange={(e) => setReportText(e.target.value)}
            placeholder="Enter report details..."
            className="w-full p-2 bg-[#1A1A1A] text-white border border-[#1F1F1F] rounded"
            rows={4}
          />
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
