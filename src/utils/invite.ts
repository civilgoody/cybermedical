import { supabase } from "@/utils/supabase/client";

export async function inviteUser(email: string): Promise<void> {
  // Retrieve a valid access token from the current session.
  const { data: sessionData } = await supabase().auth.getSession();
  const token = sessionData.session?.access_token;


  const response = await fetch("/api/invite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // Pass the access token in the Authorization header.
      "Authorization": token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const { error } = await response.json();
    throw new Error(error || "Failed to invite user");
  }
  const data = await response.json();
} 

