export type QuestionType = 'multiple-choice' | 'true-false';
export type QuizState = 'idle' | 'uploading' | 'processing' | 'generating' | 'ready' | 'in-progress' | 'completed';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | boolean;
  explanation?: string;
}

export interface DocumentData {
  name: string;
  content: string;
  type: string;
  size: number;
}