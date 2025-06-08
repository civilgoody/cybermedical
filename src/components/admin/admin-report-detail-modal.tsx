"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

export interface AdminReport {
  id: string;
  admin: string;
  reports: string;
  created_at: string;
  profiles?: {
    first_name: string;
  } | null;
}

interface AdminReportDetailModalProps {
  report: AdminReport;
  onClose: () => void;
}

export default function AdminReportDetailModal({ report, onClose }: AdminReportDetailModalProps) {
  return (
    <Dialog open onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Report Details</DialogTitle>
          <div className="flex flex-col gap-1 mt-1">
            <div className="text-sm">
              By: <span className="text-foreground">{report.profiles?.first_name || 'Unknown Admin'}</span>
            </div>
            <time className="text-sm text-muted-foreground">
              {new Date(report.created_at).toLocaleString()}
            </time>
          </div>
        </DialogHeader>
        <ScrollArea className="mt-4 max-h-[60vh]">
          <div className="space-y-4">
            <div className="prose prose-invert max-w-none">
              <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                {report.reports}
              </p>
            </div>
          </div>
        </ScrollArea>
        <div className="mt-6 flex justify-end">
          <Button variant="unstyled" onClick={onClose} className="bg-transparent text-white hover:bg-[#1A1A1A]">
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
} 
