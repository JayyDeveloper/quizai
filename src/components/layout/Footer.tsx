import React from 'react';
import { Github, Twitter, Heart } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div className="mb-4 md:mb-0">
            <p className="text-slate-600 text-sm">
              © {new Date().getFullYear()} QuizAI. All rights reserved.
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <a 
              href="#" 
              className="text-slate-600 hover:text-purple-700 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a 
              href="#" 
              className="text-slate-600 hover:text-purple-700 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <div className="text-slate-400 text-sm flex items-center">
              <span>Made with</span>
              <Heart className="w-4 h-4 mx-1 text-red-500 fill-red-500" />
              <span>by QuizAI Team</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;