import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, FileText, HelpCircle, AlertCircle } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import MultipleChoiceQuestion from '../components/quiz/MultipleChoiceQuestion';
import TrueFalseQuestion from '../components/quiz/TrueFalseQuestion';
import QuizProgress from '../components/quiz/QuizProgress';
import QuizCompletionModal from '../components/quiz/QuizCompletionModal';

const QuizPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    quizState, 
    questions = [], 
    currentQuestion = 0,
    score = 0,
    documentName = 'Untitled Document',
    nextQuestion, 
    prevQuestion,
    setQuizState,
  } = useQuiz();
  
  const [showHint, setShowHint] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  
  // Redirect to upload page if no quiz is active
  useEffect(() => {
    if ((quizState === 'idle' || !questions || questions.length === 0) && quizState !== 'generating') {
      navigate('/upload');
      return;
    }
    
    if (quizState === 'ready') {
      setQuizState('in-progress');
    }
  }, [quizState, questions, navigate, setQuizState]);

  useEffect(() => {
    if (quizState === 'completed' && questions.length > 0) {
      // Save quiz to history
      const quizHistory = JSON.parse(localStorage.getItem('quizHistory') || '[]');
      quizHistory.unshift({
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        documentName,
        score,
        totalQuestions: questions.length,
        questions,
        documentContent: localStorage.getItem('savedQuiz') 
          ? JSON.parse(localStorage.getItem('savedQuiz')!).documentContent 
          : ''
      });
      localStorage.setItem('quizHistory', JSON.stringify(quizHistory));
      
      setShowCompletionModal(true);
    }
  }, [quizState, documentName, score, questions]);
  
  if (quizState === 'generating') {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-block mb-6 rounded-full bg-blue-100 p-3">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <h1 className="text-2xl font-bold mb-4 text-slate-800">Generating Your Quiz</h1>
          <p className="text-slate-600">
            Our AI is analyzing your document and creating personalized questions...
          </p>
        </div>
      </div>
    );
  }
  
  // Return early if no questions are available
  if (!questions || questions.length === 0 || currentQuestion >= questions.length) {
    return null;
  }
  
  const question = questions[currentQuestion];
  if (!question) {
    navigate('/upload');
    return null;
  }

  const isFirstQuestion = currentQuestion === 0;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const hasAnswered = question.userAnswer !== undefined;
  
  const renderQuestionComponent = () => {
    switch (question.type) {
      case 'multiple-choice':
        return <MultipleChoiceQuestion question={question} questionIndex={currentQuestion} />;
      case 'true-false':
        return <TrueFalseQuestion question={question} questionIndex={currentQuestion} />;
      default:
        return null;
    }
  };

  const handleFinishQuiz = () => {
    setQuizState('completed');
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <FileText className="w-5 h-5 text-purple-600 mr-2" />
            <h2 className="text-lg font-medium text-slate-700 truncate max-w-[200px] md:max-w-sm">
              {documentName}
            </h2>
          </div>
          <QuizProgress 
            currentQuestion={currentQuestion} 
            totalQuestions={questions.length} 
          />
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <div className="bg-purple-50 px-6 py-4 border-b border-purple-100">
            <div className="flex justify-between items-center">
              <h3 className="text-slate-700 font-medium">
                Question {currentQuestion + 1} of {questions.length}
              </h3>
              <button
                onClick={() => setShowHint(!showHint)}
                className="text-purple-600 hover:text-purple-800 transition-colors"
                aria-label="Toggle hint"
              >
                <HelpCircle className="w-5 h-5" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            {renderQuestionComponent()}
            
            {showHint && question.explanation && (
              <div className="mt-4 bg-blue-50 p-4 rounded-md">
                <div className="flex items-start">
                  <AlertCircle className="w-5 h-5 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-blue-800 mb-1">Hint</p>
                    <p className="text-sm text-blue-700">
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-between">
          <button
            onClick={prevQuestion}
            disabled={isFirstQuestion}
            className={`flex items-center px-4 py-2 rounded-md transition-all ${
              isFirstQuestion
                ? 'text-slate-400 cursor-not-allowed'
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            Previous
          </button>
          
          {isLastQuestion ? (
            <button
              onClick={handleFinishQuiz}
              disabled={!hasAnswered}
              className={`flex items-center px-6 py-2 rounded-md transition-all ${
                hasAnswered
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-purple-200 text-purple-700 cursor-not-allowed'
              }`}
            >
              Finish Quiz
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              disabled={!hasAnswered}
              className={`flex items-center px-4 py-2 rounded-md transition-all ${
                hasAnswered
                  ? 'bg-purple-600 text-white hover:bg-purple-700'
                  : 'bg-purple-200 text-purple-700 cursor-not-allowed'
              }`}
            >
              Next Question
              <ChevronRight className="w-5 h-5 ml-1" />
            </button>
          )}
        </div>
      </div>

      <QuizCompletionModal 
        isOpen={showCompletionModal}
        onClose={() => setShowCompletionModal(false)}
      />
    </div>
  );
};

export default QuizPage;