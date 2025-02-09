"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { v4 as uuidv4 } from "uuid";
import { inviteUser } from "@/utils/invite";

export default function SettingsPage() {
  const router = useRouter();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  
  // MFA state management
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [factorId, setFactorId] = useState<string>("");
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>(""); // For manual entry fallback.
  const [verifyCode, setVerifyCode] = useState<string>("");
  const [mfaMessage, setMfaMessage] = useState<string>("");

  // Invite Generation state
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState<string>("");

  // On component mount, check for an active session.
  useEffect(() => {
    async function fetchSession() {
      const {
        data: { session },
      } = await supabase().auth.getSession();
      if (!session) {
        router.push("/");
      } else {
        setSession(session);
      }
    }
    fetchSession();
  }, [router]);

  // On session change, list enrolled MFA factors to determine if TOTP is enabled.
  useEffect(() => {
    async function checkMFA() {
      if (!session) return;
      const { data, error } = await supabase().auth.mfa.listFactors();
      console.log(data);
      if (error) {
        console.error("Error listing MFA factors:", error.message);
      } else if (data?.totp && data.totp.length > 0) {
        setMfaEnabled(true);
      } else {
        setMfaEnabled(false);
      }
    }
    checkMFA();
  }, [session]);

  // Start the enrollment process for TOTP MFA.
  const handleEnableMFA = async () => {
    setLoading(true);
    setMfaMessage("");
    const { data, error } = await supabase().auth.mfa.enroll({ factorType: "totp" });
    if (error) {
      setMfaMessage(`Error enrolling for MFA: ${error.message}`);
      setLoading(false);
      return;
    }
    // Save the factor's ID, the QR code, and the secret text.
    setFactorId(data.id);
    setQrCode(data.totp.qr_code); // Data URL for the QR code.
    setSecret(data.totp.secret); // Plain text secret for manual entry.
    setLoading(false);
  };

  // Verify the MFA code entered by the user.
  const handleVerifyMFA = async () => {
    if (!factorId || !verifyCode) {
      setMfaMessage("Please enter the verification code.");
      return;
    }
    setLoading(true);
    setMfaMessage("");
    
    // Create a challenge for the enrolled factor.
    const challengeResponse = await supabase().auth.mfa.challenge({ factorId });
    if (challengeResponse.error) {
      setMfaMessage(`Error creating MFA challenge: ${challengeResponse.error.message}`);
      setLoading(false);
      return;
    }
    const challengeId = challengeResponse.data.id;
    
    // Verify the challenge using the code provided by the user.
    const verifyResponse = await supabase().auth.mfa.verify({
      factorId,
      challengeId,
      code: verifyCode,
    });
    if (verifyResponse.error) {
      setMfaMessage(`Error verifying MFA: ${verifyResponse.error.message}`);
      setLoading(false);
      return;
    }
    setMfaMessage("MFA enabled successfully!");
    setMfaEnabled(true);
    // Clear temporary enrollment state.
    setFactorId("");
    setQrCode("");
    setSecret("");
    setVerifyCode("");
    setLoading(false);
  };

  // Disable the currently enabled TOTP MFA.
  const handleDisableMFA = async () => {
    setLoading(true);
    setMfaMessage("");
    // List enrolled factors so we can remove the TOTP factor.
    const { data, error } = await supabase().auth.mfa.listFactors();
    if (error) {
      setMfaMessage(`Error listing MFA factors: ${error.message}`);
      setLoading(false);
      return;
    }
    if (data?.totp && data.totp.length > 0) {
      const totpFactorId = data.totp[0].id;
      const removeResponse = await supabase().auth.mfa.unenroll({ factorId: totpFactorId });
      if (removeResponse.error) {
        setMfaMessage(`Error disabling MFA: ${removeResponse.error.message}`);
        setLoading(false);
        return;
      }
      setMfaMessage("MFA disabled successfully.");
      setMfaEnabled(false);
    } else {
      setMfaMessage("No MFA factor found.");
    }
    setLoading(false);
  };

  // --- Invite Generation Handlers ---
  const handleInvite = async () => {
    if (!inviteEmail) return;
    try {
      await inviteUser(inviteEmail);
      setInviteMessage(`Invitation sent to ${inviteEmail}`);
      setInviteEmail("");
    } catch (error: any) {
      setInviteMessage(`Error sending invite: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-black p-8 text-white">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Multi-Factor Authentication (MFA)</h2>
        {loading && <p>Loading...</p>}
        {mfaMessage && <p>{mfaMessage}</p>}
        {mfaEnabled ? (
          <div>
            <p>MFA is enabled on your account.</p>
            <Button onClick={handleDisableMFA} disabled={loading}>
              Disable MFA
            </Button>
          </div>
        ) : (
          <div>
            {/* If no QR code has been generated yet, show the enrollment button */}
            {!qrCode ? (
              <Button onClick={handleEnableMFA} disabled={loading}>
                Enable MFA (TOTP)
              </Button>
            ) : (
              <Card className="p-4 my-4">
                <p className="mb-2">Scan the QR code with your authenticator app:</p>
                <img src={qrCode} alt="MFA QR Code" className="w-48 h-48 mb-4" />
                <p className="mb-2">
                  If you're unable to scan the QR code, manually enter this secret:
                </p>
                <p className="font-mono bg-gray-800 p-2 rounded">{secret}</p>
                <div className="flex items-center gap-2 mt-4">
                  <Input
                    value={verifyCode}
                    onChange={(e) => setVerifyCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                  />
                  <Button onClick={handleVerifyMFA} disabled={loading}>
                    Verify and Enable MFA
                  </Button>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* --- Invite Generation Section --- */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Send Admin Invitation</h2>
        <div className="flex flex-col gap-2">
          <Input
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="Enter admin email"
          />
          <Button onClick={handleInvite}>Send Invite</Button>
          {inviteMessage && (
            <p className="mt-2 font-mono bg-gray-800 p-2 rounded">{inviteMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
} 
