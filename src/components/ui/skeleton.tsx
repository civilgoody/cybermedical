import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn(
      "bg-[#1A1A1A] rounded-md animate-pulse",
      className
    )} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-[#141414] border-[#1F1F1F] p-4 rounded-xl">
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5" />
            <Skeleton className="w-24 h-4" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="w-16 h-6 rounded-full" />
            <Skeleton className="w-16 h-6 rounded-full" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4" />
          <Skeleton className="w-32 h-3" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-full h-3" />
          <Skeleton className="w-20 h-4" />
          <Skeleton className="w-full h-8" />
        </div>
      </div>
    </div>
  );
}

// Generic chart skeleton (fallback)
export function SkeletonChart() {
  return (
    <div className="bg-[#141414] border-[#1F1F1F] p-4 sm:p-6 rounded-xl">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="w-32 h-6" />
          <Skeleton className="w-5 h-5" />
        </div>
        <div className="flex items-center justify-center h-64">
          <Skeleton className="w-48 h-48 rounded-full" />
        </div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="w-3 h-3 rounded-full" />
                <Skeleton className="w-20 h-3" />
              </div>
              <Skeleton className="w-8 h-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Line Chart Skeleton (for Attack Frequency Chart)
export function SkeletonLineChart() {
  return (
    <div className="bg-[#141414] border-[#1F1F1F] p-4 sm:p-6 rounded-xl relative overflow-hidden h-[350px] sm:h-[400px]">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-900/20" />
      
      <div className="relative">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 gap-4">
          <div>
            <Skeleton className="w-32 sm:w-40 h-5 sm:h-6 mb-2" />
            <Skeleton className="w-40 sm:w-48 h-3 sm:h-4" />
          </div>
          <div className="flex gap-1 sm:gap-2">
            <Skeleton className="w-8 sm:w-10 h-6 sm:h-7 rounded-full" />
            <Skeleton className="w-6 sm:w-8 h-6 sm:h-7 rounded-full" />
            <Skeleton className="w-8 sm:w-10 h-6 sm:h-7 rounded-full" />
          </div>
        </div>

        <div className="h-[200px] sm:h-[250px] w-full relative">
          {/* Simulated axes */}
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-[#1A1A1A]" />
          <div className="absolute bottom-0 left-0 w-0.5 h-full bg-[#1A1A1A]" />
          
          {/* Simulated line chart path */}
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 200">
            <path
              d="M 20 160 Q 80 120 140 140 T 260 100 T 380 120"
              stroke="#FF29A8"
              strokeWidth="2"
              fill="none"
              className="opacity-30"
            />
            {/* Simulated data points */}
            {[20, 80, 140, 200, 260, 320, 380].map((x, i) => (
              <circle
                key={i}
                cx={x}
                cy={120 + (Math.sin(i) * 20)}
                r="3"
                fill="#FF29A8"
                className="opacity-30"
              />
            ))}
          </svg>
          
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-[#666666] pr-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="w-4 h-2" />
            ))}
          </div>
          
          {/* X-axis labels */}
          <div className="absolute bottom-0 left-0 w-full flex justify-between text-xs text-[#666666] pt-2">
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="w-8 h-2" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Bar Chart Skeleton (for Severity Breakdown Chart)
export function SkeletonBarChart() {
  return (
    <div className="bg-[#141414] border-[#1F1F1F] p-4 sm:p-6 rounded-xl h-[350px] sm:h-[400px] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-900/20" />
      
      <div className="relative">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-4">
          <div>
            <Skeleton className="w-36 sm:w-44 h-5 sm:h-6 mb-2" />
            <Skeleton className="w-32 sm:w-40 h-3 sm:h-4" />
          </div>
          <div className="flex gap-1 sm:gap-2">
            <Skeleton className="w-8 sm:w-10 h-6 sm:h-7 rounded-full" />
            <Skeleton className="w-6 sm:w-8 h-6 sm:h-7 rounded-full" />
            <Skeleton className="w-8 sm:w-10 h-6 sm:h-7 rounded-full" />
          </div>
        </div>
        
        <div className="h-[220px] sm:h-[300px] relative">
          {/* Simulated stacked bars */}
          <div className="absolute bottom-8 left-0 w-full h-full flex items-end justify-between gap-2 px-4">
            {[0, 1, 2, 3, 4, 5].map((i) => {
              const heights = [60, 80, 45, 70, 55, 90];
              return (
                <div key={i} className="flex-1 flex flex-col gap-0.5">
                  <Skeleton className={`w-full opacity-60`} style={{ height: `${heights[i]}%` }} />
                </div>
              );
            })}
          </div>
          
          {/* Legend */}
          <div className="absolute bottom-0 left-0 w-full flex justify-center gap-2 sm:gap-4 flex-wrap pt-2">
            {['Low', 'Medium', 'High', 'Critical'].map((label, i) => (
              <div key={label} className="flex items-center gap-1">
                <Skeleton className="w-2 h-2 rounded-full" />
                <Skeleton className="w-8 sm:w-12 h-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Doughnut Chart Skeleton (for Threat Type Chart)
export function SkeletonDoughnutChart() {
  return (
    <div className="bg-[#141414] border-[#1F1F1F] p-4 sm:p-6 rounded-xl h-[350px] sm:h-[400px] relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-purple-900/20" />
      
      <div className="relative">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <Skeleton className="w-24 sm:w-32 h-5 sm:h-6" />
          <Skeleton className="w-4 h-4 sm:w-5 sm:h-5" />
        </div>

        <div className="relative h-[160px] sm:h-[220px] flex items-center justify-center">
          {/* Simulated doughnut chart */}
          <div className="relative">
            <Skeleton className="w-32 sm:w-40 h-32 sm:h-40 rounded-full" />
            <div className="absolute inset-4 sm:inset-6 bg-[#141414] rounded-full flex items-center justify-center">
              <div className="text-center">
                <Skeleton className="w-8 sm:w-12 h-6 sm:h-8 mb-1" />
                <Skeleton className="w-12 sm:w-16 h-3" />
              </div>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 sm:mt-6 flex justify-center gap-2 sm:gap-4 flex-wrap max-h-[60px] sm:max-h-[80px] overflow-y-auto">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-1 sm:gap-2 bg-[#1A1A1A] px-2 sm:px-3 py-1 sm:py-1.5 rounded-full">
              <Skeleton className="w-2 h-2 rounded-full" />
              <Skeleton className="w-12 sm:w-16 h-3" />
              <Skeleton className="w-4 h-3" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SkeletonProfile() {
  return (
    <div className="min-h-screen bg-black p-4 sm:p-8 lg:px-32">
      <Skeleton className="w-24 sm:w-32 h-6 sm:h-8 mb-6 sm:mb-8" />
      
      {/* Profile Header Card */}
      <div className="bg-[#141414] border-[#1F1F1F] p-4 sm:p-6 rounded-xl mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div>
              <Skeleton className="w-24 sm:w-32 h-5 sm:h-6 mb-2" />
              <Skeleton className="w-12 sm:w-16 h-3 sm:h-4 mb-2" />
              <Skeleton className="w-20 sm:w-24 h-3 sm:h-4" />
            </div>
          </div>
          <Skeleton className="w-12 sm:w-16 h-8 rounded-lg self-start" />
        </div>
      </div>

      {/* Personal Information Card */}
      <div className="bg-[#141414] border-[#1F1F1F] p-4 sm:p-6 rounded-xl mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <Skeleton className="w-32 sm:w-40 h-5 sm:h-6" />
          <Skeleton className="w-12 sm:w-16 h-8 rounded-lg self-start" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <Skeleton className="w-16 sm:w-20 h-3 sm:h-4 mb-2" />
              <Skeleton className="w-24 sm:w-32 h-4 sm:h-5" />
            </div>
          ))}
          <div className="sm:col-span-2">
            <Skeleton className="w-12 sm:w-16 h-3 sm:h-4 mb-2" />
            <Skeleton className="w-full h-4 sm:h-5" />
          </div>
        </div>
      </div>

      {/* Address Card */}
      <div className="bg-[#141414] border-[#1F1F1F] p-4 sm:p-6 rounded-xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <Skeleton className="w-20 sm:w-24 h-5 sm:h-6" />
          <Skeleton className="w-12 sm:w-16 h-8 rounded-lg self-start" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <Skeleton className="w-16 sm:w-20 h-3 sm:h-4 mb-2" />
              <Skeleton className="w-24 sm:w-32 h-4 sm:h-5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
 