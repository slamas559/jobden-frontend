// lib/types/application-questions.ts

export type QuestionType = 'short_answer' | 'long_answer' | 'multiple_choice' | 'yes_no';

export interface CustomQuestion {
  id: string;
  type: QuestionType;
  question: string;
  required: boolean;
  options?: string[]; // For multiple_choice type
}

export interface QuestionAnswer {
  question_id: string;
  question: string;
  answer: string;
}

export interface JobWithQuestions {
  id: number;
  title: string;
  description: string;
  location: string | null;
  salary: number | null;
  job_type: string | null;
  requirements: string | null;
  is_active: boolean;
  created_at: string;
  employer_id: number;
  custom_questions?: CustomQuestion[];
}

export interface ApplicationWithAnswers {
  id: number;
  user_id: number;
  job_id: number;
  cover_letter: string | null;
  status: string;
  applied_at: string;
  updated_at: string;
  question_answers?: QuestionAnswer[];
}