'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useJob } from '@/lib/hooks/use-jobs';
import { applicationService } from '@/lib/api/application-service';
import type { CustomQuestion } from '@/lib/types/application-questions';
import { toast } from 'sonner';

export default function JobApplyPage() {
  const router = useRouter();
  const params = useParams() as { id?: string };
  const jobId = Number(params?.id || 0);

  const { data: job, isLoading } = useJob(jobId);

  const [coverLetter, setCoverLetter] = useState<string>('');
  const [answers, setAnswers] = useState<import('@/lib/types/application-questions').QuestionAnswer[]>([]);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [portfolioFiles, setPortfolioFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
  if (!job?.custom_questions || !Array.isArray(job.custom_questions)) return;

    setAnswers(
        job.custom_questions.map((q) => ({
        question_id: String(q.id),
        question: q.question ?? '',
        answer: '',
        }))
    );
    }, [job]);

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => prev.map((a) => (a.question_id === questionId ? { ...a, answer: value } : a)));
  };

  const handleSubmit = async () => {
    if (!job) return;
    setSubmitting(true);

    try {
      const payload = {
        job_id: job.id,
        cover_letter: coverLetter || undefined,
        question_answers: answers,
      };

      const application = await applicationService.createApplication(payload);

      // Upload files if provided
      if (resumeFile) {
        await applicationService.uploadDocument(application.id, 'resume', resumeFile);
      }
      for (const f of portfolioFiles) {
        await applicationService.uploadDocument(application.id, 'portfolio', f);
      }

      toast.success('Application submitted');
      router.push(`/job-seeker/jobs/${job.id}`);
    } catch (err: any) {
      console.error(err);
      toast.error(err?.message || 'Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !job) {
    return (
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent>
            <p>Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Apply: {job.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* <div>
            <Label>Cover Letter</Label>
            <Textarea value={coverLetter} onChange={(e) => setCoverLetter(e.target.value)} placeholder="Write a short cover letter (optional)" />
          </div> */}

          {job.custom_questions && job.custom_questions.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-semibold">Application Questions</h3>
              {job.custom_questions.map((q: CustomQuestion) => (
                <div key={q.id}>
                  <Label className="mb-1">{q.question} {q.required && <span className="text-destructive">*</span>}</Label>
                  {q.type === 'short_answer' && (
                    <Input value={answers.find(a => a.question_id === q.id)?.answer || ''} onChange={(e) => handleAnswerChange(q.id, e.target.value)} />
                  )}
                  {q.type === 'long_answer' && (
                    <Textarea value={answers.find(a => a.question_id === q.id)?.answer || ''} onChange={(e) => handleAnswerChange(q.id, e.target.value)} rows={4} />
                  )}
                  {q.type === 'multiple_choice' && (
                    <div className="space-y-2">
                      {q.options?.map((opt: string) => (
                        <label key={opt} className="flex items-center gap-2">
                          <input type="radio" name={`q-${q.id}`} value={opt} checked={answers.find(a => a.question_id === q.id)?.answer === opt} onChange={(e) => handleAnswerChange(q.id, e.target.value)} />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {q.type === 'yes_no' && (
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2">
                        <input type="radio" name={`q-${q.id}`} value="yes" checked={answers.find(a => a.question_id === q.id)?.answer === 'yes'} onChange={(e) => handleAnswerChange(q.id, e.target.value)} />
                        Yes
                      </label>
                      <label className="flex items-center gap-2">
                        <input type="radio" name={`q-${q.id}`} value="no" checked={answers.find(a => a.question_id === q.id)?.answer === 'no'} onChange={(e) => handleAnswerChange(q.id, e.target.value)} />
                        No
                      </label>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          <div className="space-y-2">
            <Label>Resume (PDF or DOC)</Label>
            <input type="file" accept=".pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => setResumeFile(e.target.files?.[0] ?? null)} />
          </div>

          {/* <div className="space-y-2">
            <Label>Portfolio (optional)</Label>
            <input type="file" multiple onChange={(e) => setPortfolioFiles(Array.from(e.target.files || []))} />
          </div> */}

          <div className="flex justify-end">
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
