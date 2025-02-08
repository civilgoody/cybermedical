import { ChevronDown, LogOut } from "lucide-react"
import Image from "next/image"
import { useState, useEffect } from "react"
import Link from "next/link"
import { NavMenu } from "./nav-menu"
import { UtilityButtons } from "./utility-buttons"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "@/utils/supabase/client"
import { Session, AuthChangeEvent } from "@supabase/supabase-js"

export function Header() {
  const [showDropdown, setShowDropdown] = useState(false)
  const [session, setSession] = useState<Session | null>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function getSession() {
      const { data: { session: currentSession } } = await supabase().auth.getSession()
      setSession(currentSession)
      // Do not trigger router.push here—instead, let the pages or middleware handle redirection.
    }
    getSession()

    const { data: { subscription } } = supabase().auth.onAuthStateChange(
      (event: AuthChangeEvent, session: Session | null) => {
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



  return (
    <div className="flex items-center justify-between px-4 h-16 mt-4 bg-black">
      {/* Logo */}
      <div className="flex-shrink-0">
        <Link href="/" className="p-2 rounded-full border border-purple-500/20">
          <Image src="/cyber-logo.png" alt="Cyber Logo" width={48} height={48} />
        </Link>
      </div>

      {/* Center Navigation - Only show when signed in */}
      {session && (
        <div className="flex-1 flex justify-center">
          <NavMenu />
        </div>
      )}

      <div className="flex items-center gap-4">
        {/* Utility Buttons - Only show when signed in */}
        {session && <UtilityButtons />}

        {/* Profile/Region Section */}
        <div className="relative">
          {session ? (
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 bg-[#1A1A1A] rounded-full px-3 py-2"
            >
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
                  {session.user?.email?.[0].toUpperCase()}
                </div>
              )}
              <div className="flex items-center gap-2">
                <div>
                  <div className="text-sm font-medium text-foreground text-ellipsis overflow-hidden whitespace-nowrap max-w-24">
                    {session.user?.user_metadata?.name || session.user?.email?.split("@")[0]}
                  </div>
                  <div className="text-xs text-muted text-ellipsis overflow-hidden whitespace-nowrap max-w-28">
                    {session.user?.email}
                  </div>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-muted transition-transform ${showDropdown ? "rotate-180" : ""}`}
                />
              </div>
            </button>
          ) : (
            <button className="flex items-center gap-2 bg-[#1A1A1A] rounded-full px-4 py-2">
              <Image src="/uk-flag.png" alt="UK Flag" width={24} height={24} />
              <span className="text-sm text-foreground">United Kingdom</span>
              <ChevronDown className="w-4 h-4 text-muted" />
            </button>
          )}

          {showDropdown && session && (
            <div className="absolute right-0 mt-2 w-48 bg-[#1A1A1A] rounded-md shadow-lg py-1 border border-border">
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-foreground transition-colors hover:text-primary"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 
