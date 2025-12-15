// app/(dashboard)/job-seeker/jobs/page.tsx
// COMPLETE FILE - Replace your entire file with this

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Search,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Building2,
  Bookmark,
  BookmarkCheck,
  X,
  Filter,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useJobs, useBookmarkJob, useRemoveBookmark, useCheckBookmark, useCheckApply } from '@/lib/hooks/use-jobs';
import { formatRelativeTime, formatCurrency } from '@/lib/utils/format';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/hooks/use-auth';
import Link from 'next/link';

const ITEMS_PER_PAGE = 10;

// Helper function to strip HTML tags for preview
const stripHtml = (html: string): string => {
  if (typeof window === 'undefined') return html;
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export default function ExplorePage() {
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [jobTypeFilter, setJobTypeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const { user } = useAuth();
  const isJobSeeker = user?.is_employer === false;

  const { data: jobs, isLoading } = useJobs({
    search: searchQuery,
    location: locationFilter,
    job_type: jobTypeFilter,
    skip: currentPage * ITEMS_PER_PAGE,
    limit: ITEMS_PER_PAGE,
  });

  console.log('Jobs data:', jobs);

  const bookmarkMutation = useBookmarkJob();
  const removeBookmarkMutation = useRemoveBookmark();

  // Auto-select first job when jobs load
  useEffect(() => {
    if (jobs && jobs.length > 0 && !selectedJobId) {
      setSelectedJobId(jobs[0].id);
    }
  }, [jobs, selectedJobId]);

  const selectedJob = jobs?.find((job) => job.id === selectedJobId);
  const totalPages = jobs ? Math.ceil(jobs.length / ITEMS_PER_PAGE) : 0;

  const handleBookmarkToggle = (jobId: number, isBookmarked: boolean) => {
    if (isBookmarked) {
      removeBookmarkMutation.mutate(jobId);
    } else {
      bookmarkMutation.mutate(jobId);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(0);
  };

  const clearFilters = () => {
    setSearchQuery('');
    setLocationFilter('');
    setJobTypeFilter('');
    setCurrentPage(0);
  };

  return (
    <div className="min-h-screen"> 
      {/* Header */}
      <div className="border-b bg-card">
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className='space-y-2'>
              <h1 className="text-2xl font-bold">Explore Jobs</h1>
              <p className="text-muted-foreground">
                Discover your next career opportunity
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden"
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
          </div>

          {/* Search and Filters */}
          <div className={`space-y-3 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs by title, company, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit">Search</Button>
            </form>

            <div className="flex flex-wrap gap-2">
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-[180px]">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="Remote">Remote</SelectItem>
                  <SelectItem value="New York">New York</SelectItem>
                  <SelectItem value="San Francisco">San Francisco</SelectItem>
                  <SelectItem value="London">London</SelectItem>
                  <SelectItem value="Lagos">Lagos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={jobTypeFilter} onValueChange={setJobTypeFilter}>
                <SelectTrigger className="w-[180px]">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Full-time">Full-time</SelectItem>
                  <SelectItem value="Part-time">Part-time</SelectItem>
                  <SelectItem value="Contract">Contract</SelectItem>
                  <SelectItem value="Internship">Internship</SelectItem>
                </SelectContent>
              </Select>

              {(searchQuery || locationFilter || jobTypeFilter) && (
                <Button variant="ghost" size="sm" onClick={clearFilters}>
                  <X className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Split View */}
      <div className="grid lg:grid-cols-[500px_1fr] items-start gap-6 p-6 pb-0">
        {/* Job List (Left Side) */}
        <div className="space-y-4">
          <div className="space-y-2">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : jobs && jobs.length > 0 ? (
              jobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isJobSeeker={isJobSeeker}
                  isSelected={selectedJobId === job.id}
                  onClick={() => setSelectedJobId(job.id)}
                  onBookmarkToggle={handleBookmarkToggle}
                />
              ))
            ) : (
              <div className="text-center py-12">
                <Briefcase className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No jobs found</p>
                <Button variant="link" onClick={clearFilters} className="mt-2">
                  Clear filters
                </Button>
              </div>
            )}
          </div>

          {/* Pagination */}
          {jobs && jobs.length > 0 && (
            <div className="border rounded-md p-4 flex items-center justify-between bg-card mt-4">
              <p className="text-sm text-muted-foreground">
                Showing {currentPage * ITEMS_PER_PAGE + 1}-
                {Math.min((currentPage + 1) * ITEMS_PER_PAGE, jobs.length)} of{' '}
                {jobs.length} jobs
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => p + 1)}
                  disabled={currentPage >= totalPages - 1}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Job Details (Right Side) */}
        <div className="hidden lg:block sticky top-17 h-[calc(100vh-3rem)]">
          {selectedJob ? (
            <div className="h-full border bg-card overflow-y-scroll custom-scrollbar rounded-lg overflow-hidden scrollbar-green-500 shadow-sm">
              <JobDetails job={selectedJob} />
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground border bg-card rounded-lg">
              <div className="text-center">
                <Briefcase className="h-16 w-16 mx-auto mb-4 opacity-20" />
                <p>Select a job to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Job Card Component
function JobCard({
  job,
  isSelected,
  isJobSeeker,
  onClick,
  onBookmarkToggle,
}: {
  job: any;
  isSelected: boolean;
  isJobSeeker: boolean;
  onClick: () => void;
  onBookmarkToggle: (jobId: number, isBookmarked: boolean) => void;
}) {
  const { data: isBookmarked } = useCheckBookmark(job.id);  
  // Strip HTML from description for preview
  const plainDescription = stripHtml(job.description);
  const descriptionPreview = plainDescription.length > 100 
    ? plainDescription.substring(0, 100) + '...'
    : plainDescription;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`cursor-pointer transition-all hover:shadow-md ${
          isSelected ? 'ring-2 ring-primary bg-accent' : ''
        }`}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <h3 className="font-semibold line-clamp-1">{job.title}</h3>
              <p className="text-sm text-muted-foreground">Company Name</p>
            </div>
            {isJobSeeker && (
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                  onBookmarkToggle(job.id, isBookmarked || false);
                }}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-4 w-4 fill-primary text-primary" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 mb-2">
            {job.location && (
              <Badge variant="secondary" className="text-xs">
                <MapPin className="h-3 w-3 mr-1" />
                {job.location}
              </Badge>
            )}
            {job.job_type && (
              <Badge variant="secondary" className="text-xs">
                <Briefcase className="h-3 w-3 mr-1" />
                {job.job_type}
              </Badge>
            )}
            {job.salary && (
              <Badge variant="secondary" className="text-xs">
                <DollarSign className="h-3 w-3 mr-1" />
                {formatCurrency(job.salary)}
              </Badge>
            )}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {descriptionPreview}
          </p>

          <p className="text-xs text-muted-foreground mt-2">
            <Clock className="h-3 w-3 inline mr-1" />
            {formatRelativeTime(job.created_at)}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// Job Details Component
function JobDetails({ job }: { job: any }) {
  const { data: isBookmarked } = useCheckBookmark(job.id);
  const { data: isApplied } = useCheckApply(job.id);
  const bookmarkMutation = useBookmarkJob();
  const removeBookmarkMutation = useRemoveBookmark();
  const { user } = useAuth();

  const isJobSeeker = user?.is_employer === false;

  const handleBookmarkToggle = () => {
    if (isBookmarked) {
      removeBookmarkMutation.mutate(job.id);
    } else {
      bookmarkMutation.mutate(job.id);
    }
  };

  return (
    <div className="flex flex-col">
      <ScrollArea className="">
        <motion.div
          key={job.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="p-8"
        >
          <div className="max-w-3xl">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="h-4 w-4" />
                  <span>{job.employer_id?.company_name}</span>
                  <span>•</span>
                  <Clock className="h-4 w-4" />
                  <span>{formatRelativeTime(job.created_at)}</span>
                </div>
              </div>
              
              {isJobSeeker && (
                <Button
                  variant={isBookmarked ? 'default' : 'outline'}
                  onClick={handleBookmarkToggle}
                >
                  {isBookmarked ? (
                    <>
                      <BookmarkCheck className="h-4 w-4 mr-2" />
                      Saved
                    </>
                  ) : (
                    <>
                      <Bookmark className="h-4 w-4 mr-2" />
                      Save Job
                    </>
                  )}
                </Button>
              )}
            </div>

            {/* Job Info */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              {job.location && (
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">{job.location}</p>
                  </div>
                </div>
              )}
              {job.job_type && (
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Briefcase className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Job Type</p>
                    <p className="font-medium">{job.job_type}</p>
                  </div>
                </div>
              )}
              {job.salary && (
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <DollarSign className="h-5 w-5 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Salary</p>
                    <p className="font-medium">{formatCurrency(job.salary)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description - RICH TEXT */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">About the Role</h2>
              <div 
                className="prose prose-sm max-w-none dark:prose-invert editor-output"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>

            {/* Requirements - RICH TEXT */}
            {job.requirements && (
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">Requirements</h2>
                <div 
                  className="prose prose-sm max-w-none dark:prose-invert editor-output"
                  dangerouslySetInnerHTML={{ __html: job.requirements }}
                />
              </div>
            )}

            {/* Apply Button */}
            <div className="flex flex-col sm:flex-row gap-9">
              {isJobSeeker && (
                <div className="pt-6 border-t">
                  {isApplied ? (
                    <Button size="lg" className="w-full sm:w-auto cursor-pointer" disabled>
                      Already applied
                    </Button>
                  ) : (
                    <Link href="" className="w-full">
                      <Button size="lg" className="w-full sm:w-auto cursor-pointer">
                        Apply
                      </Button>
                    </Link>
                  )}
                </div>
              )}

              <div className="pt-6 border-t">
                <Link href={`/job-seeker/jobs/${job.id}`} className="w-full">
                  <Button size="lg" className="w-full bg-white text-gray-900 border border-gray-900 cursor-pointer sm:w-auto hover:bg-gray-100">
                    See More ...
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </ScrollArea>
    </div>
  );
}