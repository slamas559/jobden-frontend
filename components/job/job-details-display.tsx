'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Calendar, 
  Building2, 
  Clock, 
  CheckCircle2, 
  Share2, 
  Info
} from 'lucide-react';
import { formatCurrency, formatRelativeTime } from '@/lib/utils/format';
import { useEmployerProfileById } from '@/lib/hooks/use-employer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface JobDetailsDisplayProps {
  job: {
    id: number;
    title: string;
    description: string;
    employer_id: number;
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
  showActions = true,
  actions,
}: JobDetailsDisplayProps) {
  const employerProfile = useEmployerProfileById(job.employer_id);
  const company = employerProfile?.data?.company_name || "Company Name";

  return (
    <div className="max-w-7xl mx-auto px-2 py-4 md:py-8">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {job.is_active ? (
                <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-3 py-1">
                  <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
                  Actively Recruiting
                </Badge>
              ) : (
                <Badge variant="outline" className="px-3 py-1 text-muted-foreground">Closed</Badge>
              )}
              <Badge variant="outline" className="px-3 py-1 font-normal bg-background/50 backdrop-blur-sm">
                <Clock className="h-3.5 w-3.5 mr-1.5 text-muted-foreground" />
                Posted {formatRelativeTime(job.created_at)}
              </Badge>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-balance">
              {job.title}
            </h1>

            <div className="flex items-center gap-4 text-lg">
              <div className="flex items-center gap-2 font-medium">
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-primary" />
                </div>
                <span>{company}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="rounded-full h-11 w-11 shrink-0">
              <Share2 className="h-4 w-4" />
            </Button>
            {/* Action buttons could also go here for mobile accessibility */}
          </div>
        </div>
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Descriptions */}
        <div className="lg:col-span-8 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="border-none bg-transparent shadow-none">
              <CardHeader className="px-0 pt-0">
                <CardTitle className="text-2xl flex items-center gap-2">
                  Role Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="px-0">
                <div
                  className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-p:text-muted-foreground prose-li:text-muted-foreground"
                  dangerouslySetInnerHTML={{ __html: job.description }}
                />
              </CardContent>
            </Card>
          </motion.div>

          {job.requirements && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="rounded-3xl bg-muted/30 border-none">
                <CardHeader>
                  <CardTitle className="text-2xl">Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="prose prose-md max-w-none dark:prose-invert prose-li:marker:text-primary"
                    dangerouslySetInnerHTML={{ __html: job.requirements }}
                  />
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        {/* Right Column: Sticky Sidebar Info */}
        <aside className="lg:col-span-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="sticky top-24 space-y-6"
          >
            <Card className="rounded-3xl shadow-xl shadow-black/5 overflow-hidden border-primary/10">
              <CardHeader className="bg-primary/5 pb-6">
                <CardTitle className="text-sm uppercase tracking-widest text-primary/70">Job Details</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <SidebarInfoItem 
                  icon={MapPin} 
                  label="Location" 
                  value={job.location || 'Remote'} 
                />
                <SidebarInfoItem 
                  icon={Briefcase} 
                  label="Job Type" 
                  value={job.job_type} 
                />
                <SidebarInfoItem 
                  icon={DollarSign} 
                  label="Estimated Salary" 
                  value={job.salary ? formatCurrency(job.salary) : 'Competitive'} 
                />
                
                {/* Actions Area */}
                {showActions && actions && (
                  <div className="pt-6 border-t border-muted animate-in fade-in zoom-in duration-500">
                    {actions}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Helper Help Card */}
            <div className="p-6 rounded-3xl bg-primary/5 border border-primary/10 flex gap-4">
                <Info className="h-5 w-5 text-primary shrink-0 mt-1" />
                <div className="text-sm">
                    <p className="font-bold mb-1">Application Tips</p>
                    <p className="text-muted-foreground leading-relaxed">
                        Tailor your resume specifically for the requirements mentioned by <strong>{company}</strong> to increase your success rate.
                    </p>
                </div>
            </div>
          </motion.div>
        </aside>
      </div>
    </div>
  );
}

// Sub-component for Sidebar Items to keep it clean
function SidebarInfoItem({ icon: Icon, label, value }: { icon: any, label: string, value?: string | null }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-4">
      <div className="h-10 w-10 rounded-full bg-background border flex items-center justify-center shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="space-y-0.5">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="font-semibold text-foreground">{value}</p>
      </div>
    </div>
  );
}

// Maintaining original helper exports
export function JobDescriptionContent({ html }: { html: string }) {
  return (
    <div
      className="prose prose-sm max-w-none dark:prose-invert editor-output"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function getPlainTextFromHTML(html: string): string {
  if (typeof window === 'undefined') return html;
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

export function truncateHTML(html: string, maxLength: number = 200): string {
  const plainText = getPlainTextFromHTML(html);
  if (plainText.length <= maxLength) return html;
  return plainText.substring(0, maxLength) + '...';
}