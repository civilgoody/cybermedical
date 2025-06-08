import { ChevronDown, LogOut } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import Link from "next/link"
import { NavMenu } from "./nav-menu"
import { UtilityButtons } from "../shared/utility-buttons"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/utils/supabase/client"
import { Session, AuthChangeEvent } from "@supabase/supabase-js"
import { useProfile } from "@/context/ProfileContext"

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
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function getSession() {
      const {
        data: { session: currentSession },
      } = await supabase().auth.getSession()
      setSession(currentSession)
    }
    getSession()

    const {
      data: { subscription },
    } = supabase().auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignOut = async () => {
    const { error } = await supabase().auth.signOut()
    if (error) {
      console.error("Error signing out:", error)
      return
    }
    router.replace("/")
  }

  const { profileLoaded, profile } = useProfile()

  return (
    <div className="flex items-center justify-between px-4 h-16 mt-4 bg-black">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Link href="/" className="p-2 rounded-full border border-purple-500/20">
          <Image src="/cyber-logo.png" alt="Cyber Logo" width={48} height={48} />
        </Link>
      </div>

      {/* Center Navigation – Only show when signed in */}
      {session && profileLoaded && (
        <div className="flex-1 flex justify-center">
          <NavMenu />
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Utility Buttons – Only show when signed in */}
        {session && profileLoaded && <UtilityButtons />}

        {/* Profile/Region Section */}
        {session && profileLoaded ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 bg-[#1A1A1A] rounded-full px-3 py-2">
                {session.user?.user_metadata?.avatar_url ? (
                  <Image
                    src={session.user.user_metadata.avatar_url}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary text-foreground flex items-center justify-center">
                    {session?.user?.email?.[0].toUpperCase()}
                  </div>
                )}
                <div className="flex-col items-start md:flex">
                  <span className="text-sm font-medium text-foreground truncate max-w-[110px]">
                    {profile
                      ? `${profile.first_name} ${profile.last_name}`
                      : session.user?.email?.split("@")[0]}
                  </span>
                  <span className="text-xs text-muted truncate max-w-[110px]">
                    {session.user?.email}
                  </span>
                </div>
                <ChevronDown className="w-4 h-4 text-muted" />
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
          <button className="flex items-center gap-2 bg-[#1A1A1A] rounded-full px-4 py-2">
            <Image src="/uk-flag.png" alt="UK Flag" width={24} height={24} />
            <span className="text-sm text-foreground">United Kingdom</span>
            <ChevronDown className="w-4 h-4 text-muted" />
          </button>
        )}
      </div>
    </div>
  )
} 
