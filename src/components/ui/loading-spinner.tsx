import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({ size = "md", className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6", 
    lg: "w-10 h-10"
  };

  return (
    <div className={cn(
      "border-t-2 border-b-2 border-primary rounded-full animate-spin",
      sizeClasses[size],
      className
    )} />
  );
}

interface LoadingScreenProps {
  message?: string;
}

export function LoadingScreen({ message = "Loading..." }: LoadingScreenProps) {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <LoadingSpinner size="lg" />
        <p className="text-[#999999] text-sm">{message}</p>
      </div>
    </div>
  );
}

interface LoadingCardProps {
  className?: string;
}

export function LoadingCard({ className }: LoadingCardProps) {
  return (
    <div className={cn(
      "bg-[#141414] border-[#1F1F1F] p-6 rounded-xl flex items-center justify-center",
      className
    )}>
      <LoadingSpinner />
    </div>
  );
} 
