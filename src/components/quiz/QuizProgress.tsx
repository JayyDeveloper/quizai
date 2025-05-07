import React, { useMemo } from 'react';
import { useQuiz } from '../../context/QuizContext';

interface QuizProgressProps {
  currentQuestion: number;
  totalQuestions: number;
}

const QuizProgress: React.FC<QuizProgressProps> = ({ 
  currentQuestion, 
  totalQuestions 
}) => {
  const { questions } = useQuiz();
  
  const progress = useMemo(() => {
    return ((currentQuestion + 1) / totalQuestions) * 100;
  }, [currentQuestion, totalQuestions]);
  
  return (
    <div className="flex flex-col items-end">
      <div className="text-sm text-slate-600 mb-1">
        Question {currentQuestion + 1} of {totalQuestions}
      </div>
      <div className="w-40 h-2 bg-slate-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-purple-600 transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

export default QuizProgress;