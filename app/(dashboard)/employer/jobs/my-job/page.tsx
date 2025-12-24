// app/(dashboard)/employer/dashboard/jobs/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Plus,
  Edit,
  Trash2,
  Eye,
  Users,
  MapPin,
  DollarSign,
  Calendar,
  Search,
  Filter,
  MoreVertical,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { useEmployerJobs, useDeleteJob, useUpdateJob } from '@/lib/hooks/use-employer';
import { formatRelativeTime, formatCurrency } from '@/lib/utils/format';
import Link from 'next/link';
import { descriptionPreview } from '../../dashboard/page';

export default function EmployerJobsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const { data: allJobs, isLoading: allJobsLoading } = useEmployerJobs({
    active_only: false,
  });
  const { data: activeJobs, isLoading: activeJobsLoading } = useEmployerJobs({
    active_only: true,
  });

  // console.log("all jobs", allJobs);
  const deleteJobMutation = useDeleteJob();
  const updateJobMutation = useUpdateJob();

  const filteredJobs = (jobs: typeof allJobs) => {
    if (!jobs) return [];
    return jobs.filter((job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const handleDeleteJob = (jobId: number) => {
    deleteJobMutation.mutate(jobId);
  };

  const handleToggleActive = (jobId: number, currentStatus: boolean) => {
    updateJobMutation.mutate({
      jobId,
      data: { is_active: !currentStatus },
    });
  };

  const JobCard = ({ job }: { job: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-semibold text-lg">{job.title}</h3>
                <Badge variant={job.is_active ? 'default' : 'secondary'}>
                  {job.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-3 text-sm text-muted-foreground mb-3">
                {job.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{job.location}</span>
                  </div>
                )}
                {job.job_type && (
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    <span>{job.job_type}</span>
                  </div>
                )}
                {job.salary && (
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span>{formatCurrency(job.salary)}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatRelativeTime(job.created_at)}</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {descriptionPreview(job)}
              </p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href={`/job-seeker/jobs`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View as Job Seeker
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/employer/jobs/${job.id}/edit`}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => handleToggleActive(job.id, job.is_active)}
                >
                  {job.is_active ? 'Deactivate' : 'Activate'}
                </DropdownMenuItem>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem
                      onSelect={(e) => e.preventDefault()}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Job?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this job posting? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDeleteJob(job.id)}
                        className="bg-destructive"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <Button variant="outline" size="sm" asChild>
              <Link href={`/employer/applicants?job_id=${job.id}`}>
                <Users className="h-4 w-4 mr-2" />
                View Applicants
              </Link>
            </Button>
            <Button size="sm" asChild>
              <Link href={`/employer/jobs/${job.id}/edit`}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Job
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">My Jobs</h1>
          <p className="text-muted-foreground">
            Manage all your job postings
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/employer/dashboard/post-job">
            <Plus className="h-5 w-5 mr-2" />
            Post New Job
          </Link>
        </Button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">
            All Jobs
            {allJobs && (
              <span className="ml-2 text-xs bg-primary/10 px-2 py-0.5 rounded-full">
                {allJobs.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="active">
            Active
            {activeJobs && (
              <span className="ml-2 text-xs bg-primary/10 px-2 py-0.5 rounded-full">
                {activeJobs.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="inactive">
            Inactive
            {allJobs && activeJobs && (
              <span className="ml-2 text-xs bg-primary/10 px-2 py-0.5 rounded-full">
                {allJobs.length - activeJobs.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          {allJobsLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredJobs(allJobs).length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredJobs(allJobs).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                {searchQuery ? 'No matching jobs' : 'No jobs yet'}
              </h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? 'Try adjusting your search'
                  : 'Start by posting your first job'}
              </p>
              {!searchQuery && (
                <Button asChild>
                  <Link href="/employer/dashboard/post-job">
                    <Plus className="h-4 w-4 mr-2" />
                    Post a Job
                  </Link>
                </Button>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="active" className="mt-6">
          {activeJobsLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredJobs(activeJobs).length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredJobs(activeJobs).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No active jobs</h3>
              <p className="text-muted-foreground">
                Post a new job or activate an existing one
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="inactive" className="mt-6">
          {allJobsLoading ? (
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-24 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredJobs(allJobs?.filter((j) => !j.is_active)).length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2">
              {filteredJobs(allJobs?.filter((j) => !j.is_active)).map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No inactive jobs</h3>
              <p className="text-muted-foreground">
                All your jobs are currently active
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}