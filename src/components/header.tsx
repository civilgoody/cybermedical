import { ChevronDown, LogOut } from "lucide-react"
import Image from "next/image"
import { useSession, signOut } from "next-auth/react"
import { useState } from "react"
import Link from "next/link"
import { NavMenu } from "./nav-menu"
import { UtilityButtons } from "./utility-buttons"

export function Header() {
  const [showDropdown, setShowDropdown] = useState(false);
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/auth/signin' });
  };

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
              {session.user?.image ? (
                <Image
                  src={session.user.image}
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
                  <div className="text-sm font-medium text-foreground">
                    {session.user?.name || session.user?.email?.split('@')[0]}
                  </div>
                  <div className="text-xs text-muted">{session.user?.email}</div>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted transition-transform ${showDropdown ? 'rotate-180' : ''}`} />
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
                className="flex items-center gap-2 w-full px-4 py-2 text-sm text-foreground hover:bg-background transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 
