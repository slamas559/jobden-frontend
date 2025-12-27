// app/(dashboard)/job-seeker/profile/page.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  GraduationCap,
  FileText,
  Edit3,
  Camera,
  Upload,
  Save,
  X,
  Plus,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  useProfile,
  useProfileWithStats,
  useUpdateProfile,
  useCreateProfile,
  useUploadResume,
  useUploadProfilePicture,
} from '@/lib/hooks/use-profile';
import { UpdateProfileData } from '@/lib/api/profile-service';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UpdateProfileData>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pictureInputRef = useRef<HTMLInputElement>(null);

  const { data: profile, isLoading, refetch } = useProfile();
  const { data: profileWithStats } = useProfileWithStats();
  const updateProfileMutation = useUpdateProfile();
  const createProfileMutation = useCreateProfile();
  const uploadResumeMutation = useUploadResume();
  const uploadPictureMutation = useUploadProfilePicture();

  const isCreating = !profile && !isLoading;

  const handleEdit = () => {
    if (profile) {
      setEditData({
        full_name: profile.full_name || '',
        bio: profile.bio || '',
        education: profile.education || '',
        experience: profile.experience || '',
        skills: profile.skills || '',
      });
    }
    setIsEditing(true);
  };

  const handleSave = () => {
    const dataToSave: UpdateProfileData = {
      full_name: editData.full_name?.trim() || undefined,
      bio: editData.bio?.trim() || undefined,
      education: editData.education?.trim() || undefined,
      experience: editData.experience?.trim() || undefined,
      skills: editData.skills?.trim() || undefined,
    };

    if (isCreating) {
      createProfileMutation.mutate(dataToSave);
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

  const handleResumeUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadResumeMutation.mutate(file, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  const handlePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      uploadPictureMutation.mutate(file, {
        onSuccess: () => {
          refetch();
        },
      });
    }
  };

  const profileData = profile || profileWithStats;
  const stats = profileWithStats;

  return (
    <div className="container mx-auto p-2 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Profile</h1>
          <p className="text-muted-foreground">
            Manage your professional profile and application materials
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <User className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Profile Stats */}
      {stats && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Applications</p>
                  <p className="text-2xl font-bold">{stats.total_applications}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Plus className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Bookmarks</p>
                  <p className="text-2xl font-bold">{stats.total_bookmarks}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Profile Content */}
      {isLoading ? (
        <ProfileSkeleton />
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Profile Card */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Profile Information</CardTitle>
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
                {/* Profile Picture Section */}
                <div className="flex items-center gap-6">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={profile?.profile_picture_url || ''} />
                    <AvatarFallback className="text-lg">
                      {profileData?.full_name
                        ?.split(' ')
                        .map((n) => n[0])
                        .join('')
                        .toUpperCase() || <User className="h-8 w-8" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Profile Picture</p>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Camera className="h-4 w-4 mr-2" />
                            Change Photo
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Upload Profile Picture</DialogTitle>
                            <DialogDescription>
                              Choose a new profile picture to upload
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="flex justify-center">
                              <Avatar className="h-32 w-32">
                                <AvatarImage src={profile?.profile_picture_url || ''} />
                                <AvatarFallback className="text-lg">
                                  {profileData?.full_name
                                    ?.split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .toUpperCase() || <User className="h-12 w-12" />}
                                </AvatarFallback>
                              </Avatar>
                            </div>
                            <input
                              ref={pictureInputRef}
                              type="file"
                              accept="image/*"
                              onChange={handlePictureUpload}
                              className="hidden"
                            />
                            <Button
                              className="w-full"
                              onClick={() => pictureInputRef.current?.click()}
                              disabled={uploadPictureMutation.isPending}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              {uploadPictureMutation.isPending
                                ? 'Uploading...'
                                : 'Choose File'}
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    {isEditing ? (
                      <Input
                        id="full_name"
                        value={editData.full_name || ''}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            full_name: e.target.value,
                          }))
                        }
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-sm p-2 bg-muted rounded-md">
                        {profileData?.full_name || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={editData.bio || ''}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            bio: e.target.value,
                          }))
                        }
                        placeholder="Tell us about yourself"
                        rows={4}
                      />
                    ) : (
                      <p className="text-sm p-2 bg-muted rounded-md min-h-[100px]">
                        {profileData?.bio || 'No bio provided'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="education">Education</Label>
                    {isEditing ? (
                      <Textarea
                        id="education"
                        value={editData.education || ''}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            education: e.target.value,
                          }))
                        }
                        placeholder="Your educational background"
                        rows={3}
                      />
                    ) : (
                      <p className="text-sm p-2 bg-muted rounded-md">
                        {profileData?.education || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Work Experience</Label>
                    {isEditing ? (
                      <Textarea
                        id="experience"
                        value={editData.experience || ''}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            experience: e.target.value,
                          }))
                        }
                        placeholder="Your work experience"
                        rows={4}
                      />
                    ) : (
                      <p className="text-sm p-2 bg-muted rounded-md">
                        {profileData?.experience || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills</Label>
                    {isEditing ? (
                      <Textarea
                        id="skills"
                        value={editData.skills || ''}
                        onChange={(e) =>
                          setEditData((prev) => ({
                            ...prev,
                            skills: e.target.value,
                          }))
                        }
                        placeholder="List your skills (separated by commas)"
                        rows={3}
                      />
                    ) : (
                      <div className="flex flex-wrap gap-2 p-2 bg-muted rounded-md min-h-[50px]">
                        {profileData?.skills
                          ?.split(',')
                          .map((skill, index) => (
                            <Badge key={index} variant="secondary">
                              {skill.trim()}
                            </Badge>
                          )) || (
                          <span className="text-muted-foreground text-sm">
                            No skills provided
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Resume Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resume</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {profile?.resume_url ? (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">Current Resume</span>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <a
                          href={profile.resume_url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View Resume
                        </a>
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Upload className="h-4 w-4 mr-2" />
                            Replace
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Upload New Resume</DialogTitle>
                            <DialogDescription>
                              Choose a new resume file to replace your current one
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4">
                            <input
                              ref={fileInputRef}
                              type="file"
                              accept=".pdf,.doc,.docx"
                              onChange={handleResumeUpload}
                              className="hidden"
                            />
                            <Button
                              className="w-full"
                              onClick={() => fileInputRef.current?.click()}
                              disabled={uploadResumeMutation.isPending}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              {uploadResumeMutation.isPending
                                ? 'Uploading...'
                                : 'Choose File'}
                            </Button>
                            <p className="text-xs text-muted-foreground">
                              Supported formats: PDF, DOC, DOCX (Max 5MB)
                            </p>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 space-y-3">
                    <div className="p-4 bg-muted rounded-full w-fit mx-auto">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-sm font-medium mb-1">No Resume Uploaded</p>
                      <p className="text-xs text-muted-foreground mb-3">
                        Upload your resume to apply for jobs
                      </p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Resume
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Upload Resume</DialogTitle>
                          <DialogDescription>
                            Upload your resume to complete your profile
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept=".pdf,.doc,.docx"
                            onChange={handleResumeUpload}
                            className="hidden"
                          />
                          <Button
                            className="w-full"
                            onClick={() => fileInputRef.current?.click()}
                            disabled={uploadResumeMutation.isPending}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            {uploadResumeMutation.isPending
                              ? 'Uploading...'
                              : 'Choose File'}
                          </Button>
                          <p className="text-xs text-muted-foreground">
                            Supported formats: PDF, DOC, DOCX (Max 5MB)
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Profile Completion */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile Completion</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { label: 'Profile Picture', completed: !!profile?.profile_picture_url },
                  { label: 'Full Name', completed: !!profile?.full_name },
                  { label: 'Bio', completed: !!profile?.bio },
                  { label: 'Education', completed: !!profile?.education },
                  { label: 'Work Experience', completed: !!profile?.experience },
                  { label: 'Skills', completed: !!profile?.skills },
                  { label: 'Resume', completed: !!profile?.resume_url },
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
        </div>
      )}
    </div>
  );
}

// Skeleton component for loading state
function ProfileSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <Skeleton className="h-24 w-24 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-32" />
              </div>
            </div>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="space-y-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}