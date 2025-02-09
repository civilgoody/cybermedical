import { supabase } from "@/utils/supabase/client";

export async function inviteUser(email: string): Promise<void> {
  const response = await fetch("/api/invite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error || "Failed to invite user");
  }

  const data = await response.json();
  console.log("Invitation sent:", data);
} 

