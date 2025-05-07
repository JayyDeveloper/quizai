import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, FileText, ChevronRight, Trash2 } from 'lucide-react';
import { calculatePercentage } from '../utils/quizHelpers';
import { useQuiz } from '../context/QuizContext';

interface QuizHistoryItem {
  id: string;
  date: string;
  documentName: string;
  score: number;
  totalQuestions: number;
  questions: any[];
  documentContent: string;
}

const HistoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { setQuestions, setDocumentName, setDocumentContent, setQuizState } = useQuiz();
  const [history, setHistory] = React.useState<QuizHistoryItem[]>(() => {
    const saved = localStorage.getItem('quizHistory');
    return saved ? JSON.parse(saved) : [];
  });

  const clearHistory = () => {
    localStorage.removeItem('quizHistory');
    setHistory([]);
  };

  const handleStartQuiz = (quiz: QuizHistoryItem) => {
    // Ensure quiz.questions is an array before attempting to shuffle
    const questions = Array.isArray(quiz.questions) ? quiz.questions : [];
    
    // Shuffle the questions for a new attempt
    const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5);
    
    // Set up the quiz state
    setQuestions(shuffledQuestions);
    setDocumentName(quiz.documentName);
    setDocumentContent(quiz.documentContent);
    setQuizState('ready');
    
    // Navigate to the quiz page
    navigate('/quiz');
  };

  if (history.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block p-4 bg-slate-100 rounded-full mb-4">
            <Clock className="w-12 h-12 text-slate-600" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-slate-800">No Quiz History</h1>
          <p className="text-slate-600 mb-8">
            You haven't taken any quizzes yet. Start by uploading a document!
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Take Your First Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-slate-800">Quiz History</h1>
          <button
            onClick={clearHistory}
            className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear History
          </button>
        </div>

        <div className="space-y-4">
          {history.map((quiz) => (
            <div
              key={quiz.id}
              className="bg-white rounded-lg shadow-sm border border-slate-200 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg mr-4">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-slate-800">{quiz.documentName}</h3>
                    <p className="text-sm text-slate-500">{quiz.date}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <div className="font-medium text-slate-800">
                      {calculatePercentage(quiz.score, quiz.totalQuestions)}%
                    </div>
                    <div className="text-sm text-slate-500">
                      {quiz.score} / {quiz.totalQuestions}
                    </div>
                  </div>
                  <button
                    onClick={() => handleStartQuiz(quiz)}
                    className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    Retake Quiz
                    <ChevronRight className="w-5 h-5 ml-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoryPage;