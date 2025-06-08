"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/utils/supabase/client";
import { useProfile } from "@/context/ProfileContext";

// Shadcn UI (Radix-based) components
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// Updated schema with maximum length limits on all fields.
const profileFormSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .max(50, "First name must be 50 characters or less"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .max(50, "Last name must be 50 characters or less"),
  phone: z.string().max(20, "Phone number must be 20 characters or less").optional(),
  bio: z.string().max(160, "Bio must be 160 characters or less").optional(),
  country: z.string().max(50, "Country must be 50 characters or less").optional(),
  city: z.string().max(50, "City must be 50 characters or less").optional(),
  post_code: z.string().max(15, "Post Code must be 15 characters or less").optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

type ProfileEditModalProps = {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function ProfileEditModal({
  open: openProp,
  onOpenChange: onOpenChangeProp,
}: ProfileEditModalProps) {
  const { profile } = useProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      phone: "",
      bio: "",
      country: "",
      city: "",
      post_code: "",
    },
  });

  // When the global profile changes, update the form values.
  useEffect(() => {
    if (profile) {
      reset({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        country: profile.country || "",
        city: profile.city || "",
        post_code: profile.post_code || "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: ProfileFormValues) => {
    const { data: updatedProfile, error } = await supabase()
      .from("profiles")
      .update(data)
      .eq("id", profile?.id)
      .select("*")
      .single();

    if (error) {
      console.error("Error updating profile:", error);
    } else {
      // Update the form with the newly returned data and refresh the global profile.
      reset(updatedProfile);
      setDialogOpen(false);
    }
  };

  // Allow external control over open state, or fall back to internal state.
  const [internalOpen, setInternalOpen] = useState(false);
  const dialogOpen = openProp !== undefined ? openProp : internalOpen;
  const setDialogOpen = onOpenChangeProp !== undefined
    ? onOpenChangeProp
    : setInternalOpen;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="bg-[#141414] border border-[#1F1F1F] text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-white">Edit Profile</DialogTitle>
          <DialogDescription className="text-[#666666]">
            Update your profile details. Changes will apply after saving.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-6 py-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-2">
                First Name
              </label>
              <Input 
                {...register("first_name")} 
                placeholder="First Name" 
                className="bg-[#1A1A1A] border-[#1F1F1F] text-white placeholder:text-[#666666] focus-visible:ring-primary"
              />
              {errors.first_name && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.first_name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-2">
                Last Name
              </label>
              <Input 
                {...register("last_name")} 
                placeholder="Last Name" 
                className="bg-[#1A1A1A] border-[#1F1F1F] text-white placeholder:text-[#666666] focus-visible:ring-primary"
              />
              {errors.last_name && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#666666] mb-2">
              Phone
            </label>
            <Input 
              {...register("phone")} 
              placeholder="Phone Number" 
              className="bg-[#1A1A1A] border-[#1F1F1F] text-white placeholder:text-[#666666] focus-visible:ring-primary"
            />
            {errors.phone && (
              <p className="text-red-400 text-sm mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-[#666666] mb-2">
              Bio
            </label>
            <Textarea 
              {...register("bio")} 
              placeholder="Your bio" 
              className="bg-[#1A1A1A] border-[#1F1F1F] text-white placeholder:text-[#666666] focus-visible:ring-primary min-h-[100px]"
            />
            {errors.bio && (
              <p className="text-red-400 text-sm mt-1">{errors.bio.message}</p>
            )}
          </div>
          <div className="grid grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-2">
                Country
              </label>
              <Input 
                {...register("country")} 
                placeholder="Country" 
                className="bg-[#1A1A1A] border-[#1F1F1F] text-white placeholder:text-[#666666] focus-visible:ring-primary"
              />
              {errors.country && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.country.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-2">
                City
              </label>
              <Input 
                {...register("city")} 
                placeholder="City" 
                className="bg-[#1A1A1A] border-[#1F1F1F] text-white placeholder:text-[#666666] focus-visible:ring-primary"
              />
              {errors.city && (
                <p className="text-red-400 text-sm mt-1">{errors.city.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-[#666666] mb-2">
                Post Code
              </label>
              <Input 
                {...register("post_code")} 
                placeholder="Post Code" 
                className="bg-[#1A1A1A] border-[#1F1F1F] text-white placeholder:text-[#666666] focus-visible:ring-primary"
              />
              {errors.post_code && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.post_code.message}
                </p>
              )}
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <DialogClose asChild>
              <Button 
                variant="outline" 
                className="bg-transparent border-[#1F1F1F] text-white hover:bg-[#1A1A1A] hover:text-white"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button 
              type="submit"
              className="bg-primary hover:bg-primary/90 text-white"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
