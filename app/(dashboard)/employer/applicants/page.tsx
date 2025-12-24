// app/(dashboard)/employer/dashboard/applicants/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Users,
  Search,
  Download,
  Mail,
  CheckCircle,
  XCircle,
  Eye,
  Clock,
  FileText,
  ExternalLink,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useJobApplicants, useUpdateApplicationStatus, useEmployerJobs } from '@/lib/hooks/use-employer';
import { formatRelativeTime, formatDate } from '@/lib/utils/format';
import { useSearchParams } from 'next/navigation';

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
  reviewed: {
    label: 'Reviewed',
    icon: Eye,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  },
  accepted: {
    label: 'Accepted',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  },
};

export default function EmployerApplicantsPage() {
  const searchParams = useSearchParams();
  const jobIdParam = searchParams.get('job_id');

  const [selectedJobId, setSelectedJobId] = useState<number | null>(
    jobIdParam ? parseInt(jobIdParam) : null
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const { data: jobs } = useEmployerJobs({ active_only: false });
  const { data: applicantsData, isLoading } = useJobApplicants(
    selectedJobId || 0,
    { limit: 100 }
  );
  const updateStatusMutation = useUpdateApplicationStatus();

  // console.log('split jobs', jobs);
  // console.log('selectedJobId', selectedJobId);

  // Set first job as default if no job is selected and jobs are loaded
  useEffect(() => {
    if (!selectedJobId && jobs && jobs.length > 0) {
      setSelectedJobId(jobs[0].id);
    }
  }, [jobs, selectedJobId]);

  const filteredApplicants = applicantsData?.applicants?.filter((app) => {
    const matchesSearch =
      app.applicant.full_name
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      app.applicant.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (applicationId: number, newStatus: any) => {
    updateStatusMutation.mutate({ applicationId, status: newStatus });
  };

  const ApplicantCard = ({ applicant }: { applicant: any }) => {
    const StatusIcon = statusConfig[applicant.status as keyof typeof statusConfig]?.icon;

    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={applicant.applicant.profile_picture_url} />
                  <AvatarFallback>
                    {applicant.applicant.full_name
                      ?.split(' ')
                      .map((n: string) => n[0])
                      .join('')
                      .toUpperCase() || <User className="h-6 w-6" />}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-lg">
                      {applicant.applicant.full_name || 'Applicant'}
                    </h3>
                    <Badge
                      className={
                        statusConfig[applicant.status as keyof typeof statusConfig]?.color
                      }
                    >
                      {StatusIcon && <StatusIcon className="h-3 w-3 mr-1" />}
                      {statusConfig[applicant.status as keyof typeof statusConfig]?.label}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Mail className="h-4 w-4" />
                    <span>{applicant.applicant.email}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Applied {formatRelativeTime(applicant.applied_at)}
                  </p>
                </div>
              </div>
            </div>

            {applicant.applicant.bio && (
              <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                {applicant.applicant.bio}
              </p>
            )}

            {applicant.applicant.skills && (
              <div className="mb-4">
                <p className="text-sm font-medium mb-2">Skills:</p>
                <div className="flex flex-wrap gap-2">
                  {applicant.applicant.skills
                    .split(',')
                    .slice(0, 5)
                    .map((skill: string, index: number) => (
                      <Badge key={index} variant="secondary">
                        {skill.trim()}
                      </Badge>
                    ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-2 pt-4 border-t">
              {applicant.applicant.resume_url && (
                <Button variant="outline" size="sm" asChild>
                  <a
                    href={applicant.applicant.resume_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Resume
                  </a>
                </Button>
              )}

              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Application Details</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={applicant.applicant.profile_picture_url}
                        />
                        <AvatarFallback>
                          {applicant.applicant.full_name
                            ?.split(' ')
                            .map((n: string) => n[0])
                            .join('')
                            .toUpperCase() || 'AP'}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {applicant.applicant.full_name || 'Applicant'}
                        </h3>
                        <p className="text-muted-foreground">
                          {applicant.applicant.email}
                        </p>
                      </div>
                    </div>

                    {applicant.applicant.bio && (
                      <div>
                        <h4 className="font-semibold mb-2">Bio</h4>
                        <p className="text-sm text-muted-foreground">
                          {applicant.applicant.bio}
                        </p>
                      </div>
                    )}

                    {applicant.cover_letter && (
                      <div>
                        <h4 className="font-semibold mb-2">Cover Letter</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {applicant.cover_letter}
                        </p>
                      </div>
                    )}

                    {applicant.applicant.experience && (
                      <div>
                        <h4 className="font-semibold mb-2">Experience</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {applicant.applicant.experience}
                        </p>
                      </div>
                    )}

                    {applicant.applicant.education && (
                      <div>
                        <h4 className="font-semibold mb-2">Education</h4>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                          {applicant.applicant.education}
                        </p>
                      </div>
                    )}

                    {applicant.applicant.skills && (
                      <div>
                        <h4 className="font-semibold mb-2">Skills</h4>
                        <div className="flex flex-wrap gap-2">
                          {applicant.applicant.skills
                            .split(',')
                            .map((skill: string, index: number) => (
                              <Badge key={index} variant="secondary">
                                {skill.trim()}
                              </Badge>
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </DialogContent>
              </Dialog>

              {applicant.status !== 'accepted' && applicant.status !== 'rejected' && (
                <>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="default">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Accept
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Accept Application?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will notify the applicant that their application
                          has been accepted.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleStatusChange(applicant.application_id, 'accepted')
                          }
                        >
                          Accept
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reject Application?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This will notify the applicant that their application
                          was not successful.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() =>
                            handleStatusChange(applicant.application_id, 'rejected')
                          }
                          className="bg-destructive"
                        >
                          Reject
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Applicants</h1>
        <p className="text-muted-foreground">
          Review and manage job applications
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Select
          value={selectedJobId?.toString() || ''}
          onValueChange={(value) => setSelectedJobId(parseInt(value))}
        >
          <SelectTrigger className="w-full sm:w-[300px]">
            <SelectValue placeholder="Select a job" />
          </SelectTrigger>
          <SelectContent>
            {jobs?.map((job) => (
              <SelectItem key={job.id} value={job.id.toString()}>
                {job.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search applicants..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Applicants List */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-24 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredApplicants && filteredApplicants.length > 0 ? (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground mb-4">
            Showing {filteredApplicants.length} of{' '}
            {applicantsData?.total_applicants || 0} applicants
          </div>
          {filteredApplicants.map((applicant) => (
            <ApplicantCard key={applicant.application_id} applicant={applicant} />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery || statusFilter !== 'all'
                ? 'No matching applicants'
                : 'No applicants yet'}
            </h3>
            <p className="text-muted-foreground text-center">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : selectedJobId
                ? 'This job hasn\'t received any applications yet'
                : 'Select a job to view applicants'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}