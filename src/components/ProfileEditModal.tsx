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

// Define a schema for your profile form.
const profileFormSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
  bio: z.string().optional(),
  country: z.string().optional(),
  city: z.string().optional(),
  post_code: z.string().optional(),
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
  const { profile, reloadProfile } = useProfile();

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
    const { error } = await supabase()
      .from("profiles")
      .update(data)
      .eq("id", profile?.id);

    if (error) {
      console.error("Error updating profile:", error);
    } else {
      await reloadProfile();
      // Close the modal after a successful save.
      setDialogOpen(false);
    }
  };

  // Use internal state if external props are not provided.
  const [internalOpen, setInternalOpen] = useState(false);
  const dialogOpen = openProp !== undefined ? openProp : internalOpen;
  const setDialogOpen = onOpenChangeProp !== undefined
    ? onOpenChangeProp
    : setInternalOpen;

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your profile details. Changes will apply after saving.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground">
                First Name
              </label>
              <Input {...register("first_name")} placeholder="First Name" />
              {errors.first_name && (
                <p className="text-red-500 text-sm">
                  {errors.first_name.message}
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Last Name
              </label>
              <Input {...register("last_name")} placeholder="Last Name" />
              {errors.last_name && (
                <p className="text-red-500 text-sm">
                  {errors.last_name.message}
                </p>
              )}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">
              Phone
            </label>
            <Input {...register("phone")} placeholder="Phone Number" />
          </div>
          <div>
            <label className="block text-sm font-medium text-foreground">
              Bio
            </label>
            <Textarea {...register("bio")} placeholder="Your bio" />
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground">
                Country
              </label>
              <Input {...register("country")} placeholder="Country" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                City
              </label>
              <Input {...register("city")} placeholder="City" />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground">
                Post Code
              </label>
              <Input {...register("post_code")} placeholder="Post Code" />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
