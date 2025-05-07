import React from 'react';
import { Check, Circle } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { Question } from '../../types';

interface MultipleChoiceQuestionProps {
  question: Question;
  questionIndex: number;
}

const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionProps> = ({ 
  question,
  questionIndex
}) => {
  const { questions, setQuestions, setScore } = useQuiz();
  
  if (!question || !question.options) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">Question data is not properly loaded.</p>
      </div>
    );
  }
  
  const handleOptionSelect = (option: string) => {
    const updatedQuestions = [...questions];
    
    // If there was a previous answer, handle score adjustment
    if (question.userAnswer !== undefined) {
      if (question.userAnswer === question.correctAnswer) {
        setScore(prevScore => prevScore - 1); // Remove point for previous correct answer
      }
    }
    
    // Update the question with the new answer
    updatedQuestions[questionIndex] = {
      ...question,
      userAnswer: option
    };
    setQuestions(updatedQuestions);

    // Add point if new answer is correct
    if (option === question.correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-slate-800">
        {question.question}
      </h3>
      
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = question.userAnswer === option;
          
          return (
            <button
              key={index}
              onClick={() => handleOptionSelect(option)}
              className={`w-full flex items-center p-4 rounded-lg transition-all ${
                isSelected 
                  ? 'bg-purple-100 border border-purple-300' 
                  : 'bg-slate-50 hover:bg-slate-100 border border-transparent'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                isSelected 
                  ? 'border-purple-500 bg-purple-500 text-white' 
                  : 'border-slate-300 bg-white'
              }`}>
                {isSelected ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Circle className="w-4 h-4 text-transparent" />
                )}
              </div>
              <span className={`ml-3 ${isSelected ? 'font-medium' : ''}`}>
                {option}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MultipleChoiceQuestion;