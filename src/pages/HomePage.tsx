import React from 'react';
import { Link } from 'react-router-dom';
import { FileUp, Brain, Check, Book } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';

const HomePage: React.FC = () => {
  const { loadSavedQuiz } = useQuiz();
  const hasSavedQuiz = localStorage.getItem('savedQuiz') !== null;

  const handleContinueQuiz = () => {
    if (loadSavedQuiz()) {
      window.location.href = '/quiz';
    }
  };

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-700 to-indigo-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-10 md:mb-0">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                Transform Documents into Interactive Quizzes
              </h1>
              <p className="text-xl text-purple-100 mb-8 max-w-lg">
                Upload any document and let AI create custom quizzes to test your knowledge and accelerate your learning.
              </p>
              <div className="space-y-4">
                <Link 
                  to="/upload" 
                  className="inline-flex items-center justify-center px-6 py-3 bg-white text-purple-700 rounded-full font-medium shadow-lg hover:bg-purple-50 transition-all transform hover:scale-105"
                >
                  <FileUp className="mr-2 w-5 h-5" />
                  Upload a Document
                </Link>
                {hasSavedQuiz && (
                  <button
                    onClick={handleContinueQuiz}
                    className="block w-full md:w-auto text-center px-6 py-3 bg-purple-600 text-white rounded-full font-medium shadow-lg hover:bg-purple-700 transition-all transform hover:scale-105 border border-purple-400"
                  >
                    <Book className="inline-block mr-2 w-5 h-5" />
                    Continue Saved Quiz
                  </button>
                )}
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-purple-600 rounded-xl transform rotate-3"></div>
                <div className="relative bg-white p-6 rounded-xl shadow-xl">
                  <div className="flex items-center mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="ml-4 text-slate-700 font-medium">QuizAI Generator</div>
                  </div>
                  <div className="space-y-4 text-slate-800">
                    <div className="p-4 bg-purple-50 rounded-lg">
                      <p className="font-medium">True or False:</p>
                      <p className="mt-1">Machine learning requires explicit programming for every task it performs.</p>
                      <div className="mt-3 flex space-x-3">
                        <button className="px-4 py-2 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors">
                          True
                        </button>
                        <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
                          False
                        </button>
                      </div>
                    </div>
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <p className="font-medium">Multiple Choice:</p>
                      <p className="mt-1">Which of these is a type of neural network?</p>
                      <div className="mt-3 space-y-2">
                        <div className="flex items-center p-2 rounded-md hover:bg-blue-100 transition-colors">
                          <div className="w-4 h-4 border border-blue-400 rounded-full mr-2"></div>
                          <span>Binary Tree</span>
                        </div>
                        <div className="flex items-center p-2 bg-blue-200 rounded-md">
                          <div className="w-4 h-4 bg-blue-600 border border-blue-600 rounded-full mr-2"></div>
                          <span className="font-medium">Convolutional Neural Network</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-slate-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-slate-800">How It Works</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <FileUp className="w-6 h-6 text-purple-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">Upload Your Document</h3>
              <p className="text-slate-600">
                Upload any text document, PDF, or even a photo of text. Our system can process various file formats.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <Brain className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">AI Generates Questions</h3>
              <p className="text-slate-600">
                Our advanced AI analyzes your document and creates a variety of question types to test your knowledge.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
              <div className="w-14 h-14 bg-teal-100 rounded-full flex items-center justify-center mb-4">
                <Book className="w-6 h-6 text-teal-700" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-slate-800">Take Your Quiz</h3>
              <p className="text-slate-600">
                Complete the interactive quiz, track your progress, and identify areas where you need more study.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-slate-800">Ready to Supercharge Your Learning?</h2>
          <p className="text-xl text-slate-600 mb-8 max-w-2xl mx-auto">
            Create your first quiz in minutes and take your study sessions to the next level.
          </p>
          <Link 
            to="/upload" 
            className="inline-flex items-center justify-center px-8 py-4 bg-purple-600 text-white rounded-full font-medium shadow-md hover:bg-purple-700 transition-all transform hover:scale-105"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;