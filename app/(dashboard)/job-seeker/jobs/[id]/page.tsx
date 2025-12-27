// Example: How to update your job details page to display rich text
// This is an example - adapt to your existing job details page structure

// app/(dashboard)/job-seeker/jobs/[id]/page.tsx (example)
'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { JobDetailsDisplay } from '@/components/job/job-details-display';
import { useJob, useBookmarkJob, useRemoveBookmark, useCheckBookmark } from '@/lib/hooks/use-jobs';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';
import { Bookmark, BookmarkCheck, Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function JobDetailPage() {
  const params = useParams();
  const jobId = parseInt(params.id as string);

  const { data: job, isLoading } = useJob(jobId);
  const { data: isBookmarked } = useCheckBookmark(jobId);
  const bookmarkMutation = useBookmarkJob();
  const removeBookmarkMutation = useRemoveBookmark();

  const handleBookmarkToggle = () => {
    if (isBookmarked) {
      removeBookmarkMutation.mutate(jobId);
    } else {
      bookmarkMutation.mutate(jobId);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-2 md:p-8 space-y-6">
        <Skeleton className="h-12 w-3/4" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="container mx-auto p-2 md:p-8">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Job Not Found</h2>
          <p className="text-muted-foreground mb-6">
            This job posting doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link href="/job-seeker/jobs">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Jobs
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 md:p-8">
      <div className=" mx-auto">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/job-seeker/jobs">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Link>
        </Button>

        <JobDetailsDisplay
          job={job}
          actions={
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href={`/job-seeker/jobs/${job.id}/apply/`} className="w-full">
                <Button
                  size="lg"
                  className="flex-1"
                >
                  <Send className="h-5 w-5 mr-2" />
                  Apply Now
                </Button>
              </Link>

              <Button
                variant={isBookmarked ? 'default' : 'outline'}
                size="lg"
                onClick={handleBookmarkToggle}
              >
                {isBookmarked ? (
                  <>
                    <BookmarkCheck className="h-5 w-5 mr-2" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="h-5 w-5 mr-2" />
                    Save Job
                  </>
                )}
              </Button>
            </div>
          }
        />
      </div>
    </div>
  );
}

// ===========================================
// Alternative: Update your existing JobDetails component
// ===========================================

// If you already have a JobDetails component in your jobs page,
// update the description rendering from:

// OLD (plain text):
// <p className="text-sm text-muted-foreground">
//   {job.description}
// </p>
// NEW (rich text):
// <div 
//  className="prose prose-sm max-w-none dark:prose-invert"
//  dangerouslySetInnerHTML={{ __html: job.description }}
// />

// ===========================================
// For job cards/previews, use truncated plain text:
// ===========================================

import { getPlainTextFromHTML } from '@/components/job/job-details-display';

function JobCard({ job }: { job: any }) {
  const plainDescription = getPlainTextFromHTML(job.description);
  const preview = plainDescription.substring(0, 150) + '...';

  return (
    <Card>
      <CardContent>
        <h3>{job.title}</h3>
        <p className="text-sm text-muted-foreground">{preview}</p>
      </CardContent>
    </Card>
  );
}