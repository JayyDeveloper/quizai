import React, { createContext, useContext, useState, useEffect } from 'react';

interface Question {
  id: string;
  type: string;
  question: string;
  options?: string[];
  correctAnswer: string | boolean;
  userAnswer?: string | boolean;
  explanation?: string;
}

interface QuizContextType {
  questions: Question[];
  setQuestions: (questions: Question[]) => void;
  documentName: string;
  setDocumentName: (name: string) => void;
  documentContent: string;
  setDocumentContent: (content: string) => void;
  quizState: string;
  setQuizState: (state: string) => void;
  score: number;
  setScore: (score: number | ((prev: number) => number)) => void;
  currentQuestion: number;
  setCurrentQuestion: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  loadSavedQuiz: () => boolean;
  resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextType | undefined>(undefined);

export const QuizProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [documentName, setDocumentName] = useState('');
  const [documentContent, setDocumentContent] = useState('');
  const [quizState, setQuizState] = useState('initial');
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);

  useEffect(() => {
    if (questions.length > 0 && documentContent && documentName) {
      localStorage.setItem('savedQuiz', JSON.stringify({
        questions,
        documentName,
        documentContent,
        quizState,
        score: Math.max(0, score),
        currentQuestion
      }));
    }
  }, [questions, documentName, documentContent, quizState, score, currentQuestion]);

  const loadSavedQuiz = (): boolean => {
    const savedQuiz = localStorage.getItem('savedQuiz');
    if (savedQuiz) {
      const { questions: savedQuestions, documentName: savedName, documentContent: savedContent } = JSON.parse(savedQuiz);
      
      const resetQuestions = savedQuestions.map(q => ({
        ...q,
        userAnswer: undefined
      }));
      
      setQuestions(resetQuestions);
      setDocumentName(savedName);
      setDocumentContent(savedContent);
      setScore(0);
      setCurrentQuestion(0);
      setQuizState('ready');
      return true;
    }
    return false;
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (currentQuestion === questions.length - 1) {
      setQuizState('completed');
    }
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const resetQuiz = () => {
    const resetQuestions = questions.map(q => ({
      ...q,
      userAnswer: undefined
    }));
    setQuestions(resetQuestions);
    setScore(0);
    setCurrentQuestion(0);
    setQuizState('ready');
    localStorage.removeItem('savedQuiz');
  };

  const value = {
    questions,
    setQuestions,
    documentName,
    setDocumentName,
    documentContent,
    setDocumentContent,
    quizState,
    setQuizState,
    score,
    setScore: (newScore: number | ((prev: number) => number)) => {
      if (typeof newScore === 'function') {
        setScore(prev => Math.max(0, newScore(prev)));
      } else {
        setScore(Math.max(0, newScore));
      }
    },
    currentQuestion,
    setCurrentQuestion,
    nextQuestion,
    prevQuestion,
    loadSavedQuiz,
    resetQuiz
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
};

export const useQuiz = () => {
  const context = useContext(QuizContext);
  if (context === undefined) {
    throw new Error('useQuiz must be used within a QuizProvider');
  }
  return context;
};