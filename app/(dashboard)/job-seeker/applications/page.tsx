'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  MoreVertical,
  Building2,
  Calendar,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
import { useEmployerProfileById } from '@/lib/hooks/use-employer';

const statusConfig = {
  pending: {
    label: 'Pending',
    icon: Clock,
    variant: 'warning' as const,
    color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    description: 'Awaiting employer review',
  },
  reviewed: {
    label: 'Under Review',
    icon: Eye,
    variant: 'secondary' as const,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    description: 'Employer is viewing your profile',
  },
  accepted: {
    label: 'Accepted',
    icon: CheckCircle,
    variant: 'default' as const,
    color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
    description: 'Application successful!',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    variant: 'destructive' as const,
    color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
    description: 'Not selected for this role',
  },
  withdrawn: {
    label: 'Withdrawn',
    icon: Ban,
    variant: 'outline' as const,
    color: 'bg-slate-100 text-slate-700 dark:bg-slate-900/30 dark:text-slate-400',
    description: 'You cancelled this application',
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

  const handleWithdraw = (id: number) => withdrawMutation.mutate(id);
  const handleDelete = (id: number) => deleteMutation.mutate(id);

  return (
    <div className="container max-w-7xl mx-auto p-2 md:p-8 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b pb-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight">Applications</h1>
          <p className="text-muted-foreground mt-2 text-lg">
            Track your journey and manage your career opportunities.
          </p>
        </div>
        <div className="flex gap-2 bg-muted/50 p-1 rounded-lg border text-sm font-medium">
          <div className="px-3 py-1 bg-background rounded shadow-sm">Total: {stats.total}</div>
          <div className="px-3 py-1 text-emerald-600 dark:text-emerald-400">Accepted: {stats.accepted}</div>
        </div>
      </header>

      {/* Tabs / Filters */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <div className="flex overflow-x-auto pb-2 scrollbar-hide">
          <TabsList className="h-11 inline-flex w-auto bg-muted/30 p-1">
            {['all', 'pending', 'reviewed', 'accepted', 'rejected'].map((tab) => (
              <TabsTrigger 
                key={tab} 
                value={tab} 
                className="px-6 rounded-md capitalize data-[state=active]:bg-background data-[state=active]:shadow-sm"
              >
                {tab}
                {stats[tab as keyof typeof stats] > 0 && (
                  <span className="ml-2 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                    {stats[tab as keyof typeof stats]}
                  </span>
                )}
              </TabsTrigger>
            ))}
          </TabsList>
        </div>

        <TabsContent value={selectedTab} className="mt-8">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="overflow-hidden border-muted/60">
                  <CardContent className="p-0">
                    <Skeleton className="h-32 w-full" />
                    <div className="p-6 space-y-3">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                      <div className="pt-4 space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : applications && applications.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {applications.map((application, idx) => (
                  <ApplicationCard
                    key={application.id}
                    index={idx}
                    application={application}
                    onWithdraw={handleWithdraw}
                    onDelete={handleDelete}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card className="border-dashed border-2 bg-muted/20">
                <CardContent className="flex flex-col items-center justify-center py-20">
                  <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center mb-6">
                    <FileText className="h-10 w-10 text-muted-foreground/60" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">No applications found</h3>
                  <p className="text-muted-foreground text-center max-w-xs mb-8">
                    Your hunt hasn't started yet! Apply to jobs to track your progress here.
                  </p>
                  <Button asChild size="lg" className="rounded-full px-8">
                    <a href="/job-seeker/jobs text-white">Browse Jobs</a>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ApplicationCard({
  application,
  onWithdraw,
  onDelete,
  index
}: {
  application: any;
  onWithdraw: (id: number) => void;
  onDelete: (id: number) => void;
  index: number;
}) {
  const status = statusConfig[application.status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = status.icon;

  const employerProfile = useEmployerProfileById(application.job.employer_id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
    >
      <Card className="group h-full flex flex-col hover:border-primary/50 hover:shadow-xl transition-all duration-300 overflow-hidden ring-1 ring-black/[0.05] dark:ring-white/[0.05]">
        <CardContent className="p-0 flex flex-col h-full">
          {/* Top Section */}
          <div className="p-6 space-y-4 flex-1">
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-primary font-medium text-sm">
                   <Building2 className="h-3.5 w-3.5" />
                   <span>{ employerProfile?.data?.company_name || "Company Name" }</span>
                </div>
                <h3 className="text-xl font-bold leading-tight group-hover:text-primary transition-colors">
                  {application.job.title}
                </h3>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="shrink-0 -mr-2">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <a href={`/job-seeker/jobs/${application.job.id}`} className="cursor-pointer">
                      <Eye className="h-4 w-4 mr-2" />
                      View Job Details
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
                            This will notify the employer that you are no longer interested.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Keep Application</AlertDialogCancel>
                          <AlertDialogAction onClick={() => onWithdraw(application.id)}>
                            Withdraw Now
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}

                  {application.status === 'withdrawn' && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <DropdownMenuItem onSelect={(e) => e.preventDefault()} className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Entry
                        </DropdownMenuItem>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Record?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will remove the application from your history permanently.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => onDelete(application.id)}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Meta tags */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-muted/30 font-normal">
                <MapPin className="h-3 w-3 mr-1" />
                {application.job.location || 'Remote'}
              </Badge>
              <Badge variant="outline" className="bg-muted/30 font-normal">
                <Briefcase className="h-3 w-3 mr-1" />
                {application.job.job_type}
              </Badge>
              {application.job.salary && (
                <Badge variant="outline" className="bg-muted/30 font-normal">
                  <DollarSign className="h-3 w-3 mr-1" />
                  {formatCurrency(application.job.salary)}
                </Badge>
              )}
            </div>

            {/* Progress / Status Description */}
            <div className={cn("p-3 rounded-xl border flex gap-3 items-start transition-colors", status.color)}>
                <div className="mt-0.5">
                    <StatusIcon className="h-4 w-4" />
                </div>
                <div className="space-y-0.5">
                    <p className="text-sm font-bold leading-none">{status.label}</p>
                    <p className="text-xs opacity-80">{status.description}</p>
                </div>
            </div>
          </div>

          {/* Footer Timeline */}
          <div className="px-6 py-4 bg-muted/20 border-t flex items-center justify-between mt-auto">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>{formatDate(application.applied_at)}</span>
            </div>
            <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/60">
              {formatRelativeTime(application.applied_at)}
            </span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}