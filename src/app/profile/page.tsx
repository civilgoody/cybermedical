'use client';

import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { useProfile } from '@/hooks/use-profile';
import { SkeletonProfile } from "@/components/ui/skeleton";
import ProfileEditModal from "@/components/auth/profile-edit-modal";

export default function ProfilePage() {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const { user, profile, isLoading } = useProfile();

  if (isLoading || !user) {
    return <SkeletonProfile />;
  }

  // If profile hasn't loaded yet, show skeleton
  if (!profile) {
    return <SkeletonProfile />;
  }

  return (
    <div className="min-h-screen bg-black p-4 sm:p-8 lg:px-32">
      <h1 className="text-xl sm:text-2xl font-bold text-white mb-6 sm:mb-8">My Profile</h1>

      {/* Profile Header Card */}
      <Card className="bg-[#141414] border-[#1F1F1F] p-4 sm:p-6 rounded-xl mb-6">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {user.user_metadata?.avatar_url ? (
              <Image
                src={user.user_metadata.avatar_url}
                alt="Profile"
                width={64}
                height={64}
                className="rounded-full"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary text-foreground flex items-center justify-center text-xl">
                {user.email?.[0].toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                {profile.first_name} {profile.last_name}
              </h2>
              <p className="text-sm sm:text-base text-[#666666]">Admin</p>
              <p className="text-sm sm:text-base text-[#666666]">
                {(profile.city || profile.country)
                  ? (profile.city && profile.country
                      ? `${profile.city}, ${profile.country}`
                      : profile.city || profile.country)
                  : 'Location not set'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setEditModalOpen(true)}
            className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#242424] transition-colors self-start"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
        </div>
      </Card>

      {/* Personal Information Card */}
      <Card className="bg-[#141414] border-[#1F1F1F] p-4 sm:p-6 rounded-xl mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white">Personal Information</h3>
          <button
            onClick={() => setEditModalOpen(true)}
            className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#242424] transition-colors self-start"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-[#666666] mb-2 text-sm">First Name</p>
            <p className="text-white">{profile.first_name || '-'}</p>
          </div>
          <div>
            <p className="text-[#666666] mb-2 text-sm">Last Name</p>
            <p className="text-white">{profile.last_name || '-'}</p>
          </div>
          <div>
            <p className="text-[#666666] mb-2 text-sm">Email Address</p>
            <p className="text-white break-words">{user.email}</p>
          </div>
          <div>
            <p className="text-[#666666] mb-2 text-sm">Phone</p>
            <p className="text-white">{profile.phone || '-'}</p>
          </div>
          <div className="sm:col-span-2">
            <p className="text-[#666666] mb-2 text-sm">Bio</p>
            <p className="text-white">{profile.bio || '-'}</p>
          </div>
        </div>
      </Card>

      {/* Address Card */}
      <Card className="bg-[#141414] border-[#1F1F1F] p-4 sm:p-6 rounded-xl">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
          <h3 className="text-lg sm:text-xl font-semibold text-white">Address</h3>
          <button
            onClick={() => setEditModalOpen(true)}
            className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#242424] transition-colors self-start"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-[#666666] mb-2 text-sm">Country</p>
            <p className="text-white">{profile.country || '-'}</p>
          </div>
          <div>
            <p className="text-[#666666] mb-2 text-sm">City/State</p>
            <p className="text-white">{profile.city || '-'}</p>
          </div>
          <div>
            <p className="text-[#666666] mb-2 text-sm">Post Code</p>
            <p className="text-white">{profile.post_code || '-'}</p>
          </div>
        </div>
      </Card>

      {/* Global Profile Edit Modal */}
      <ProfileEditModal open={editModalOpen} onOpenChange={setEditModalOpen} />
    </div>
  );
} 
