import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Home, Upload, History } from 'lucide-react';
import { useQuiz } from '../../context/QuizContext';

const Header: React.FC = () => {
  const location = useLocation();
  const { quizState } = useQuiz();
  
  return (
    <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-purple-700 transition-all hover:text-purple-800"
          >
            <Brain className="w-8 h-8" />
            <span className="font-bold text-xl">QuizAI</span>
          </Link>
          
          <nav className="flex items-center space-x-1 md:space-x-4">
            <Link 
              to="/" 
              className={`p-2 rounded-full transition-all flex items-center justify-center ${
                location.pathname === '/' 
                  ? 'text-purple-700 bg-purple-100' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              aria-label="Home"
            >
              <Home className="w-5 h-5" />
              <span className="hidden md:inline ml-1">Home</span>
            </Link>
            
            <Link 
              to="/upload" 
              className={`p-2 rounded-full transition-all flex items-center justify-center ${
                location.pathname === '/upload' 
                  ? 'text-purple-700 bg-purple-100' 
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              aria-label="Upload"
            >
              <Upload className="w-5 h-5" />
              <span className="hidden md:inline ml-1">Upload</span>
            </Link>
            
            <Link 
              to="/history" 
              className={`p-2 rounded-full transition-all flex items-center justify-center ${
                location.pathname === '/history'
                  ? 'text-purple-700 bg-purple-100'
                  : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
              aria-label="Quizzes"
            >
              <History className="w-5 h-5" />
              <span className="hidden md:inline ml-1">Quizzes</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;