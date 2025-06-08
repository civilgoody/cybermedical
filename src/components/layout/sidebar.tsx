import { Home, BarChart2, Clock, Zap, Sun } from "lucide-react"

export default function Sidebar() {
  return (
    <div className="w-[72px] bg-gradient-to-b from-[#1A1A1A] to-black border-r border-[#1F1F1F]">
      <div className="flex flex-col items-center gap-6 py-6">
        <button className="p-3 rounded-xl bg-[#FF29A8] text-white">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <button className="p-3 rounded-xl text-[#666666] hover:text-white hover:bg-[#1F1F1F] transition-colors">
          <Home className="w-5 h-5" />
        </button>
        <button className="p-3 rounded-xl text-[#666666] hover:text-white hover:bg-[#1F1F1F] transition-colors">
          <BarChart2 className="w-5 h-5" />
        </button>
        <button className="p-3 rounded-xl text-[#666666] hover:text-white hover:bg-[#1F1F1F] transition-colors">
          <Clock className="w-5 h-5" />
        </button>
        <button className="p-3 rounded-xl text-[#666666] hover:text-white hover:bg-[#1F1F1F] transition-colors">
          <Zap className="w-5 h-5" />
        </button>
        <button className="p-3 rounded-xl text-[#666666] hover:text-white hover:bg-[#1F1F1F] transition-colors mt-auto">
          <Sun className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
}

