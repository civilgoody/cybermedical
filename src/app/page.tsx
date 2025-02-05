import { Bell, Settings, Search, ChevronDown } from "lucide-react"
import { ThreatReportSection } from "../components/threat-report-section"
import NetworkTrafficChart from "../components/network-traffic-chart"
import ThreatMap from "../components/threat-map"
import ThreatTypeChart from "../components/threat-type-chart"
import Sidebar from "../components/sidebar"
import Image from "next/image"
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-black">
      {/* Top Navigation */}
      <header className="h-16 px-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <button className="p-2 ">
            <Image src="/cyber-logo.png" alt="Cyber Logo" width={48} height={48} />
          </button>
          <nav className="flex items-center gap-6 bg-[#1A1A1A] rounded-full px-4 py-2">
            <button className="bg-[#FF29A8] text-white px-4 py-1.5 rounded-md text-sm flex items-center gap-2">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              Dashboard
            </button>
            <button className="flex items-center gap-2 text-[#666666] hover:text-white transition-colors">
              <Bell className="w-4 h-4" />
              <span className="text-sm">Alerts</span>
            </button>
            <button className="flex items-center gap-2 text-[#666666] hover:text-white transition-colors">
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
            <button className="flex items-center gap-2 text-[#666666] hover:text-white transition-colors">
              <Settings className="w-4 h-4" />
              <span className="text-sm">Settings</span>
            </button>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full bg-[#1A1A1A]">
            <Search className="w-5 h-5 text-[#666666]" />
          </button>
          <div className="flex items-center gap-4">
            <button className="p-2 rounded-full bg-[#1A1A1A]">
              <Bell className="w-5 h-5 text-[#666666]" />
            </button>
            <button className="p-2 rounded-full bg-[#1A1A1A]">
              <Settings className="w-5 h-5 text-[#666666]" />
            </button>
          </div>
          <div className="flex items-center gap-2 bg-[#1A1A1A] rounded-full px-3 py-2">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-JbcfEPrJt7fJ4PEnlUMqlzWY0tAguI.png"
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <div className="flex items-center gap-2">
              <div>
                <div className="text-sm font-medium text-white">John Doe</div>
                <div className="text-xs text-[#666666]">John@gmail.com</div>
              </div>
              <ChevronDown className="w-4 h-4 text-[#666666]" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        <main className="flex-1 p-6">
          <h1 className="text-2xl font-semibold text-white mb-6">Dashboard</h1>

          <div className="grid grid-cols-12 gap-6">
            {/* AI Threat Report - 4 columns */}
            <div className="col-span-4">
              <ThreatReportSection />
            </div>

            {/* Right side content - 8 columns */}
            <div className="col-span-8 space-y-6">
              {/* Network Traffic takes full width */}
              <NetworkTrafficChart />

              {/* Bottom row split into two */}
              <div className="grid grid-cols-2 gap-6">
                <ThreatMap />
                <ThreatTypeChart />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

