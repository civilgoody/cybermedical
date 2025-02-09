"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inviteUser } from "@/utils/invite";
import { supabase } from "@/utils/supabase/client";
import { Card } from "@/components/ui/card";

export default function InviteSection() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleInvite = async () => {
    setMessage("");

    if (!inviteEmail) {
      setMessage("Please enter an email address.");
      return;
    }

    if (!totpCode) {
      setMessage("Please enter your current TOTP code.");
      return;
    }

    setIsLoading(true);
    try {
      // List the user's MFA factors.
      const { data: mfaData, error: mfaError } = await supabase().auth.mfa.listFactors();
      if (mfaError) {
        setMessage("Error retrieving MFA factors: " + mfaError.message);
        return;
      }

      const totpFactor = mfaData?.totp?.[0];
      if (!totpFactor) {
        setMessage("No TOTP factor found. Please enable MFA first.");
        return;
      }
      const totpFactorId = totpFactor.id;

      // Create a challenge for a fresh TOTP verification.
      const challengeResponse = await supabase().auth.mfa.challenge({ factorId: totpFactorId });
      if (challengeResponse.error) {
        setMessage("Error creating MFA challenge: " + challengeResponse.error.message);
        return;
      }

      const challengeId = challengeResponse.data.id;

      // Verify the provided TOTP code.
      const verifyResponse = await supabase().auth.mfa.verify({
        factorId: totpFactorId,
        challengeId,
        code: totpCode,
      });

      if (verifyResponse.error) {
        setMessage("TOTP verification failed: " + verifyResponse.error.message);
        return;
      }

      // TOTP is valid so proceed to send the invite.
      await inviteUser(inviteEmail);
      setMessage(`Invitation sent to ${inviteEmail}`);
      setInviteEmail("");
      setTotpCode("");
    } catch (err: any) {
      setMessage("Error: " + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-[#141414] border-[#1F1F1F] p-6 rounded-xl mb-6">
      <h2 className="text-xl font-semibold text-white mb-4">
        Send Admin Invitation
      </h2>
      <p className="text-[#666666] mb-4">
        Invite new administrators to join your organization. 2FA verification required.
      </p>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#666666] mb-2">
            Admin Email
          </label>
          <Input
            type="email"
            placeholder="Enter admin email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            className="bg-[#1A1A1A] border-[#1F1F1F] text-white placeholder:text-[#666666] focus-visible:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#666666] mb-2">
            Your TOTP Code
          </label>
          <Input
            type="text"
            placeholder="Enter current TOTP code"
            value={totpCode}
            onChange={(e) => setTotpCode(e.target.value)}
            className="bg-[#1A1A1A] border-[#1F1F1F] text-white placeholder:text-[#666666] focus-visible:ring-primary"
          />
        </div>
        <Button 
          onClick={handleInvite}
          disabled={isLoading}
          className="w-full bg-primary hover:bg-primary/90 disabled:cursor-not-allowed"
        >
          {isLoading ? "Sending Invite..." : "Send Invite"}
        </Button>
        {message && (
          <p
            className={`p-3 rounded-lg ${
              message.includes("Error") || message.includes("failed")
                ? "bg-red-950/50 text-red-400 border border-red-900"
                : "bg-green-950/50 text-green-400 border border-green-900"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </Card>
  );
}
