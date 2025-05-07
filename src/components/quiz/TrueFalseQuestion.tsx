import React from 'react';
import { Check, X } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { Question } from '../../types';

interface TrueFalseQuestionProps {
  question: Question;
  questionIndex: number;
}

const TrueFalseQuestion: React.FC<TrueFalseQuestionProps> = ({ 
  question,
  questionIndex
}) => {
  const { questions, setQuestions, setScore } = useQuiz();
  
  if (!question) {
    return (
      <div className="p-4 bg-red-50 rounded-lg">
        <p className="text-red-600">Question data is not properly loaded.</p>
      </div>
    );
  }
  
  const handleAnswer = (answer: boolean) => {
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
      userAnswer: answer
    };
    setQuestions(updatedQuestions);

    // Add point if new answer is correct
    if (answer === question.correctAnswer) {
      setScore(prevScore => prevScore + 1);
    }
  };
  
  return (
    <div className="space-y-6">
      <h3 className="text-xl font-medium text-slate-800">
        {question.question}
      </h3>
      
      <div className="flex space-x-4">
        <button
          className={`flex-1 flex items-center justify-center p-4 rounded-lg transition-all ${
            question.userAnswer === true
              ? 'bg-green-100 border border-green-300 text-green-700'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-transparent'
          }`}
          onClick={() => handleAnswer(true)}
        >
          <Check className="w-5 h-5 mr-2" />
          <span className="font-medium">True</span>
        </button>
        
        <button
          className={`flex-1 flex items-center justify-center p-4 rounded-lg transition-all ${
            question.userAnswer === false
              ? 'bg-red-100 border border-red-300 text-red-700'
              : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-transparent'
          }`}
          onClick={() => handleAnswer(false)}
        >
          <X className="w-5 h-5 mr-2" />
          <span className="font-medium">False</span>
        </button>
      </div>
    </div>
  );
};

export default TrueFalseQuestion;