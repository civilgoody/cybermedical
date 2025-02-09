"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inviteUser } from "@/utils/invite";

export default function InviteSection() {
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");

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
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-2">Send Admin Invitation</h2>
      <div className="flex flex-col gap-2">
        <Input
          type="email"
          placeholder="Enter admin email"
          value={inviteEmail}
          onChange={(e) => setInviteEmail(e.target.value)}
        />
        <Button onClick={handleInvite}>Send Invite</Button>
        {inviteMessage && (
          <p className="mt-2 font-mono bg-gray-800 p-2 rounded">{inviteMessage}</p>
        )}
      </div>
    </div>
  );
} 
