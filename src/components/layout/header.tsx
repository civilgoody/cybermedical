import { ChevronDown, LogOut } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { NavMenu } from "./nav-menu"
import { MobileMenu } from "./mobile-menu"
import { UtilityButtons } from "../shared/utility-buttons"
import { useRouter } from "next/navigation"
import { supabase } from "@/utils/supabase/client"
import { useProfile as useProfileHook } from "@/hooks/use-profile"
import { toast } from "sonner"

// Import Shadcn UI DropdownMenu components
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

// Import Shadcn UI Button component
import { Button } from "@/components/ui/button"

// Import React Icon for profile
import { FiUser } from "react-icons/fi"

export function Header() {
  const router = useRouter()
  const { user, profile, isLoading } = useProfileHook();

  const handleSignOut = async () => {
    try {
      console.log('🚪 Starting sign out process...');
      
      // Sign out from Supabase - the useProfile hook will handle clearing cache
      const { error } = await supabase().auth.signOut();
      
    if (error) {
        console.error("Error signing out:", error);
        toast.error("Sign out failed", {
          description: error.message
        });
        return;
    }
      
      console.log('✅ Successfully signed out');
      
    } catch (error) {
      console.error("Unexpected error during sign out:", error);
      toast.error("Sign out failed", {
        description: "An unexpected error occurred"
      });
  }
  };

  const isAuthenticated = !!user && !isLoading;

  return (
    <div className="flex items-center justify-between px-4 lg:px-6 h-16 mt-4 bg-black">
      {/* Left side: Logo + Mobile Menu */}
      <div className="flex items-center gap-4">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="p-2 rounded-full border border-purple-500/20">
            <Image src="/cyber-logo.png" alt="Cyber Logo" width={48} height={48} />
          </Link>
        </div>
        
        {/* Mobile Menu - Only show when authenticated */}
        {isAuthenticated && <MobileMenu />}
      </div>

      {/* Center Navigation – Only show when signed in and on desktop */}
      {isAuthenticated && (
        <div className="hidden md:flex flex-1 justify-center">
          <NavMenu />
        </div>
      )}

      {/* Right side: Utility buttons + Profile */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Utility Buttons – Only show when signed in and on larger screens */}
        {isAuthenticated && (
          <div className="hidden lg:block">
            <UtilityButtons />
          </div>
        )}

        {/* Profile/Region Section */}
        {isAuthenticated ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 bg-[#1A1A1A] rounded-full px-2 sm:px-3 py-2">
                {user?.user_metadata?.avatar_url ? (
                  <Image
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary text-foreground flex items-center justify-center">
                    {user?.email?.[0].toUpperCase()}
                  </div>
                )}
                {/* Text content - hidden on small screens */}
                <div className="hidden sm:flex flex-col items-start">
                  <span className="text-sm font-medium text-foreground truncate max-w-[110px]">
                    {profile
                      ? `${profile.first_name} ${profile.last_name}`
                      : user.email?.split("@")[0]}
                  </span>
                  <span className="text-xs text-muted truncate max-w-[110px]">
                    {user.email}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-muted hidden sm:block" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-[#1A1A1A] border border-border rounded-md shadow-lg w-48">
              <DropdownMenuLabel className="px-4 py-2 text-sm text-foreground">
                Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-sm text-muted hover:bg-transparent hover:text-foreground cursor-pointer"
                    onClick={() => router.push("/profile")}
                >
                  <FiUser className="mr-2 w-4 h-4" />
                  My Profile
                </Button>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-sm text-muted hover:bg-transparent hover:text-foreground cursor-pointer"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 w-4 h-4" />
                  Sign out
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          // Fallback (e.g., region button) when not signed in or profile not loaded
          <button className="flex items-center gap-2 bg-[#1A1A1A] rounded-full px-2 sm:px-4 py-2">
            <Image src="/uk-flag.png" alt="UK Flag" width={24} height={24} />
            <span className="text-sm text-foreground hidden sm:block">United Kingdom</span>
            <ChevronDown className="w-4 h-4 text-muted hidden sm:block" />
          </button>
        )}
      </div>
    </div>
  )
} 
