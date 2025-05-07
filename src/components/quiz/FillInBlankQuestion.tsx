import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { Question } from '../../types';

interface FillInBlankQuestionProps {
  question: Question;
  questionIndex: number;
}

const FillInBlankQuestion: React.FC<FillInBlankQuestionProps> = ({ 
  question,
  questionIndex
}) => {
  const { userAnswers, answerQuestion } = useQuiz();
  const [inputValue, setInputValue] = useState(userAnswers[questionIndex] as string || '');
  const [isSubmitted, setIsSubmitted] = useState(Boolean(userAnswers[questionIndex]));
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isSubmitted && inputValue.trim()) {
      answerQuestion(inputValue.trim());
      setIsSubmitted(true);
    }
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-slate-800">
        {question.question}
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          disabled={isSubmitted}
          placeholder="Type your answer here"
          className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
            isSubmitted
              ? 'bg-slate-50 border-slate-200 text-slate-500'
              : 'border-slate-300 focus:ring-purple-300 focus:border-purple-500'
          }`}
        />
        
        <button
          type="submit"
          disabled={isSubmitted || !inputValue.trim()}
          className={`flex items-center justify-center px-4 py-2 rounded-md transition-all ${
            isSubmitted
              ? 'bg-green-100 text-green-700 cursor-not-allowed'
              : !inputValue.trim()
              ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
        >
          {isSubmitted ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Submitted
            </>
          ) : (
            'Submit Answer'
          )}
        </button>
      </form>
    </div>
  );
};

export default FillInBlankQuestion;