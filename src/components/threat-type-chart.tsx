"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { MoreVertical } from "lucide-react"
import { Doughnut } from "react-chartjs-2"
import { Chart as ChartJS, ArcElement, Tooltip, Legend, type ChartData } from "chart.js"
import { supabase } from "@/utils/supabase/client"
import { ThreatType } from "@/types/supabase"

ChartJS.register(ArcElement, Tooltip, Legend)

const COLORS: Record<string, string> = {
  "Malware Infection": "#8B5CF6",
  "Phishing": "#FF29A8",
  "DDoS": "#6EE7B7",
  "SQL Injection": "#4CAF50",
  "XSS": "#FFC107",
  "Ransomware": "#FF5722",
  "Brute Force Attack": "#2196F3",
  "Man-in-the-Middle": "#9C27B0",
  "Zero-Day Exploit": "#607D8B",
  "Insider Threat": "#795548",
  "Unknown": "#666666" // Fallback for unknown threat types
}

export default function ThreatTypeChart() {
  const [chartData, setChartData] = useState<ChartData<"doughnut">>({
    datasets: [{
      data: [],
      backgroundColor: [],
      borderWidth: 0,
      spacing: 2
    }],
    labels: []
  });
  const [totalThreats, setTotalThreats] = useState(0);
  const [threatCounts, setThreatCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchThreatData = async () => {
      const { data: threats, error } = await supabase()
        .from('attack_reports')
        .select('type')
        .order('created_at', { ascending: false })
        // For example, fetch up to 10k rows if needed
        .range(0, 9999);

      console.log("threats", threats);
      if (error) {
        console.error('Error fetching threat data:', error);
        return;
      }

      // Count threats by type; if type is null, assign it as "Unknown"
      const counts: Record<string, number> = {};
      threats?.forEach(threat => {
        const threatType = threat.type ? (threat.type as ThreatType) : "Unknown";
        counts[threatType] = (counts[threatType] || 0) + 1;
      });

      // If no threats found, show empty state
      if (Object.keys(counts).length === 0) {
        setChartData({
          datasets: [{
            data: [1],
            backgroundColor: ['#333333'],
            borderWidth: 0,
            spacing: 2
          }],
          labels: ['No data']
        });
        setThreatCounts({});
        setTotalThreats(0);
        return;
      }

      // Sort counts by descending order and take the top 5 values.
      const sortedThreats = Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);

      const labels = sortedThreats.map(([type]) => type);
      const data = sortedThreats.map(([, count]) => count);
      const backgroundColor = labels.map(type => COLORS[type] || '#666666');

      setChartData({
        datasets: [{
          data,
          backgroundColor,
          borderWidth: 0,
          spacing: 2
        }],
        labels
      });

      setThreatCounts(Object.fromEntries(sortedThreats));
      // Count all threats, including those with a null type (now marked as "Unknown")
      setTotalThreats(threats.length);
    };

    fetchThreatData();
    const interval = setInterval(fetchThreatData, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-[#141414] border-[#1F1F1F] p-6 rounded-xl h-[400px]">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-white">Threat Type</h3>
        <button className="text-[#666666] hover:text-[#888888] transition-colors">
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>

      {/* Chart Container */}
      <div className="relative h-[200px]">
        <Doughnut
          data={chartData}
          options={{
            cutout: "75%",
            plugins: {
              legend: { display: false },
              tooltip: {
                enabled: true,
                backgroundColor: "#1A1A1A",
                titleColor: "#fff",
                bodyColor: "#fff",
                borderWidth: 0,
                cornerRadius: 8,
                displayColors: true,
                callbacks: {
                  label: (context) => {
                    const value = context.raw as number;
                    const total = (context.dataset.data as number[]).reduce((a, b) => a + b, 0);
                    const percentage = ((value * 100) / total).toFixed(1);
                    return `${value} (${percentage}%)`;
                  }
                }
              },
            },
            maintainAspectRatio: false,
          }}
          className="h-4"
        />
        {/* Center Count */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">{totalThreats}</div>
            <div className="text-sm text-[#666666]">Total Threats</div>
          </div>
        </div>
      </div>

      {/* Custom Legend placed BELOW the chart container */}
      <div className="mt-4 flex justify-center gap-4 flex-wrap max-h-[100px] overflow-y-auto">
        {Object.entries(threatCounts).map(([type, count]) => (
          <div key={type} className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: COLORS[type] || '#666666' }}
            />
            <span className="text-sm text-white">{type}</span>
            <span 
              className="text-sm ml-1" 
              style={{ color: COLORS[type] || '#666666' }}
            >
              {count}
            </span>
          </div>
        ))}
      </div>
    </Card>
  )
}

