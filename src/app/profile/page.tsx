'use client';

import { useEffect, useState } from 'react';
import { Card } from "@/components/ui/card";
import { Pencil } from "lucide-react";
import Image from "next/image";
import { supabase } from '@/utils/supabase/client';
import { Profile } from '@/types/supabase';
import ProfileEditModal from "@/components/ProfileEditModal";

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [session, setSession] = useState<any>(null);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      const { data: { session: currentSession } } = await supabase().auth.getSession();
      if (!currentSession) return;
      
      setSession(currentSession);
      
      const { data, error } = await supabase()
        .from('profiles')
        .select('*')
        .eq('id', currentSession.user.id)
        .single();
        
      if (error) {
        console.error('Error loading profile:', error);
        return;
      }
      
      setProfile(data);
    }
    
    loadProfile();
  }, []);

  if (!session || !profile) {
    return (
      <div className="min-h-screen bg-black p-8">
        <div className="w-10 h-10 border-t-2 border-b-2 border-white rounded-full animate-spin mx-auto"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black p-8 px-32">
      <h1 className="text-2xl font-bold text-white mb-8">My Profile</h1>

      {/* Profile Header Card */}
      <Card className="bg-[#141414] border-[#1F1F1F] p-6 rounded-xl mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {session.user?.user_metadata?.avatar_url ? (
              <Image
                src={session.user.user_metadata.avatar_url}
                alt="Profile"
                width={64}
                height={64}
                className="rounded-full"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-primary text-foreground flex items-center justify-center text-xl">
                {session.user?.email?.[0].toUpperCase()}
              </div>
            )}
            <div>
              <h2 className="text-xl font-semibold text-white">
                {profile.first_name} {profile.last_name}
              </h2>
              <p className="text-[#666666]">{profile.role === 'admin' ? 'Administrator' : 'User'}</p>
              <p className="text-[#666666]">
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
            className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#242424] transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
        </div>
      </Card>

      {/* Personal Information Card */}
      <Card className="bg-[#141414] border-[#1F1F1F] p-6 rounded-xl mb-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Personal Information</h3>
          <button
            onClick={() => setEditModalOpen(true)}
            className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#242424] transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-[#666666] mb-2">First Name</p>
            <p className="text-white">{profile.first_name || '-'}</p>
          </div>
          <div>
            <p className="text-[#666666] mb-2">Last Name</p>
            <p className="text-white">{profile.last_name || '-'}</p>
          </div>
          <div>
            <p className="text-[#666666] mb-2">Email Address</p>
            <p className="text-white">{session.user.email}</p>
          </div>
          <div>
            <p className="text-[#666666] mb-2">Phone</p>
            <p className="text-white">{profile.phone || '-'}</p>
          </div>
          <div className="col-span-2">
            <p className="text-[#666666] mb-2">Bio</p>
            <p className="text-white">{profile.bio || '-'}</p>
          </div>
        </div>
      </Card>

      {/* Address Card */}
      <Card className="bg-[#141414] border-[#1F1F1F] p-6 rounded-xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-semibold text-white">Address</h3>
          <button
            onClick={() => setEditModalOpen(true)}
            className="bg-[#1A1A1A] text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-[#242424] transition-colors"
          >
            <Pencil className="w-4 h-4" />
            Edit
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-[#666666] mb-2">Country</p>
            <p className="text-white">{profile.country || '-'}</p>
          </div>
          <div>
            <p className="text-[#666666] mb-2">City/State</p>
            <p className="text-white">{profile.city || '-'}</p>
          </div>
          <div>
            <p className="text-[#666666] mb-2">Post Code</p>
            <p className="text-white">{profile.post_code || '-'}</p>
          </div>
        </div>
      </Card>

      {/* Global Profile Edit Modal */}
      <ProfileEditModal open={editModalOpen} onOpenChange={setEditModalOpen} />
    </div>
  );
} 
