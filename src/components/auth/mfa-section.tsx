"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Copy, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useMFA } from "@/hooks/use-mfa";
import { toast } from "sonner";

export default function MFASection() {
  const [verifyCode, setVerifyCode] = useState("");
  const [disableCode, setDisableCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [enrollmentData, setEnrollmentData] = useState<{
    factorId: string;
    qrCode: string;
    secret: string;
  } | null>(null);

  const {
    isMFAEnabled,
    activeFactor,
    isLoadingFactors,
    enrollMFA,
    verifyMFA,
    unenrollMFA,
    isEnrolling,
    isVerifying,
    isUnenrolling,
    enrollError,
    verifyError,
    unenrollError,
  } = useMFA();

  // Copy secret to clipboard
  const handleCopySecret = async () => {
    if (!enrollmentData?.secret) return;
    await navigator.clipboard.writeText(enrollmentData.secret);
    setCopied(true);
    toast.success("Secret copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  // Start MFA enrollment
  const handleEnableMFA = async () => {
    try {
      const data = await enrollMFA();
      setEnrollmentData({
        factorId: data.id,
        qrCode: data.totp.qr_code,
        secret: data.totp.secret,
      });
      toast.success("MFA enrollment started. Scan the QR code with your authenticator app.");
    } catch (error: any) {
      toast.error("Failed to start MFA enrollment", {
        description: error.message,
      });
    }
  };

  // Verify MFA enrollment
  const handleVerifyMFA = async () => {
    if (!enrollmentData?.factorId || !verifyCode) {
      toast.error("Please enter the verification code");
      return;
    }

    try {
      await verifyMFA({ factorId: enrollmentData.factorId, code: verifyCode });
      toast.success("MFA enabled successfully!");
      setEnrollmentData(null);
      setVerifyCode("");
    } catch (error: any) {
      toast.error("MFA verification failed", {
        description: error.message,
      });
    }
  };

  // Disable MFA
  const handleDisableMFA = async () => {
    if (!disableCode) {
      toast.error("Please enter your current TOTP code");
      return;
    }

    if (!activeFactor?.id) {
      toast.error("No MFA factor found");
      return;
    }

    try {
      await unenrollMFA({ factorId: activeFactor.id, code: disableCode });
      toast.success("MFA disabled successfully");
      setDisableCode("");
    } catch (error: any) {
      toast.error("Failed to disable MFA", {
        description: error.message,
      });
    }
  };

  if (isLoadingFactors) {
  return (
      <Card className="bg-[#141414] border-[#1F1F1F] p-6 rounded-xl">
        <div className="flex items-center justify-center py-8">
          <div className="w-6 h-6 border-t-2 border-b-2 border-primary rounded-full animate-spin" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-[#141414] border-[#1F1F1F] p-6 rounded-xl">
      <h2 className="text-xl font-semibold text-white mb-4">Multi-Factor Authentication (MFA)</h2>
      
      {isMFAEnabled ? (
        <div className="space-y-4">
          <p className="text-[#999999]">MFA is currently enabled on your account.</p>
          <div className="flex items-center gap-3">
            <Input
              value={disableCode}
              onChange={(e) => setDisableCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isUnenrolling && disableCode && handleDisableMFA()}
              placeholder="Enter TOTP code to disable MFA"
              className="bg-[#1A1A1A] border-[#333333] text-white placeholder:text-[#666666] focus-visible:ring-primary"
              disabled={isUnenrolling}
            />
            <Button
              onClick={handleDisableMFA}
              disabled={isUnenrolling || !disableCode}
              variant="destructive"
              className="whitespace-nowrap hover:bg-red-600"
            >
              {isUnenrolling ? "Disabling..." : "Disable MFA"}
            </Button>
          </div>
        </div>
      ) : enrollmentData ? (
        <div className="space-y-6">
          <p className="text-[#999999]">Scan the QR code with your authenticator app, then enter the verification code.</p>
          
          {/* QR Code */}
          <div className="flex justify-center">
            <div className="bg-white p-4 rounded-lg">
              <img 
                src={enrollmentData.qrCode} 
                alt="MFA QR Code" 
                className="w-48 h-48"
              />
            </div>
              </div>
          
          {/* Secret */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#cccccc]">
              Manual Entry Secret
            </label>
            <div className="flex gap-2">
              <Input
                value={enrollmentData.secret}
                readOnly
                className="bg-[#1A1A1A] border-[#333333] text-white font-mono text-sm"
              />
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                      onClick={handleCopySecret}
                      variant="outline"
                        size="icon"
                      className="bg-[#1A1A1A] border-[#333333] hover:bg-[#242424]"
                      >
                      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                    <p>Copy secret to clipboard</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
          </div>
          
          {/* Verification */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#cccccc]">
              Verification Code
            </label>
            <div className="flex gap-3">
                <Input
                  value={verifyCode}
                  onChange={(e) => setVerifyCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !isVerifying && verifyCode && handleVerifyMFA()}
                placeholder="Enter 6-digit code from your app"
                className="bg-[#1A1A1A] border-[#333333] text-white placeholder:text-[#666666] focus-visible:ring-primary"
                disabled={isVerifying}
                maxLength={6}
                />
              <Button
                onClick={handleVerifyMFA}
                disabled={isVerifying || !verifyCode}
                className="bg-primary hover:bg-primary/90 whitespace-nowrap"
              >
                {isVerifying ? "Verifying..." : "Verify & Enable"}
                </Button>
              </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <p className="text-[#999999]">
            Add an extra layer of security to your account with Two-Factor Authentication.
          </p>
          <Button
            onClick={handleEnableMFA}
            disabled={isEnrolling}
            className="bg-primary hover:bg-primary/90"
          >
            {isEnrolling ? "Setting up..." : "Enable MFA"}
          </Button>
        </div>
      )}
    </Card>
  );
} 
