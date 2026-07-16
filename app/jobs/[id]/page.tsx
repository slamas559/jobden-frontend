// app/jobs/[id]/page.tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { JobDetailsDisplay } from '@/components/job/job-details-display';
import { useJob, useBookmarkJob, useRemoveBookmark, useCheckBookmark, useCheckApply } from '@/lib/hooks/use-jobs';
import { useAuth } from '@/lib/hooks/use-auth';
import { Skeleton } from '@/components/ui/skeleton';
import { Bookmark, BookmarkCheck, Send, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PublicJobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = parseInt(params.id as string);

  const { user, isAuthenticated } = useAuth();
  const isEmployer = user?.is_employer === true;

  const { data: job, isLoading } = useJob(jobId);
  // Only look up bookmark/apply status for signed-in job seekers; guests
  // never have one, and there's no need to hit those endpoints for them.
  const { data: isBookmarked } = useCheckBookmark(jobId, isAuthenticated);
  const { data: isApplied } = useCheckApply(jobId, isAuthenticated);
  const bookmarkMutation = useBookmarkJob();
  const removeBookmarkMutation = useRemoveBookmark();

  // Send a signed-out visitor to login, remembering where to bring them
  // back to once they're signed in.
  const requireAuth = (action: () => void, redirectPath?: string) => {
    if (!isAuthenticated) {
      const target = redirectPath || `/jobs/${jobId}`;
      router.push(`/login?redirect=${encodeURIComponent(target)}`);
      return;
    }
    action();
  };

  const handleBookmarkToggle = () => {
    requireAuth(() => {
      if (isBookmarked) {
        removeBookmarkMutation.mutate(jobId);
      } else {
        bookmarkMutation.mutate(jobId);
      }
    });
  };

  const handleApplyClick = () => {
    const applyPath = `/job-seeker/jobs/${jobId}/apply`;
    requireAuth(() => router.push(applyPath), applyPath);
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
            <Link href="/jobs">
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
      <div className="mx-auto">
        <Button variant="ghost" className="mb-6" asChild>
          <Link href="/jobs">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Jobs
          </Link>
        </Button>

        <JobDetailsDisplay
          job={job}
          actions={
            // Employers don't apply/bookmark; everyone else (including
            // guests who aren't signed in yet) sees these actions.
            !isEmployer && (
              <div className="flex flex-col sm:flex-row gap-4">
                {isApplied ? (
                  <Button size="lg" disabled className="flex-1">
                    Already applied
                  </Button>
                ) : (
                  <Button size="lg" className="flex-1" onClick={handleApplyClick}>
                    <Send className="h-5 w-5 mr-2" />
                    Apply Now
                  </Button>
                )}

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
            )
          }
        />
      </div>
    </div>
  );
}
