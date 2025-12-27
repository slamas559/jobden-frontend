// app/(dashboard)/dashboard/bookmarks/page.tsx
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Bookmark,
  BookmarkX,
  MapPin,
  Briefcase,
  DollarSign,
  Clock,
  Eye,
  Trash2,
  Search,
  SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBookmarks, useDeleteBookmark } from '@/lib/hooks/use-bookmarks';
import { formatRelativeTime, formatCurrency } from '@/lib/utils/format';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

export default function BookmarksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const { data: bookmarks, isLoading } = useBookmarks();
  const deleteBookmarkMutation = useDeleteBookmark();

  // Filter and sort bookmarks
  const filteredBookmarks = bookmarks
    ?.filter((bookmark) => {
      if (!searchQuery) return true;
      const searchLower = searchQuery.toLowerCase();
      return (
        bookmark.job.title.toLowerCase().includes(searchLower) ||
        bookmark.job.location?.toLowerCase().includes(searchLower) ||
        bookmark.job.job_type?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortBy === 'salary') {
        return (b.job.salary || 0) - (a.job.salary || 0);
      }
      return 0;
    });

  const handleRemoveBookmark = (jobId: number) => {
    deleteBookmarkMutation.mutate(jobId);
  };

  return (
    <div className="container mx-auto p-2 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Saved Jobs</h1>
          <p className="text-muted-foreground">
            {bookmarks?.length || 0} job{bookmarks?.length !== 1 ? 's' : ''} saved for later
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-2">
          <Bookmark className="h-8 w-8 text-primary" />
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search saved jobs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={setSortBy}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest First</SelectItem>
            <SelectItem value="oldest">Oldest First</SelectItem>
            <SelectItem value="salary">Highest Salary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Bookmarks Grid */}
      {isLoading ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredBookmarks && filteredBookmarks.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredBookmarks.map((bookmark) => (
            <BookmarkCard
              key={bookmark.id}
              bookmark={bookmark}
              onRemove={handleRemoveBookmark}
            />
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="p-4 bg-muted rounded-full mb-4">
              <BookmarkX className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? 'No matching bookmarks' : 'No saved jobs yet'}
            </h3>
            <p className="text-muted-foreground text-center mb-6 max-w-sm">
              {searchQuery
                ? 'Try adjusting your search to find what you\'re looking for'
                : 'Start bookmarking jobs you\'re interested in to easily find them later'}
            </p>
            {!searchQuery && (
              <Button asChild>
                <Link href="/dashboard/jobs">Browse Jobs</Link>
              </Button>
            )}
            {searchQuery && (
              <Button variant="outline" onClick={() => setSearchQuery('')}>
                Clear Search
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// Bookmark Card Component
function BookmarkCard({
  bookmark,
  onRemove,
}: {
  bookmark: any;
  onRemove: (jobId: number) => void;
}) {
  const job = bookmark.job;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      layout
    >
      <Card className="hover:shadow-lg transition-all h-full">
        <CardContent className="p-6 flex flex-col h-full">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg line-clamp-2 mb-1">{job.title}</h3>
              <p className="text-sm text-muted-foreground">Company Name</p>
            </div>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" size="icon" className="flex-shrink-0 ml-2">
                  <BookmarkX className="h-4 w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Remove Bookmark?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to remove this job from your saved jobs?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onRemove(job.id)}>
                    Remove
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Job Info Badges */}
          <div className="flex flex-wrap gap-2 mb-4">
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

          {/* Description */}
          <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-grow">
            {job.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t mt-auto">
            <div className="flex items-center text-xs text-muted-foreground">
              <Clock className="h-3 w-3 mr-1" />
              Saved {formatRelativeTime(bookmark.created_at)}
            </div>
            <Button asChild size="sm">
              <Link href={`/dashboard/jobs/${job.id}`}>
                <Eye className="h-3 w-3 mr-2" />
                View
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}