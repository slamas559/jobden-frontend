// app/(dashboard)/employer/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  Users,
  TrendingUp,
  Clock,
  Plus,
  Calendar,
  DollarSign,
  MapPin,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useEmployerDashboard, useEmployerJobs } from '@/lib/hooks/use-employer';
import { formatRelativeTime, formatCurrency } from '@/lib/utils/format';

import Link from 'next/link';

  
export function descriptionPreview(job: any): string {
  const stripHtml = (html: string): string => {
  if (typeof window === 'undefined') return html;
    const tmp = document.createElement('DIV');
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || '';
  };

  const plainDescription = stripHtml(job.description);
  const descriptionPreview = plainDescription.length > 100 
    ? plainDescription.substring(0, 100) + '...'
    : plainDescription;
  return descriptionPreview;
}

export default function EmployerDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useEmployerDashboard();
  const { data: recentJobs, isLoading: jobsLoading } = useEmployerJobs({
    skip: 0,
    limit: 5,
  });
  

  // console.log("recentJobs splitted",  recentJobs)
  const statCards = [
    {
      title: 'Total Jobs',
      value: stats?.total_jobs || 0,
      icon: Briefcase,
      color: 'bg-blue-500',
      description: 'All job postings',
    },
    {
      title: 'Active Jobs',
      value: stats?.active_jobs || 0,
      icon: TrendingUp,
      color: 'bg-green-500',
      description: 'Currently accepting applications',
    },
    {
      title: 'Total Applications',
      value: stats?.total_applications || 0,
      icon: Users,
      color: 'bg-purple-500',
      description: 'Across all jobs',
    },
    {
      title: 'Pending Review',
      value: stats?.pending_applications || 0,
      icon: Clock,
      color: 'bg-yellow-500',
      description: 'Awaiting your review',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground">
            Manage your job postings and applicants
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/employer/dashboard/post-job">
            <Plus className="h-5 w-5 mr-2" />
            Post New Job
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))
        ) : (
          statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 ${stat.color} rounded-lg`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {stat.title}
                    </p>
                    <p className="text-3xl font-bold mb-1">{stat.value}</p>
                    <p className="text-xs text-muted-foreground">
                      {stat.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>

      {/* Recent Jobs */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Job Postings</CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/employer/jobs/my-job">View All</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {jobsLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ))}
            </div>
          ) : recentJobs && recentJobs.length > 0 ? (
            <div className="space-y-4">
              {recentJobs[0].map((job) => (
                <motion.div
                  key={job.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="md:flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{job.title}</h3>
                        <Badge
                          variant={job.is_active ? 'default' : 'secondary'}
                        >
                          {job.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
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
                    </div>
                    <div className="flex gap-2 mt-4 md:mt-0">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/employer/jobs/${job.id}`}>
                          <Eye className="h-4 w-4 mr-2" />
                          View
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link
                          href={`/employer/applicants?job_id=${job.id}`}
                        >
                          <Users className="h-4 w-4 mr-2" />
                          Applicants
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {descriptionPreview(job)}
                  </p>
                  
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No jobs posted yet</h3>
              <p className="text-muted-foreground mb-4">
                Start by posting your first job opening
              </p>
              <Button asChild>
                <Link href="/employer/dashboard/post-job">
                  <Plus className="h-4 w-4 mr-2" />
                  Post a Job
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/employer/dashboard/post-job">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500 rounded-lg">
                  <Plus className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Post New Job</p>
                  <p className="text-sm text-muted-foreground">
                    Create a new job posting
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/employer/dashboard/applicants">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-500 rounded-lg">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold">View Applicants</p>
                  <p className="text-sm text-muted-foreground">
                    Review all applications
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href="/employer/dashboard/profile">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-500 rounded-lg">
                  <Briefcase className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="font-semibold">Company Profile</p>
                  <p className="text-sm text-muted-foreground">
                    Update company details
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}