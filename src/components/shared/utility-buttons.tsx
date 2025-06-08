import { Bell, Search, Mail } from "lucide-react"

export function UtilityButtons() {
  return (
    <div className="flex items-center gap-4">
      {/* Search Button */}
      <button className="p-2 rounded-full bg-[#1A1A1A]">
        <Search className="w-5 h-5 text-muted" />
      </button>

      {/* Notifications and Messages */}
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-full bg-[#1A1A1A] relative">
          <Bell className="w-5 h-5 text-muted" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-2 rounded-full bg-[#1A1A1A] relative">
          <Mail className="w-5 h-5 text-muted" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
      </div>
    </div>
  );
} 
