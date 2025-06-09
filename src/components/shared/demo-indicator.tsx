import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";
import { DEMO_USER_EMAIL } from "@/lib/constants";

interface DemoIndicatorProps {
  userEmail?: string;
}

export default function DemoIndicator({ userEmail }: DemoIndicatorProps) {
  const isDemoUser = userEmail === DEMO_USER_EMAIL;

  if (!isDemoUser) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Badge className="bg-primary/20 text-primary border-primary/30 hover:bg-transparent hover:scale-105 transition-all duration-300 px-3 py-1.5 text-sm font-medium">
        <Eye className="w-3 h-3 mr-1.5" />
        Demo Mode
      </Badge>
    </div>
  );
} 
