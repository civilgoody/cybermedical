"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export default function MFASection() {
  const [loading, setLoading] = useState(false);
  const [mfaEnabled, setMfaEnabled] = useState(false);
  const [factorId, setFactorId] = useState<string>("");
  const [qrCode, setQrCode] = useState<string>("");
  const [secret, setSecret] = useState<string>("");
  const [verifyCode, setVerifyCode] = useState<string>(""); // For enabling MFA verification.
  const [disableCode, setDisableCode] = useState<string>(""); // For disabling MFA (re‑verification).
  const [mfaMessage, setMfaMessage] = useState<string>("");
  const [copied, setCopied] = useState(false);

  // New: Copy the secret to the clipboard with visual feedback
  const handleCopySecret = async () => {
    await navigator.clipboard.writeText(secret);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
    <Card className="bg-[#141414] border-[#1F1F1F] p-6 rounded-xl mb-6">
      <h2 className="text-xl font-semibold text-white mb-4">Multi-Factor Authentication (MFA)</h2>
      {loading && (
        <div className="flex justify-center">
          <div className="w-6 h-6 border-t-2 border-b-2 border-primary rounded-full animate-spin" />
        </div>
      )}
      {mfaMessage && (
        <p
          className={`mb-4 p-3 rounded-lg ${
            mfaMessage.includes("Error") || mfaMessage.includes("failed")
              ? "bg-red-950/50 text-red-400 border border-red-900"
              : "bg-green-950/50 text-green-400 border border-green-900"
          }`}
        >
          {mfaMessage}
        </p>
      )}
      {mfaEnabled ? (
        <div>
          <p className="text-[#666666] mb-4">MFA is currently enabled on your account.</p>
          <div className="flex items-center gap-3">
            <Input
              value={disableCode}
              onChange={(e) => setDisableCode(e.target.value)}
              placeholder="Enter TOTP code to disable MFA"
              className="bg-[#1A1A1A] border-[#1F1F1F] text-white placeholder:text-[#666666] focus-visible:ring-primary"
            />
            <Button
              onClick={handleDisableMFA}
              disabled={loading}
              variant="destructive"
              className="whitespace-nowrap hover:bg-red-600"
            >
              Disable MFA
            </Button>
          </div>
        </div>
      ) : (
        <div>
          {!qrCode ? (
            <div>
              <p className="text-[#666666] mb-4">
                Enhance your account security by enabling Multi-Factor Authentication.
              </p>
              <Button onClick={handleEnableMFA} disabled={loading} className="bg-primary hover:bg-primary/90">
                Enable MFA (TOTP)
              </Button>
            </div>
          ) : (
            <Card className="bg-[#1A1A1A] border-[#1F1F1F] p-6 rounded-lg">
              <p className="text-white mb-4">Scan the QR code with your authenticator app:</p>
              <div className="bg-white p-4 rounded-lg w-fit mb-6">
                <img src={qrCode} alt="MFA QR Code" className="w-48 h-48" />
              </div>
              <p className="text-white mb-2">
                If you're unable to scan the QR code, manually enter this secret:
              </p>
              <div className="flex items-center gap-2 mb-6">
                <code className="flex-1 font-mono bg-[#141414] p-3 rounded-lg text-primary">
                  {secret}
                </code>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        className="bg-[#141414] border-[#1F1F1F] hover:bg-[#1A1A1A] hover:text-primary"
                        onClick={handleCopySecret}
                      >
                        {copied ? (
                          <Check className="h-4 w-4 text-green-400" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{copied ? 'Copied!' : 'Copy secret'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex items-center gap-3">
                <Input
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  placeholder="Enter 6-digit code"
                  className="bg-[#141414] border-[#1F1F1F] text-white placeholder:text-[#666666] focus-visible:ring-primary"
                />
                <Button onClick={handleVerifyMFA} disabled={loading} className="bg-primary hover:bg-primary/90 whitespace-nowrap">
                  Verify & Enable
                </Button>
              </div>
            </Card>
          )}
        </div>
      )}
    </Card>
  );
} 
