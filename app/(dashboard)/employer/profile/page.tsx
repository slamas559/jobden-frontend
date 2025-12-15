// app/(dashboard)/employer/dashboard/profile/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Globe,
  Edit3,
  Save,
  X,
  Briefcase,
  Users,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  useEmployerProfile,
  useEmployerProfileWithStats,
  useUpdateEmployerProfile,
  useCreateEmployerProfile,
} from '@/lib/hooks/use-employer';
import { UpdateEmployerProfileData } from '@/lib/api/employer-service';

export default function EmployerProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UpdateEmployerProfileData>({});

  const { data: profile, isLoading, refetch } = useEmployerProfile();
  const { data: profileWithStats } = useEmployerProfileWithStats();
  const updateProfileMutation = useUpdateEmployerProfile();
  const createProfileMutation = useCreateEmployerProfile();

  const isCreating = !profile && !isLoading;

  const handleEdit = () => {
    if (profile) {
      setEditData({
        company_name: profile.company_name || '',
        company_website: profile.company_website || '',
        company_description: profile.company_description || '',
      });
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    const dataToSave: UpdateEmployerProfileData = {
      company_name: editData.company_name?.trim() || '',
      company_website: editData.company_website?.trim() || undefined,
      company_description: editData.company_description?.trim() || undefined,
    };

    if (isCreating) {
      // Ensure company_name is always a string for CreateEmployerProfileData
      createProfileMutation.mutate({
        ...dataToSave,
        company_name: dataToSave.company_name || '',
      });
    } else {
      updateProfileMutation.mutate(dataToSave);
    }
  };

  // Handle success state
  useEffect(() => {
    if (createProfileMutation.isSuccess || updateProfileMutation.isSuccess) {
      setIsEditing(false);
      setEditData({});
    }
  }, [createProfileMutation.isSuccess, updateProfileMutation.isSuccess]);

  const handleCancel = () => {
    setIsEditing(false);
    setEditData({});
  };

  const profileData = profile || profileWithStats;
  const stats = profileWithStats;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Company Profile</h1>
          <p className="text-muted-foreground">
            Manage your company information
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Building2 className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Profile Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Briefcase className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Jobs</p>
                  <p className="text-2xl font-bold">{stats.total_jobs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Active Jobs</p>
                  <p className="text-2xl font-bold">{stats.active_jobs}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Applications</p>
                  <p className="text-2xl font-bold">{stats.total_applications}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Profile Content */}
      {isLoading ? (
        <Card>
          <CardContent className="p-6">
            <Skeleton className="h-48 w-full" />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Company Information</CardTitle>
              {!isEditing ? (
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  {isCreating ? 'Create Profile' : 'Edit Profile'}
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCancel}>
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleSave}
                    disabled={
                      updateProfileMutation.isPending ||
                      createProfileMutation.isPending
                    }
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Company Logo */}
            <div className="flex items-center gap-6">
              <div className="h-24 w-24 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Building2 className="h-12 w-12 text-white" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Company Logo</p>
                <p className="text-sm text-muted-foreground">
                  Upload a logo for your company profile (coming soon)
                </p>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="company_name">
                  Company Name <span className="text-destructive">*</span>
                </Label>
                {isEditing ? (
                  <Input
                    id="company_name"
                    value={editData.company_name || ''}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        company_name: e.target.value,
                      }))
                    }
                    placeholder="Enter your company name"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <Building2 className="h-4 w-4 text-muted-foreground" />
                    <p className="text-sm">
                      {profileData?.company_name || 'Not provided'}
                    </p>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_website">Company Website</Label>
                {isEditing ? (
                  <Input
                    id="company_website"
                    value={editData.company_website || ''}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        company_website: e.target.value,
                      }))
                    }
                    placeholder="https://example.com"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    {profileData?.company_website ? (
                      <a
                        href={profileData.company_website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary hover:underline"
                      >
                        {profileData.company_website}
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        No website provided
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="company_description">Company Description</Label>
                {isEditing ? (
                  <Textarea
                    id="company_description"
                    value={editData.company_description || ''}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        company_description: e.target.value,
                      }))
                    }
                    placeholder="Tell us about your company"
                    rows={6}
                  />
                ) : (
                  <p className="text-sm p-3 bg-muted rounded-md min-h-[150px]">
                    {profileData?.company_description ||
                      'No description provided'}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Info */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Completion</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { label: 'Company Name', completed: !!profile?.company_name },
            { label: 'Company Website', completed: !!profile?.company_website },
            {
              label: 'Company Description',
              completed: !!profile?.company_description,
            },
          ].map((item, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className={`w-2 h-2 rounded-full ${
                  item.completed ? 'bg-green-500' : 'bg-gray-300'
                }`}
              />
              <span
                className={`text-sm ${
                  item.completed ? 'text-foreground' : 'text-muted-foreground'
                }`}
              >
                {item.label}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}