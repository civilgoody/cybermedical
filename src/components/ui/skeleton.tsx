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

export function SkeletonChart() {
  return (
    <div className="bg-[#141414] border-[#1F1F1F] p-4 rounded-xl">
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

export function SkeletonProfile() {
  return (
    <div className="min-h-screen bg-black p-8 px-32">
      <Skeleton className="w-32 h-8 mb-8" />
      
      {/* Profile Header Card */}
      <div className="bg-[#141414] border-[#1F1F1F] p-6 rounded-xl mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="w-16 h-16 rounded-full" />
            <div>
              <Skeleton className="w-32 h-6 mb-2" />
              <Skeleton className="w-16 h-4 mb-2" />
              <Skeleton className="w-24 h-4" />
            </div>
          </div>
          <Skeleton className="w-16 h-8 rounded-lg" />
        </div>
      </div>

      {/* Personal Information Card */}
      <div className="bg-[#141414] border-[#1F1F1F] p-6 rounded-xl mb-6">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="w-40 h-6" />
          <Skeleton className="w-16 h-8 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i}>
              <Skeleton className="w-20 h-4 mb-2" />
              <Skeleton className="w-32 h-5" />
            </div>
          ))}
          <div className="col-span-2">
            <Skeleton className="w-16 h-4 mb-2" />
            <Skeleton className="w-full h-5" />
          </div>
        </div>
      </div>

      {/* Address Card */}
      <div className="bg-[#141414] border-[#1F1F1F] p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="w-24 h-6" />
          <Skeleton className="w-16 h-8 rounded-lg" />
        </div>
        <div className="grid grid-cols-2 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i}>
              <Skeleton className="w-20 h-4 mb-2" />
              <Skeleton className="w-32 h-5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 
