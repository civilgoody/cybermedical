import { Bell, Settings } from "lucide-react"
import { RxDashboard } from "react-icons/rx";

export function NavMenu() {
  return (
    <nav className="flex items-center gap-6 bg-[#1A1A1A] rounded-full px-4 py-2">
      <button className="bg-custom-gradient text-foreground px-4 py-3 rounded-lg text-sm flex items-center gap-2">
        <RxDashboard className="w-4 h-4" />
        Dashboard
      </button>
      <button className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">

        <Bell className="w-4 h-4" />
        <span className="text-sm">Alerts</span>
      </button>
      <button className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
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
      <button className="flex items-center gap-2 text-muted hover:text-foreground transition-colors">
        <Settings className="w-4 h-4" />
        <span className="text-sm">Settings</span>
      </button>
    </nav>
  );
} 
