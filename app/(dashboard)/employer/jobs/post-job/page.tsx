// app/(dashboard)/employer/dashboard/post-job/page.tsx
'use client';

import { useState } from 'react';
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Briefcase, Loader2, Eye } from 'lucide-react';
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
// import CustomQuestionsEditor from '@/components/employer/custom-question-editor';
import CustomQuestionsEditor, { Question } from '@/components/employer/custom-question-editor';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { useCreateJob } from '@/lib/hooks/use-employer';
import Link from 'next/link';

const jobSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(50, 'Description must be at least 50 characters'),
  location: z.string().optional(),
  salary: z.string().optional(),
  job_type: z.string().optional(),
  requirements: z.string().optional(),
  is_active: z.boolean(),
});

type JobFormData = z.infer<typeof jobSchema>;

// Helper function to strip HTML tags for preview
const stripHtml = (html: string) => {
  const tmp = document.createElement('DIV');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export default function PostJobPage() {
  const router = useRouter();
  const createJobMutation = useCreateJob();
  const [previewMode, setPreviewMode] = useState(false);
  const [customQuestions, setCustomQuestions] = useState<Question[]>([]);
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<JobFormData>({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      is_active: true,
    },
  });

  const jobType = watch('job_type');
  const isActive = watch('is_active');
  const description = watch('description');
  const requirements = watch('requirements');
  const title = watch('title');
  const location = watch('location');
  const salary = watch('salary');

  const onSubmit: SubmitHandler<JobFormData> = (data) => {
    createJobMutation.mutate(
      {
        ...data,
        custom_questions: customQuestions,
        salary: data.salary ? parseFloat(data.salary) : undefined,
      },
      {
        onSuccess: () => {
          router.push('/employer/jobs');
        },
      }
    );
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/employer/dashboard">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Post a New Job</h1>
          <p className="text-muted-foreground">
            Fill in the details to create a new job posting
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs value={previewMode ? 'preview' : 'edit'} onValueChange={(v) => setPreviewMode(v === 'preview')}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="edit">
              <Briefcase className="h-5 w-4 mr-2" />
              Edit
            </TabsTrigger>
            <TabsTrigger value="preview">
              <Eye className="h-5 w-4 mr-2" />
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="edit">
            <Card>
              <CardHeader>
                <CardTitle>Job Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Job Title */}
                <div className="space-y-2">
                  <Label htmlFor="title">
                    Job Title <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="title"
                    placeholder="e.g., Senior Software Engineer"
                    {...register('title')}
                    disabled={createJobMutation.isPending}
                  />
                  {errors.title && (
                    <p className="text-sm text-destructive">{errors.title.message}</p>
                  )}
                </div>

                {/* Job Description with Rich Text Editor */}
                <Controller
                  name="description"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      label="Job Description"
                      required
                      value={field.value || ''}
                      onChange={field.onChange}
                      placeholder="Provide a detailed description of the role, responsibilities, and what you're looking for..."
                      disabled={createJobMutation.isPending}
                      error={errors.description?.message}
                    />
                  )}
                />

                {/* Location */}
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="e.g., New York, NY or Remote"
                    {...register('location')}
                    disabled={createJobMutation.isPending}
                  />
                  {errors.location && (
                    <p className="text-sm text-destructive">
                      {errors.location.message}
                    </p>
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  {/* Job Type */}
                  <div className="space-y-2">
                    <Label htmlFor="job_type">Job Type</Label>
                    <Select
                      value={jobType}
                      onValueChange={(value) => setValue('job_type', value)}
                      disabled={createJobMutation.isPending}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Internship">Internship</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Salary */}
                  <div className="space-y-2">
                    <Label htmlFor="salary">Salary (Annual)</Label>
                    <Input
                      id="salary"
                      type="number"
                      placeholder="e.g., 75000"
                      {...register('salary')}
                      disabled={createJobMutation.isPending}
                    />
                    {errors.salary && (
                      <p className="text-sm text-destructive">
                        {errors.salary.message}
                      </p>
                    )}
                  </div>
                </div>

                {/* Requirements with Rich Text Editor */}
                <Controller
                  name="requirements"
                  control={control}
                  render={({ field }) => (
                    <RichTextEditor
                      label="Requirements"
                      value={field.value || ''}
                      onChange={field.onChange}
                      placeholder="List the key requirements, qualifications, and skills needed for this role..."
                      disabled={createJobMutation.isPending}
                      error={errors.requirements?.message}
                    />
                  )}
                />

                <CustomQuestionsEditor 
                  questions={customQuestions}                  
                  onChange={setCustomQuestions}
                />

                {/* Active Toggle */}
                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <Label>Post as Active</Label>
                    <p className="text-sm text-muted-foreground">
                      Active jobs will accept applications immediately
                    </p>
                  </div>
                  <Switch
                    checked={isActive}
                    onCheckedChange={(checked) => setValue('is_active', checked)}
                    disabled={createJobMutation.isPending}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => router.back()}
                    disabled={createJobMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={createJobMutation.isPending}
                  >
                    {createJobMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Posting...
                      </>
                    ) : (
                      <>
                        <Briefcase className="mr-2 h-4 w-4" />
                        Post Job
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview">
            <Card>
              <CardHeader>
                <CardTitle>Job Preview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Preview Header */}
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    {title || 'Job Title'}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-muted-foreground">
                    {location && <span>📍 {location}</span>}
                    {jobType && <span>💼 {jobType}</span>}
                    {salary && <span>💰 ${parseFloat(salary).toLocaleString()}/year</span>}
                  </div>
                </div>

                {/* Preview Description */}
                <div>
                  <h2 className="text-xl font-semibold mb-3">About the Role</h2>
                  {description ? (
                    <div 
                      className="prose prose-sm max-w-none dark:prose-invert editor-output"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  ) : (
                    <p className="text-muted-foreground italic">
                      No description provided yet
                    </p>
                  )}
                </div>

                {/* Preview Requirements */}
                {requirements && (
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Requirements</h2>
                    <div 
                      className="prose prose-sm max-w-none dark:prose-invert editor-output"
                      dangerouslySetInnerHTML={{ __html: requirements }}
                    />
                  </div>
                )}

                {/* Preview Actions */}
                <div className="pt-6 border-t">
                  <Button size="lg" disabled>
                    Apply for this position
                  </Button>
                  <p className="text-xs text-muted-foreground mt-2">
                    This is a preview. Job seekers will see a similar view.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}