// app/(dashboard)/employer/jobs/[id]/page.tsx
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Briefcase,
  DollarSign,
  Calendar,
  Users,
  Edit3,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Mail,
  FileText,
  Download,
  ExternalLink,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useJobApplicants, useUpdateApplicationStatus } from '@/lib/hooks/use-employer';
import { formatRelativeTime, formatCurrency } from '@/lib/utils/format';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: Clock },
  reviewed: { label: 'Reviewed', color: 'bg-blue-100 text-blue-800', icon: Eye },
  accepted: { label: 'Accepted', color: 'bg-green-100 text-green-800', icon: CheckCircle },
  rejected: { label: 'Rejected', color: 'bg-red-100 text-red-800', icon: XCircle },
};

export default function JobDetailsPage() {
  const params = useParams();
  const jobId = parseInt(params.id as string);
  const [selectedApplicant, setSelectedApplicant] = useState<any>(null);

  const { data: jobData, isLoading } = useJobApplicants(jobId);
  const updateStatusMutation = useUpdateApplicationStatus();

  if (isLoading) {
    return <JobDetailsSkeleton />;
  }

  if (!jobData) {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Job not found</h3>
            <p className="text-muted-foreground text-center mb-4">
              The job you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button asChild>
              <Link href="/employer/jobs">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Jobs
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { applicants, total_applicants } = jobData;

  // Group applicants by status
  const applicationsByStatus = {
    pending: applicants.filter((app: any) => app.status === 'pending'),
    reviewed: applicants.filter((app: any) => app.status === 'reviewed'),
    accepted: applicants.filter((app: any) => app.status === 'accepted'),
    rejected: applicants.filter((app: any) => app.status === 'rejected'),
  };

  const handleStatusUpdate = (applicationId: number, newStatus: string) => {
    updateStatusMutation.mutate({
      applicationId,
      status: newStatus as any,
    });
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/employer/jobs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-2">Job Details & Applications</h1>
          <p className="text-muted-foreground">
            Review job information and manage applications
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href={`/employer/jobs/${jobId}/edit`}>
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Job
            </Link>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Trash2 className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <DropdownMenuItem
                    className="text-red-600"
                    onSelect={(e) => e.preventDefault()}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Job
                  </DropdownMenuItem>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Job?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this job? This action cannot be undone and will remove all associated applications.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-red-600 hover:bg-red-700">
                      Delete Job
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Job Info and Stats */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Job Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl mb-2">Sample Job Title</CardTitle>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant="default">Active</Badge>
                    <Badge variant="outline">Full-time</Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Job Details */}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Location</p>
                    <p className="text-sm text-muted-foreground">Remote</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <DollarSign className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Salary</p>
                    <p className="text-sm text-muted-foreground">$80,000 - $120,000</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Posted</p>
                    <p className="text-sm text-muted-foreground">2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Job Type</p>
                    <p className="text-sm text-muted-foreground">Full-time</p>
                  </div>
                </div>
              </div>

              {/* Job Description */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Job Description</h3>
                <div className="prose prose-sm max-w-none text-muted-foreground">
                  <p>
                    We are looking for a talented and passionate developer to join our team. 
                    The ideal candidate will have experience with modern web technologies and 
                    a strong passion for creating user-friendly applications.
                  </p>
                  <p>
                    Responsibilities include developing new features, maintaining existing code, 
                    collaborating with cross-functional teams, and contributing to technical 
                    decisions and architecture discussions.
                  </p>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                  <li>3+ years of experience in web development</li>
                  <li>Proficiency in React, TypeScript, and Node.js</li>
                  <li>Experience with modern CSS frameworks</li>
                  <li>Strong problem-solving skills</li>
                  <li>Excellent communication skills</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Applications Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Applications Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Total Applications</span>
                <Badge variant="secondary">{total_applicants}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Pending Review</span>
                <Badge className="bg-yellow-100 text-yellow-800">
                  {applicationsByStatus.pending.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Reviewed</span>
                <Badge className="bg-blue-100 text-blue-800">
                  {applicationsByStatus.reviewed.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Accepted</span>
                <Badge className="bg-green-100 text-green-800">
                  {applicationsByStatus.accepted.length}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Rejected</span>
                <Badge className="bg-red-100 text-red-800">
                  {applicationsByStatus.rejected.length}
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full" asChild>
                <Link href={`/employer/jobs/${jobId}/edit`}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Job
                </Link>
              </Button>
              <Button variant="outline" className="w-full" asChild>
                <Link href="/employer/applicants">
                  <Users className="h-4 w-4 mr-2" />
                  View All Applications
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Applications Tabs */}
      <Card>
        <CardHeader>
          <CardTitle>Applications</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="space-y-4">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">
                All ({total_applicants})
              </TabsTrigger>
              <TabsTrigger value="pending">
                Pending ({applicationsByStatus.pending.length})
              </TabsTrigger>
              <TabsTrigger value="reviewed">
                Reviewed ({applicationsByStatus.reviewed.length})
              </TabsTrigger>
              <TabsTrigger value="accepted">
                Accepted ({applicationsByStatus.accepted.length})
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected ({applicationsByStatus.rejected.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-4">
              <ApplicationsList 
                applications={applicants}
                onViewApplicant={setSelectedApplicant}
                onStatusUpdate={handleStatusUpdate}
              />
            </TabsContent>

            <TabsContent value="pending" className="space-y-4">
              <ApplicationsList 
                applications={applicationsByStatus.pending}
                onViewApplicant={setSelectedApplicant}
                onStatusUpdate={handleStatusUpdate}
              />
            </TabsContent>

            <TabsContent value="reviewed" className="space-y-4">
              <ApplicationsList 
                applications={applicationsByStatus.reviewed}
                onViewApplicant={setSelectedApplicant}
                onStatusUpdate={handleStatusUpdate}
              />
            </TabsContent>

            <TabsContent value="accepted" className="space-y-4">
              <ApplicationsList 
                applications={applicationsByStatus.accepted}
                onViewApplicant={setSelectedApplicant}
                onStatusUpdate={handleStatusUpdate}
              />
            </TabsContent>

            <TabsContent value="rejected" className="space-y-4">
              <ApplicationsList 
                applications={applicationsByStatus.rejected}
                onViewApplicant={setSelectedApplicant}
                onStatusUpdate={handleStatusUpdate}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Applicant Detail Dialog */}
      {selectedApplicant && (
        <ApplicantDetailDialog
          applicant={selectedApplicant}
          open={!!selectedApplicant}
          onClose={() => setSelectedApplicant(null)}
          onStatusUpdate={handleStatusUpdate}
        />
      )}
    </div>
  );
}

// Applications List Component (reused from applicants page)
function ApplicationsList({
  applications,
  onViewApplicant,
  onStatusUpdate,
}: {
  applications: any[];
  onViewApplicant: (applicant: any) => void;
  onStatusUpdate: (id: number, status: string) => void;
}) {
  if (applications.length === 0) {
    return (
      <div className="text-center py-8">
        <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
        <p className="text-muted-foreground">No applications in this category</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {applications.map((application) => (
        <ApplicantCard
          key={application.application_id}
          application={application}
          onViewApplicant={onViewApplicant}
          onStatusUpdate={onStatusUpdate}
        />
      ))}
    </div>
  );
}

// Applicant Card Component (reused from applicants page)
function ApplicantCard({
  application,
  onViewApplicant,
  onStatusUpdate,
}: {
  application: any;
  onViewApplicant: (applicant: any) => void;
  onStatusUpdate: (id: number, status: string) => void;
}) {
  const statusInfo = statusConfig[application.status as keyof typeof statusConfig];
  const StatusIcon = statusInfo.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1">
              <Avatar className="h-10 w-10">
                <AvatarImage src={application.applicant.profile_picture_url || ''} />
                <AvatarFallback>
                  {application.applicant.full_name
                    ?.split(' ')
                    .map((n: string) => n[0])
                    .join('')
                    .toUpperCase() || <Mail className="h-4 w-4" />}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium">
                    {application.applicant.full_name || 'Unnamed Applicant'}
                  </h4>
                  <Badge className={statusInfo.color}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {application.applicant.email}
                </p>
                <p className="text-xs text-muted-foreground">
                  Applied {formatRelativeTime(application.applied_at)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewApplicant(application)}
              >
                <Eye className="h-4 w-4 mr-2" />
                View
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {application.status !== 'reviewed' && (
                    <DropdownMenuItem
                      onClick={() => onStatusUpdate(application.application_id, 'reviewed')}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Mark as Reviewed
                    </DropdownMenuItem>
                  )}
                  {application.status !== 'accepted' && (
                    <DropdownMenuItem
                      onClick={() => onStatusUpdate(application.application_id, 'accepted')}
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Accept Applicant
                    </DropdownMenuItem>
                  )}
                  {application.status !== 'rejected' && (
                    <DropdownMenuItem
                      onClick={() => onStatusUpdate(application.application_id, 'rejected')}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject Applicant
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Applicant Detail Dialog (reused from applicants page)
function ApplicantDetailDialog({
  applicant,
  open,
  onClose,
  onStatusUpdate,
}: {
  applicant: any;
  open: boolean;
  onClose: () => void;
  onStatusUpdate: (id: number, status: string) => void;
}) {
  const statusInfo = statusConfig[applicant.status as keyof typeof statusConfig];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Applicant Details</DialogTitle>
          <DialogDescription>
            Review applicant information and manage application status
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Applicant Header */}
          <div className="flex items-start gap-6 p-6 bg-muted rounded-lg">
            <Avatar className="h-20 w-20">
              <AvatarImage src={applicant.applicant.profile_picture_url || ''} />
              <AvatarFallback className="text-lg">
                {applicant.applicant.full_name
                  ?.split(' ')
                  .map((n: string) => n[0])
                  .join('')
                  .toUpperCase() || <Mail className="h-8 w-8" />}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-2xl font-bold">
                  {applicant.applicant.full_name || 'Unnamed Applicant'}
                </h2>
                <Badge className={statusInfo.color}>
                  <statusInfo.icon className="h-4 w-4 mr-2" />
                  {statusInfo.label}
                </Badge>
              </div>
              <p className="text-muted-foreground mb-2">{applicant.applicant.email}</p>
              <p className="text-sm text-muted-foreground">
                Applied {formatRelativeTime(applicant.applied_at)}
              </p>
            </div>

            <div className="flex gap-2">
              {applicant.status !== 'reviewed' && (
                <Button
                  variant="outline"
                  onClick={() => onStatusUpdate(applicant.application_id, 'reviewed')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Mark Reviewed
                </Button>
              )}
              {applicant.status !== 'accepted' && (
                <Button
                  onClick={() => onStatusUpdate(applicant.application_id, 'accepted')}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Accept
                </Button>
              )}
              {applicant.status !== 'rejected' && (
                <Button
                  variant="destructive"
                  onClick={() => onStatusUpdate(applicant.application_id, 'rejected')}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              )}
            </div>
          </div>

          {/* Cover Letter */}
          {applicant.cover_letter && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Cover Letter</h3>
              <div className="prose prose-sm max-w-none">
                <p className="whitespace-pre-wrap text-muted-foreground">
                  {applicant.cover_letter}
                </p>
              </div>
            </div>
          )}

          {/* Resume */}
          {applicant.applicant.resume_url && (
            <div>
              <h3 className="text-lg font-semibold mb-3">Resume</h3>
              <Button variant="outline" asChild>
                <a
                  href={applicant.applicant.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Resume
                  <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Skeleton component for loading state
function JobDetailsSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Skeleton className="h-10 w-10 rounded" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-48" />
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </CardContent>
          </Card>
        </div>
        <div>
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}