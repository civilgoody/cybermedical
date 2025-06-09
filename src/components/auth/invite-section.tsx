"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inviteUser } from "@/utils/invite";
import { Card } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useMFA } from "@/hooks/use-mfa";
import { toast } from "sonner";

export default function InviteSection() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { isMFAEnabled, activeFactor, isLoadingFactors, verifyMFA } = useMFA();

  const handleInvite = async () => {
    if (!inviteEmail) {
      toast.error("Please enter an email address");
      return;
    }

    if (!totpCode) {
      toast.error("Please enter your current TOTP code");
      return;
    }

    if (!isMFAEnabled || !activeFactor) {
      toast.error("MFA must be enabled to send invites");
      return;
    }

    setIsLoading(true);
    try {
      // First verify the MFA code
      await verifyMFA({ factorId: activeFactor.id, code: totpCode });
      
      // If verification succeeds, send the invite
      const response = await fetch("/api/invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${(await (await import("@/utils/supabase/client")).supabase().auth.getSession()).data.session?.access_token || ""}`,
        },
        body: JSON.stringify({ email: inviteEmail }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.isExistingUser) {
          toast.error("User Already Exists", {
            description: result.suggestion,
          });
        } else if (result.suggestion) {
          toast.error("Invitation Failed", {
            description: result.suggestion,
          });
        } else {
          toast.error("Failed to send invitation", {
            description: result.error || "Please try again.",
          });
        }
        return;
      }

      toast.success("Invitation Sent!", {
        description: result.message,
      });
      setInviteEmail("");
      setTotpCode("");
    } catch (err: any) {
      if (err.message.includes('Invalid TOTP code') || err.message.includes('verification')) {
        toast.error("Invalid TOTP code", {
          description: "Please check your authenticator app and try again.",
        });
      } else {
        toast.error("Failed to send invitation", {
          description: "Network error. Please check your connection and try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = !isMFAEnabled || isLoadingFactors;

  return (
    <Card className="bg-[#141414] border-[#1F1F1F] p-6 rounded-xl">
      <h2 className="text-xl font-semibold text-white mb-4">
        Send Admin Invitation
      </h2>
      <p className="text-[#999999] mb-6">
        Invite new administrators to join your organization. They will receive an email to set up their account and password.
      </p>
      
      {!isMFAEnabled && !isLoadingFactors && (
        <div className="mb-6 p-4 bg-amber-950/20 border border-amber-900/30 rounded-lg">
          <p className="text-amber-400 text-sm">
            🔒 You must enable MFA before sending admin invitations for security purposes.
          </p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#cccccc] mb-2">
            Admin Email
          </label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
          <Input
            type="email"
            placeholder="Enter admin email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && !isDisabled && inviteEmail && totpCode && handleInvite()}
                    className="bg-[#1A1A1A] border-[#333333] text-white placeholder:text-[#666666] focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isDisabled}
                  />
                </div>
              </TooltipTrigger>
              {isDisabled && (
                <TooltipContent>
                  <p>Enable MFA first to send invitations</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-[#cccccc] mb-2">
            Your TOTP Code
          </label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
          <Input
            type="text"
            placeholder="Enter current TOTP code"
            value={totpCode}
            onChange={(e) => setTotpCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !isLoading && !isDisabled && inviteEmail && totpCode && handleInvite()}
                    className="bg-[#1A1A1A] border-[#333333] text-white placeholder:text-[#666666] focus-visible:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isDisabled}
                    maxLength={6}
                  />
                </div>
              </TooltipTrigger>
              {isDisabled && (
                <TooltipContent>
                  <p>Enable MFA first to send invitations</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        </div>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
        <Button 
          onClick={handleInvite}
                  disabled={isLoading || isDisabled || !inviteEmail || !totpCode}
          className="w-full bg-primary hover:bg-primary/90 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending Invite..." : "Send Invite"}
        </Button>
              </div>
            </TooltipTrigger>
            {isDisabled && (
              <TooltipContent>
                <p>Enable MFA first to send invitations</p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      </div>
    </Card>
  );
}
