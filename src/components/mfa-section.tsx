"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

export default function MFASection() {
  const [loading, setLoading] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [factorId, setFactorId] = useState<string>("");
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [verifyCode, setVerifyCode] = useState<string>(""); // For enabling MFA verification.
  const [disableCode, setDisableCode] = useState<string>(""); // For disabling MFA (re‑verification).
  const [mfaMessage, setMfaMessage] = useState<string>("");

  // Check MFA status on mount.
  useEffect(() => {
    async function checkMFA() {
      const { data, error } = await supabase().auth.mfa.listFactors();
      if (error) {
        console.error("Error listing MFA factors:", error.message);
      } else if (data?.totp && data.totp.length > 0) {
        setMfaEnabled(true);
      } else {
        setMfaEnabled(false);
      }
    }
    checkMFA();
  }, []);

  // Start MFA enrollment.
  const handleEnableMFA = async () => {
    setLoading(true);
    setMfaMessage("");
    const { data, error } = await supabase().auth.mfa.enroll({ factorType: "totp" });
    if (error) {
      setMfaMessage(`Error enrolling for MFA: ${error.message}`);
      setLoading(false);
      return;
    }
    setFactorId(data.id);
    setQrCode(data.totp.qr_code);
    setSecret(data.totp.secret);
    setLoading(false);
  };

  // Verify the code to complete MFA enrollment.
  const handleVerifyMFA = async () => {
    if (!factorId || !verifyCode) {
      setMfaMessage("Please enter the verification code.");
      return;
    }
    setLoading(true);
    setMfaMessage("");

    const challengeResponse = await supabase().auth.mfa.challenge({ factorId });
    if (challengeResponse.error) {
      setMfaMessage(`Error creating MFA challenge: ${challengeResponse.error.message}`);
      setLoading(false);
      return;
    }

    const challengeId = challengeResponse.data.id;
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
    // Reset the enrollment fields.
    setFactorId("");
    setQrCode("");
    setSecret("");
    setVerifyCode("");
    setLoading(false);
  };

  // Disable MFA after verifying a provided TOTP code.
  const handleDisableMFA = async () => {
    if (!disableCode) {
      setMfaMessage("Please enter your current TOTP code to disable MFA.");
      return;
    }
    setLoading(true);
    setMfaMessage("");

    // List the current MFA factors.
    const { data, error: listError } = await supabase().auth.mfa.listFactors();
    if (listError) {
      setMfaMessage(`Error listing MFA factors: ${listError.message}`);
      setLoading(false);
      return;
    }

    const totpFactor = data?.totp?.[0];
    if (!totpFactor) {
      setMfaMessage("No TOTP factor found.");
      setLoading(false);
      return;
    }
    const totpFactorId = totpFactor.id;

    // Validate that totpFactorId is a valid UUID.
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(totpFactorId)) {
      setMfaMessage("Invalid factor id. Cannot create challenge.");
      setLoading(false);
      return;
    }

    // Create a challenge for re‑verification.
    const challengeResponse = await supabase().auth.mfa.challenge({ factorId: totpFactorId });
    if (challengeResponse.error) {
      setMfaMessage(`Error creating MFA challenge: ${challengeResponse.error.message}`);
      setLoading(false);
      return;
    }

    const challengeId = challengeResponse.data.id;
    const verifyResponse = await supabase().auth.mfa.verify({
      factorId: totpFactorId,
      challengeId,
      code: disableCode,
    });

    if (verifyResponse.error) {
      setMfaMessage(`TOTP verification failed: ${verifyResponse.error.message}`);
      setLoading(false);
      return;
    }
        // Once verified, remove the MFA factor.
    const removeResponse = await supabase().auth.mfa.unenroll({ factorId: totpFactorId });
    if (removeResponse.error) {
      setMfaMessage(`Error disabling MFA: ${removeResponse.error.message}`);

      setLoading(false);
      return;
    }
    setMfaMessage("MFA disabled successfully.");
    setMfaEnabled(false);
    setDisableCode("");
    setLoading(false);
  };

  return (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">Multi-Factor Authentication (MFA)</h2>
      {loading && <p>Loading...</p>}
      {mfaMessage && <p>{mfaMessage}</p>}
      {mfaEnabled ? (
        <div>
          <p>MFA is enabled on your account.</p>
          <div className="flex items-center gap-2 mt-4">
            <Input
              value={disableCode}
              onChange={(e) => setDisableCode(e.target.value)}
              placeholder="Enter TOTP code to disable MFA"
            />
            <Button onClick={handleDisableMFA} disabled={loading}>
              Disable MFA
            </Button>
          </div>
        </div>
      ) : (
        <div>
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
  );
} 
