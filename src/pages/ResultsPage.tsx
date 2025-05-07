import React, { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Award, BarChart2, FileText, RefreshCw, ChevronRight } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { calculatePercentage } from '../utils/quizHelpers';

const ResultsPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    quizState, 
    questions, 
    userAnswers, 
    score,
    documentName,
    resetQuiz 
  } = useQuiz();
  
  useEffect(() => {
    if (quizState !== 'completed') {
      navigate('/');
    }
  }, [quizState, navigate]);
  
  if (quizState !== 'completed' || questions.length === 0) {
    return null;
  }
  
  const percentage = calculatePercentage(score, questions.length);
  
  const getScoreColor = () => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const getScoreMessage = () => {
    if (percentage >= 90) return 'Excellent! You have mastered this material.';
    if (percentage >= 80) return 'Great job! You have a strong understanding of the content.';
    if (percentage >= 70) return 'Good work! You understand most of the content.';
    if (percentage >= 60) return "Not bad. You've grasped some of the key concepts.";
    if (percentage >= 50) return "You're on the right track, but need more practice.";
    return 'You might need to review the material again.';
  };
  
  const handleStartOver = () => {
    resetQuiz();
    navigate('/upload');
  };
  
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="inline-block p-4 bg-purple-100 rounded-full mb-4">
            <Award className="w-12 h-12 text-purple-600" />
          </div>
          <h1 className="text-3xl font-bold mb-2 text-slate-800">Quiz Results</h1>
          <p className="text-lg text-slate-600">
            You've completed the quiz. Here's how you did!
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-8">
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileText className="w-5 h-5 text-purple-600 mr-2" />
                <h2 className="font-medium text-slate-700">{documentName}</h2>
              </div>
              <div className="text-sm text-slate-500">
                {new Date().toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-sm text-purple-700 mb-1">Score</div>
                <div className={`text-3xl font-bold ${getScoreColor()}`}>
                  {score}/{questions.length}
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-blue-700 mb-1">Percentage</div>
                <div className={`text-3xl font-bold ${getScoreColor()}`}>
                  {percentage}%
                </div>
              </div>
              
              <div className="bg-teal-50 p-4 rounded-lg">
                <div className="text-sm text-teal-700 mb-1">Questions</div>
                <div className="text-3xl font-bold text-teal-700">
                  {questions.length}
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <h3 className="font-medium text-slate-800 mb-2">Performance Assessment</h3>
              <p className="text-slate-600">{getScoreMessage()}</p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg">
              <div className="flex items-start">
                <BarChart2 className="w-5 h-5 text-slate-700 mr-2 mt-0.5" />
                <div>
                  <h3 className="font-medium text-slate-800 mb-1">Question Breakdown</h3>
                  <div className="space-y-2 mt-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Multiple Choice</span>
                      <span className="text-sm font-medium text-slate-800">
                        {questions.filter(q => q.type === 'multiple-choice').length} questions
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">True/False</span>
                      <span className="text-sm font-medium text-slate-800">
                        {questions.filter(q => q.type === 'true-false').length} questions
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-slate-600">Fill in the Blank</span>
                      <span className="text-sm font-medium text-slate-800">
                        {questions.filter(q => q.type === 'fill-in-blank').length} questions
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <button
            onClick={handleStartOver}
            className="flex items-center justify-center px-6 py-3 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors flex-1"
          >
            <RefreshCw className="w-5 h-5 mr-2" />
            Start Over with New Document
          </button>
          
          <Link
            to="/"
            className="flex items-center justify-center px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors flex-1"
          >
            Return to Home
            <ChevronRight className="w-5 h-5 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;