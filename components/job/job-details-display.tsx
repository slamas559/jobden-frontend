// components/job/job-details-display.tsx
// Use this component to display job descriptions with rich text formatting

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Briefcase, DollarSign, Calendar, Building2 } from 'lucide-react';
import { formatCurrency, formatRelativeTime } from '@/lib/utils/format';

interface JobDetailsDisplayProps {
  job: {
    id: number;
    title: string;
    description: string;
    location?: string | null;
    salary?: number | null;
    job_type?: string | null;
    requirements?: string | null;
    is_active: boolean;
    created_at: string;
  };
  companyName?: string;
  showActions?: boolean;
  actions?: React.ReactNode;
}

export function JobDetailsDisplay({
  job,
  companyName = 'Company Name',
  showActions = true,
  actions,
}: JobDetailsDisplayProps) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{job.title}</h1>
            <div className="flex items-center gap-2 text-muted-foreground mb-3">
              <Building2 className="h-4 w-4" />
              <span>{companyName}</span>
              <span>•</span>
              <Calendar className="h-4 w-4" />
              <span>Posted {formatRelativeTime(job.created_at)}</span>
            </div>
          </div>
          {job.is_active && (
            <Badge className="bg-green-500">Accepting Applications</Badge>
          )}
        </div>

        {/* Job Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {job.location && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Location</p>
                <p className="text-sm font-medium">{job.location}</p>
              </div>
            </div>
          )}

          {job.job_type && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Briefcase className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Job Type</p>
                <p className="text-sm font-medium">{job.job_type}</p>
              </div>
            </div>
          )}

          {job.salary && (
            <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Salary</p>
                <p className="text-sm font-medium">{formatCurrency(job.salary)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle>About the Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="prose prose-sm max-w-none dark:prose-invert editor-output"
            dangerouslySetInnerHTML={{ __html: job.description }}
          />
        </CardContent>
      </Card>

      {/* Requirements */}
      {job.requirements && (
        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="prose prose-sm max-w-none dark:prose-invert editor-output"
              dangerouslySetInnerHTML={{ __html: job.requirements }}
            />
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {showActions && actions && (
        <Card>
          <CardContent className="p-6">{actions}</CardContent>
        </Card>
      )}
    </div>
  );
}

// Alternative: Simple display without Card wrapper
export function JobDescriptionContent({ html }: { html: string }) {
  return (
    <div
      className="prose prose-sm max-w-none dark:prose-invert editor-output"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// Helper function to strip HTML for plain text preview
export function getPlainTextFromHTML(html: string): string {
  if (typeof window === 'undefined') return html;
  
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

// Helper function to truncate HTML content
export function truncateHTML(html: string, maxLength: number = 200): string {
  const plainText = getPlainTextFromHTML(html);
  if (plainText.length <= maxLength) return html;
  
  return plainText.substring(0, maxLength) + '...';
}