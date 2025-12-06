// app/(dashboard)/dashboard/applications/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Ban,
  Trash2,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useApplications, useWithdrawApplication, useDeleteApplication } from '@/lib/hooks/use-applications';
import { formatRelativeTime, formatCurrency, formatDate } from '@/lib/utils/format';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock,
    color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    description: 'Your application is waiting to be reviewed',
  },
  reviewed: {
    label: 'Under Review',
    icon: Eye,
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    description: 'The employer is reviewing your application',
  },
  accepted: {
    label: 'Accepted',
    icon: CheckCircle,
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    description: 'Congratulations! Your application was accepted',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    description: 'Unfortunately, your application was not successful',
  },
  withdrawn: {
    label: 'Withdrawn',
    icon: Ban,
    color: 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400',
    description: 'You withdrew this application',
  },
};

export default function ApplicationsPage() {
  const [selectedTab, setSelectedTab] = useState('all');
  const { data: applications, isLoading } = useApplications(
    selectedTab === 'all' ? undefined : selectedTab
  );
  const withdrawMutation = useWithdrawApplication();
  const deleteMutation = useDeleteApplication();

  const stats = applications
    ? {
        total: applications.length,
        pending: applications.filter((a) => a.status === 'pending').length,
        reviewed: applications.filter((a) => a.status === 'reviewed').length,
        accepted: applications.filter((a) => a.status === 'accepted').length,
        rejected: applications.filter((a) => a.status === 'rejected').length,
      }
    : { total: 0, pending: 0, reviewed: 0, accepted: 0, rejected: 0 };

  const handleWithdraw = (id: number) => {
    withdrawMutation.mutate(id);
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">My Applications</h1>
        <p className="text-muted-foreground">
          Track and manage all your job applications
        </p>
      </div>

      {/* Applications List */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList>
          <TabsTrigger value="all">All <span className={stats.total ?`text-muted-foreground rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold` : ""}>{stats.total ? stats.total : ""}</span></TabsTrigger>
          <TabsTrigger value="pending">Pending <span className={stats.pending ?`text-muted-foreground rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold` : ""}>{stats.pending ? stats.pending : ""}</span></TabsTrigger>
          <TabsTrigger value="reviewed">Reviewed <span className={stats.reviewed ?`text-muted-foreground rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold` : ""}>{stats.reviewed ? stats.reviewed : ""}</span></TabsTrigger>
          <TabsTrigger value="accepted">Accepted <span className={stats.accepted ?`text-muted-foreground rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold` : ""}>{stats.accepted ? stats.accepted : ""}</span></TabsTrigger>
          <TabsTrigger value="rejected">Rejected <span className={stats.rejected ?`text-muted-foreground rounded-full bg-primary/10 px-2 py-0.5 text-xs font-semibold` : ""}>{stats.rejected ? stats.rejected : ""}</span></TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="mt-6">
          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-4" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : applications && applications.length > 0 ? (
            <div className="space-y-4">
              {applications.map((application) => (
                <ApplicationCard
                  key={application.id}
                  application={application}
                  onWithdraw={handleWithdraw}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No applications yet</h3>
                <p className="text-muted-foreground text-center mb-4">
                  Start applying to jobs to see your applications here
                </p>
                <Button asChild>
                  <a href="/dashboard/jobs">Browse Jobs</a>
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}


// Application Card Component
function ApplicationCard({
  application,
  onWithdraw,
  onDelete,
}: {
  application: any;
  onWithdraw: (id: number) => void;
  onDelete: (id: number) => void;
}) {
  const status = statusConfig[application.status as keyof typeof statusConfig];
  const StatusIcon = status.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-1">{application.job.title}</h3>
              <p className="text-muted-foreground">Company Name</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <a href={`/dashboard/applications/${application.id}`}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </a>
                </DropdownMenuItem>
                {application.status === 'pending' && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                        <Ban className="h-4 w-4 mr-2" />
                        Withdraw
                      </DropdownMenuItem>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Withdraw Application?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to withdraw this application? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => onWithdraw(application.id)}>
                          Withdraw
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                {application.status === 'withdrawn' && (
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
                        <AlertDialogTitle>Delete Application?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this application? This action
                          cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => onDelete(application.id)}
                          className="bg-destructive">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Status Badge */}
          <div className="mb-4">
            <Badge className={cn('px-3 py-1', status.color)}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {status.label}
            </Badge>
          </div>

          {/* Job Details */}
          <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
            {application.job.location && (
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span>{application.job.location}</span>
              </div>
            )}
            {application.job.job_type && (
              <div className="flex items-center gap-1">
                <Briefcase className="h-4 w-4" />
                <span>{application.job.job_type}</span>
              </div>
            )}
            {application.job.salary && (
              <div className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                <span>{formatCurrency(application.job.salary)}</span>
              </div>
            )}
          </div>

          {/* Timeline */}
          <div className="flex items-center justify-between text-sm border-t pt-4">
            <div className="text-muted-foreground">
              <span className="font-medium">Applied:</span>{' '}
              {formatDate(application.applied_at)}
            </div>
            <div className="text-muted-foreground">
              {formatRelativeTime(application.applied_at)}
            </div>
          </div>

          {/* Status Description */}
          {status.description && (
            <div className="mt-3 text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 inline mr-2" />
              {status.description}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}