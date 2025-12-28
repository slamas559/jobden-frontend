// app/(dashboard)/job-seeker/jobs/page.tsx
// COMPLETE FILE - Replace your entire file with this

'use client';

import { useState, useEffect, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ArrowLeftCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription 
} from '@/components/ui/sheet';
import { useJobs, useBookmarkJob, useRemoveBookmark, useCheckBookmark, useCheckApply } from '@/lib/hooks/use-jobs';
import { formatRelativeTime, formatCurrency } from '@/lib/utils/format';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/lib/hooks/use-auth';
import Link from 'next/link';
import { useEmployerProfileById } from '@/lib/hooks/use-employer';

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
  const [isMobileOpen, setIsMobileOpen] = useState(false);
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

  const bookmarkMutation = useBookmarkJob();
  const removeBookmarkMutation = useRemoveBookmark();

  // Don't auto-select on desktop - let user choose
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

  const onJobClick = (jobId: number) => {
    setSelectedJobId(jobId);
    if (window.innerWidth < 1024) {
      setIsMobileOpen(true);
    }
  };

  const goBack = () => {
    setSelectedJobId(null);
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

      {/* Split View - Modified Layout */}
      <div className={`grid ${selectedJobId ? 'lg:grid-cols-[520px_1fr]' : 'lg:grid-cols-1'} items-start gap-6 p-2 md:p-6 pb-0 transition-all duration-300`}>
        {/* Job List (Left Side - 3 Column Grid on Desktop, Single Column when job selected) */}
        <div className="space-y-4">
          <div className={`grid grid-cols-1 ${selectedJobId ? 'lg:grid-cols-1' : 'lg:grid-cols-3'} gap-4`}>
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
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
                  onClick={() => onJobClick(job.id)}
                  onBookmarkToggle={handleBookmarkToggle}
                />
              ))
            ) : (
              <div className="col-span-full text-center py-12">
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

        {/* Job Details (Right Side - Desktop Only - Shows only when job is selected) */}
        {selectedJobId && (
          <div className="hidden lg:block sticky top-17 h-[calc(100vh-3rem)]">
            <AnimatePresence mode="wait">
              {selectedJob && (
                <motion.div
                  key="job-details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full border bg-card overflow-y-scroll custom-scrollbar rounded-lg overflow-hidden scrollbar-green-500 shadow-sm"
                >
                  <JobDetails job={selectedJob} isMobile={false} onClick={() => goBack()} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Mobile Details Drawer (Bottom Sheet) with Enhanced Animation */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent 
          side="bottom" 
          className="h-[90vh] p-0 rounded-t-xl"
        >
          <SheetHeader className="p-4 border-b sr-only">
            <SheetTitle>Job Details</SheetTitle>
            <SheetDescription>Viewing details for {selectedJob?.title}</SheetDescription>
          </SheetHeader>
          <JobDetails job={selectedJob} isMobile={true} onClick={() => goBack()} />
        </SheetContent>
      </Sheet>
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
  const employerProfile = useEmployerProfileById(job.employer_id);
  const plainDescription = stripHtml(job.description);
  const descriptionPreview = plainDescription.length > 100 
    ? plainDescription.substring(0, 150) + '...'
    : plainDescription;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={`cursor-pointer transition-all hover:shadow-md h-full ${
          isSelected ? 'ring-2 ring-primary bg-accent' : ''
        }`}
        onClick={onClick}
      >
        <CardContent className="p-4 flex flex-col h-full">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold line-clamp-1">{job.title}</h3>
              <p className="text-sm text-muted-foreground truncate">{employerProfile?.data?.company_name || 'Company Name'}</p>
            </div>
            {isJobSeeker && (
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0"
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

          <p className="text-sm text-muted-foreground line-clamp-2 flex-1">
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
function JobDetails({ job, isMobile, onClick }: { job: any; isMobile: boolean; onClick: () => void }) {
  const { data: isBookmarked } = useCheckBookmark(job.id);
  const { data: isApplied } = useCheckApply(job.id);
  const bookmarkMutation = useBookmarkJob();
  const removeBookmarkMutation = useRemoveBookmark();
  const { user } = useAuth();
  const employerProfile = useEmployerProfileById(job.employer_id);

  const isJobSeeker = user?.is_employer === false;

  const handleBookmarkToggle = () => {
    if (isBookmarked) {
      removeBookmarkMutation.mutate(job.id);
    } else {
      bookmarkMutation.mutate(job.id);
    }
  };


  if (isMobile) {
    return (
      <div className="flex flex-col h-full relative">
        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 pb-32">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground text-sm">
                <Building2 className="h-4 w-4" />
                <span>{ employerProfile?.data?.company_name || "Company Name" }</span>
                <span>•</span>
                <Clock className="h-4 w-4" />
                <span>{formatRelativeTime(job.created_at)}</span>
              </div>
            </div>

            {/* Job Info */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              {job.location && (
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <MapPin className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-medium text-sm">{job.location}</p>
                  </div>
                </div>
              )}
              {job.job_type && (
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Briefcase className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Job Type</p>
                    <p className="font-medium text-sm">{job.job_type}</p>
                  </div>
                </div>
              )}
              {job.salary && (
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <DollarSign className="h-4 w-4 text-indigo-600" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Salary</p>
                    <p className="font-medium text-sm">{formatCurrency(job.salary)}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-3">About the Role</h2>
              <div 
                className="prose prose-sm max-w-none dark:prose-invert editor-output"
                dangerouslySetInnerHTML={{ __html: job.description }}
              />
            </div>

            {/* Requirements */}
            {job.requirements && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-3">Requirements</h2>
                <div 
                  className="prose prose-sm max-w-none dark:prose-invert editor-output"
                  dangerouslySetInnerHTML={{ __html: job.requirements }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Fade Effect */}
        <div className="absolute bottom-[50px] left-0 right-0 h-20 bg-gradient-to-t from-background via-background/80 to-transparent pointer-events-none z-10" />

        {/* Sticky Button Container */}
        <div className="sticky bottom-0 bg-background border-t p-4 flex gap-3 z-20">
          {isJobSeeker && (
            <>
              <Button
                variant={isBookmarked ? 'default' : 'outline'}
                onClick={handleBookmarkToggle}
                size="icon"
                className="shrink-0"
              >
                {isBookmarked ? (
                  <BookmarkCheck className="h-4 w-4" />
                ) : (
                  <Bookmark className="h-4 w-4" />
                )}
              </Button>
              {isApplied ? (
                <Button size="lg" disabled className="flex-1">Already applied</Button>
              ) : (
                <Link href={`/job-seeker/jobs/${job.id}/apply`} className="flex-1">
                  <Button size="lg" className="w-full">Apply Now</Button>
                </Link>
              )}
            </>
          )}
          <Link href={`/job-seeker/jobs/${job.id}`} className={isJobSeeker ? "flex-1" : "w-full"}>
            <Button variant="outline" size="lg" className="w-full">Full Details</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Desktop version
  return (
    <ScrollArea className="">
      <div className="p-8">
        <div className="max-w-3xl">
          {/* Header */}
          <div>
            <Button variant="ghost" size="icon-sm" className="p-0 mb-2 cursor-pointer" onClick={onClick}>
              <ArrowLeftCircle className="h-6 w-6" />
            </Button>
          </div>
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Building2 className="h-4 w-4" />
                <span>{ employerProfile?.data?.company_name || "Company Name" }</span>
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

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">About the Role</h2>
            <div 
              className="prose prose-sm max-w-none dark:prose-invert editor-output"
              dangerouslySetInnerHTML={{ __html: job.description }}
            />
          </div>

          {/* Requirements */}
          {job.requirements && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Requirements</h2>
              <div 
                className="prose prose-sm max-w-none dark:prose-invert editor-output"
                dangerouslySetInnerHTML={{ __html: job.requirements }}
              />
            </div>
          )}

          {/* Apply Button - Desktop */}
          <div className="border-t pt-6 flex flex-wrap gap-4">
            {isJobSeeker && (
              isApplied ? (
                <Button size="lg" disabled className="flex-1 sm:flex-none">Already applied</Button>
              ) : (
                <Link href={`/job-seeker/jobs/${job.id}/apply`} className="flex-1 sm:flex-none">
                  <Button size="lg" className="w-full">Apply Now</Button>
                </Link>
              )
            )}
            <Link href={`/job-seeker/jobs/${job.id}`} className="flex-1 sm:flex-none">
              <Button variant="outline" size="lg" className="w-full">Full Details</Button>
            </Link>
          </div>
        </div>
      </div>
    </ScrollArea>
  );
}