import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileUp, FileText, X, Loader2 } from 'lucide-react';
import { useQuiz } from '../context/QuizContext';
import { extractTextFromDocument, generateQuestions } from '../utils/quizHelpers';

const UploadPage: React.FC = () => {
  const navigate = useNavigate();
  const { 
    setDocumentName, 
    setDocumentContent, 
    setQuizState,
    setQuestions,
    quizState
  } = useQuiz();
  
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileSelect = async (selectedFile: File) => {
    const allowedTypes = [
      'text/plain',
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];
    
    if (!allowedTypes.includes(selectedFile.type)) {
      setError('Please upload a .txt, .pdf, or .docx file.');
      setTimeout(() => setError(null), 5000);
      return;
    }

    try {
      setFile(selectedFile);
      setQuizState('uploading');
      
      console.log('Processing file:', {
        name: selectedFile.name,
        type: selectedFile.type,
        size: selectedFile.size
      });

      const content = await extractTextFromDocument(selectedFile);
      const trimmedContent = content.trim();
      
      if (!trimmedContent || trimmedContent.length < 50) {
        throw new Error(
          !trimmedContent 
            ? 'The document appears to be empty. Please upload a document with content.'
            : 'The document contains insufficient content. Please upload a document with more text.'
        );
      }

      setDocumentName(selectedFile.name);
      setDocumentContent(trimmedContent);
      setQuizState('processing');
      
      // Generate questions using OpenAI
      const generatedQuestions = await generateQuestions(trimmedContent);
      setQuestions(generatedQuestions);
      setQuizState('ready');
      
      navigate('/quiz');
    } catch (err) {
      console.error('Error processing file:', err);
      setError(err instanceof Error ? err.message : 'Failed to process the file. Please try again.');
      setQuizState('idle');
      setFile(null);
      setDocumentContent('');
      setDocumentName('');
    }
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };
  
  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelect(e.target.files[0]);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-10">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-slate-800">Upload Your Document</h1>
        
        <div 
          className={`border-2 border-dashed rounded-xl p-10 text-center transition-all ${
            isDragging 
              ? 'border-purple-500 bg-purple-50' 
              : file 
              ? 'border-green-400 bg-green-50' 
              : 'border-slate-300 hover:border-purple-400 bg-white hover:bg-purple-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="hidden"
            ref={fileInputRef}
            onChange={handleFileInputChange}
            accept=".txt,.pdf,.docx"
          />
          
          {!file && (
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
                <FileUp className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-medium text-slate-700">Drag & Drop your document here</h3>
              <p className="text-slate-500">
                Support for .txt, .pdf, and .docx files
              </p>
              <button
                onClick={handleBrowseClick}
                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Browse Files
              </button>
            </div>
          )}
          
          {file && (quizState === 'uploading' || quizState === 'processing') && (
            <div className="space-y-4">
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-6 h-6 text-purple-600 animate-spin" />
                <span className="text-lg font-medium text-purple-700">
                  {quizState === 'uploading' ? 'Uploading document...' : 'Generating questions...'}
                </span>
              </div>
              <div className="flex items-center justify-center">
                <FileText className="w-5 h-5 text-slate-500 mr-2" />
                <span className="text-slate-600">{file.name}</span>
              </div>
            </div>
          )}
        </div>
        
        {error && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
            <span>{error}</span>
            <button 
              className="ml-auto"
              onClick={() => setError(null)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
        
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-slate-800">Instructions</h2>
          <div className="bg-white p-5 rounded-lg shadow-sm">
            <ol className="list-decimal ml-5 space-y-2 text-slate-700">
              <li>Upload a document containing the information you want to be quizzed on.</li>
              <li>Our AI will analyze the document and generate relevant questions.</li>
              <li>Different question types will be created: multiple choice and true/false.</li>
              <li>Answer the questions to test your knowledge of the document content.</li>
              <li>Review your results and identify areas for improvement.</li>
            </ol>
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md text-sm text-yellow-800">
              <strong>Note:</strong> For the best results, upload documents with clear, well-structured content. 
              The more information the document contains, the more diverse questions can be generated.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadPage;