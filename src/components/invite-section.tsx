"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inviteUser } from "@/utils/invite";
import { supabase } from "@/utils/supabase/client";

export default function InviteSection() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [totpCode, setTotpCode] = useState("");
  const [message, setMessage] = useState("");

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
    }
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">
        Send Admin Invitation (Requires 2FA Verification)
      </h2>
      <div className="flex flex-col gap-2">
        <Input
          type="email"
          placeholder="Enter admin email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
        />
        <Input
          type="text"
          placeholder="Enter current TOTP code"
          value={totpCode}
          onChange={(e) => setTotpCode(e.target.value)}
        />
        <Button onClick={handleInvite}>Send Invite</Button>
        {message && (
          <p className="mt-2 font-mono bg-gray-800 p-2 rounded">{message}</p>
        )}
      </div>
    </div>
  );
} 
