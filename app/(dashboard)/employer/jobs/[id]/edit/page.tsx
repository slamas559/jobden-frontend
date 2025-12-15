// app/(dashboard)/employer/jobs/[id]/edit/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Briefcase,
  MapPin,
  DollarSign,
  Clock,
  Save,
  Eye,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface JobFormData {
  title: string;
  description: string;
  requirements: string;
  location: string;
  job_type: string;
  salary: string;
  experience_level: string;
  is_remote: boolean;
  is_active: boolean;
  application_deadline: string;
}

export default function EditJobPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = parseInt(params.id as string);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState<JobFormData>({
    title: '',
    description: '',
    requirements: '',
    location: '',
    job_type: 'full-time',
    salary: '',
    experience_level: 'mid-level',
    is_remote: false,
    is_active: true,
    application_deadline: '',
  });

  useEffect(() => {
    // Load job data
    const loadJob = async () => {
      try {
        setIsLoading(true);
        // Here you would typically fetch the job data
        // const job = await jobService.getJobById(jobId);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock job data
        setFormData({
          title: 'Senior Software Engineer',
          description: 'We are looking for a talented and passionate developer to join our team...',
          requirements: '• 3+ years of experience in web development\n• Proficiency in React, TypeScript, and Node.js\n• Strong problem-solving skills',
          location: 'San Francisco, CA',
          job_type: 'full-time',
          salary: '$120,000 - $160,000',
          experience_level: 'senior-level',
          is_remote: true,
          is_active: true,
          application_deadline: '2024-12-31',
        });
      } catch (error) {
        toast.error('Failed to load job data');
        router.push('/employer/jobs');
      } finally {
        setIsLoading(false);
      }
    };

    if (jobId) {
      loadJob();
    }
  }, [jobId, router]);

  const handleInputChange = (field: keyof JobFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Here you would typically make an API call to update the job
      // await jobService.updateJob(jobId, formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Job updated successfully!');
      router.push(`/employer/jobs/${jobId}`);
    } catch (error) {
      toast.error('Failed to update job. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    return formData.title.trim() && 
           formData.description.trim() && 
           formData.location.trim() && 
           formData.salary.trim();
  };

  if (isLoading) {
    return <EditJobSkeleton />;
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold mb-2">Edit Job</h1>
          <p className="text-muted-foreground">
            Update your job posting information
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Job Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Job Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g. Senior Software Engineer"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  placeholder="e.g. San Francisco, CA or Remote"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="job_type">Job Type *</Label>
                <Select 
                  value={formData.job_type} 
                  onValueChange={(value) => handleInputChange('job_type', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                    <SelectItem value="freelance">Freelance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="experience_level">Experience Level</Label>
                <Select 
                  value={formData.experience_level} 
                  onValueChange={(value) => handleInputChange('experience_level', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry-level">Entry Level</SelectItem>
                    <SelectItem value="mid-level">Mid Level</SelectItem>
                    <SelectItem value="senior-level">Senior Level</SelectItem>
                    <SelectItem value="lead">Lead/Principal</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary">Salary Range *</Label>
                <Input
                  id="salary"
                  placeholder="e.g. $80,000 - $120,000"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="deadline">Application Deadline</Label>
                <Input
                  id="deadline"
                  type="date"
                  value={formData.application_deadline}
                  onChange={(e) => handleInputChange('application_deadline', e.target.value)}
                />
              </div>
            </div>

            {/* Job Options */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="remote">Remote Work</Label>
                  <p className="text-sm text-muted-foreground">
                    Allow remote work options
                  </p>
                </div>
                <Switch
                  id="remote"
                  checked={formData.is_remote}
                  onCheckedChange={(checked) => handleInputChange('is_remote', checked)}
                />
              </div>

              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <Label htmlFor="active">Active Listing</Label>
                  <p className="text-sm text-muted-foreground">
                    Make job visible to candidates
                  </p>
                </div>
                <Switch
                  id="active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => handleInputChange('is_active', checked)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Job Description */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Job Description
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe the role, responsibilities, and what makes this opportunity exciting..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={8}
                required
              />
              <p className="text-xs text-muted-foreground">
                Be detailed and engaging. This is what candidates will read first.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements & Qualifications</Label>
              <Textarea
                id="requirements"
                placeholder="List the required skills, experience, education, and qualifications..."
                value={formData.requirements}
                onChange={(e) => handleInputChange('requirements', e.target.value)}
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                Include both required and preferred qualifications.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Current Status */}
        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Status:</span>
                <Badge variant={formData.is_active ? 'default' : 'secondary'}>
                  {formData.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Job Type:</span>
                <Badge variant="outline">{formData.job_type}</Badge>
              </div>
              {formData.is_remote && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Work Mode:</span>
                  <Badge variant="secondary">Remote</Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => window.open(`/jobs/${jobId}`, '_blank')}
              disabled={isSubmitting}
            >
              <Eye className="h-4 w-4 mr-2" />
              View Job
            </Button>
            
            <Button
              type="submit"
              disabled={!isFormValid() || isSubmitting}
              className="min-w-[120px]"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Update Job
                </>
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}

// Skeleton component for loading state
function EditJobSkeleton() {
  return (
    <div className="container mx-auto p-6 max-w-4xl space-y-6">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded border" />
        <div className="space-y-2">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-4 w-96 bg-muted rounded" />
        </div>
      </div>

      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <div className="h-6 w-32 bg-muted rounded" />
          <div className="space-y-4">
            <div className="grid gap-6 md:grid-cols-2">
              {Array.from({ length: 6 }).map((_, j) => (
                <div key={j} className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded" />
                  <div className="h-10 w-full bg-muted rounded" />
                </div>
              ))}
            </div>
            <div className="space-y-2">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-32 w-full bg-muted rounded" />
            </div>
          </div>
        </div>
      ))}

      <div className="flex justify-between pt-6 border-t">
        <div className="h-10 w-24 bg-muted rounded" />
        <div className="h-10 w-32 bg-muted rounded" />
      </div>
    </div>
  );
}