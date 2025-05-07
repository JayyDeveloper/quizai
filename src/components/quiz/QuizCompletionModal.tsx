import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, RefreshCw, Home } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';
import { calculatePercentage } from '../../utils/quizHelpers';

interface QuizCompletionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QuizCompletionModal: React.FC<QuizCompletionModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { score, questions, resetQuiz } = useQuiz();
  
  if (!isOpen) return null;
  
  const finalScore = Math.max(0, score);
  const percentage = calculatePercentage(finalScore, questions.length);
  
  const handleRetake = () => {
    resetQuiz();
    navigate('/upload');
  };
  
  const handleViewHistory = () => {
    navigate('/history');
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <div className="text-center">
          <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
            <Trophy className="w-12 h-12 text-purple-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Quiz Completed!</h2>
          <p className="text-slate-600 mb-6">
            You scored {finalScore} out of {questions.length} ({percentage}%)
          </p>
        </div>
        
        <div className="space-y-3">
          <button
            onClick={handleRetake}
            className="w-full flex items-center justify-center px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Take Another Quiz
          </button>
          
          <button
            onClick={handleViewHistory}
            className="w-full flex items-center justify-center px-4 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
          >
            View Quiz History
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center justify-center px-4 py-3 border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Home className="w-5 h-5 mr-2" />
            Return Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizCompletionModal;