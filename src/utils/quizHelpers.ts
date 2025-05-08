import { Question } from '../types';
import OpenAI from 'openai';
import * as mammoth from 'mammoth';
import * as pdfjs from 'pdfjs-dist';
import 'pdfjs-dist/build/pdf.worker.mjs';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const extractTextFromDocument = async (file: File): Promise<string> => {
  console.log('Starting document extraction:', {
    fileName: file.name,
    fileType: file.type,
    fileSize: file.size
  });

  const isWordDoc = file.name.endsWith('.docx') || 
                    file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  
  try {
    if (file.type === 'text/plain') {
      const text = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          try {
            if (!event.target?.result) {
              throw new Error('No result from file reader');
            }
            
            const content = event.target.result.toString();
            console.log('Text file extracted:', {
              length: content.length,
              preview: content.substring(0, 100)
            });
            
            if (!content || content.trim().length === 0) {
              throw new Error('Extracted text is empty');
            }
            
            resolve(content);
          } catch (error) {
            reject(error);
          }
        };
        
        reader.onerror = () => {
          reject(new Error('Failed to read text file'));
        };
        
        reader.readAsText(file);
      });
      
      return text;
    } else if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      const typedArray = new Uint8Array(arrayBuffer);
      const pdf = await pdfjs.getDocument(typedArray).promise;
      
      console.log('PDF loaded:', { pageCount: pdf.numPages });
      
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        const pageText = content.items
          .map((item: any) => item.str)
          .join(' ');
        
        fullText += pageText + '\n';
        
        console.log(`Page ${i} extracted:`, {
          length: pageText.length,
          preview: pageText.substring(0, 100)
        });
      }
      
      if (!fullText || fullText.trim().length === 0) {
        throw new Error('Extracted PDF text is empty');
      }
      
      console.log('Complete PDF content:', {
        length: fullText.length,
        preview: fullText.substring(0, 100)
      });
      
      return fullText.trim();
    } else if (isWordDoc) {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      
      if (!result.value || result.value.trim().length === 0) {
        throw new Error('Extracted Word document text is empty');
      }
      
      console.log('Word document extracted:', {
        length: result.value.length,
        preview: result.value.substring(0, 100),
        result: result.value.trim()
      });
      
      return result.value.trim();
    }
    
    throw new Error(`Unsupported file type: ${file.type}`);
  } catch (error) {
    console.error('Document extraction error:', error);
    throw new Error(
      error instanceof Error 
        ? `Failed to extract text: ${error.message}`
        : 'Failed to extract text from document'
    );
  }
};

export const generateQuestions = async (content: string): Promise<Question[]> => {
  try {
    if (!content || content.trim().length === 0) {
      console.error('Empty content provided to generateQuestions');
      throw new Error('No content provided to generate questions from');
    }

    console.log('Generating questions from content:', {
      contentLength: content.length,
      preview: content.substring(0, 100)
    });

    const prompt = `Create a quiz based on the following content. Generate:
    - 20 multiple choice questions
    - 10 true/false questions
    
    The questions must be directly related to the content provided. Each question should test understanding of specific information from the text.
    
    Format the response as a JSON array of objects with the following structure:
    {
      "questions": [
        {
          "type": "multiple-choice" | "true-false",
          "question": "string",
          "options": ["string"] (for multiple-choice only),
          "correctAnswer": "string" | boolean,
          "explanation": "string"
        }
      ]
    }
    
    Content: ${content}`;

const response = await fetch('/.netlify/functions/generate-quiz', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ content })
});

const data = await response.json();
console.log("Quiz:", data);    

    {/* const response = await openai.chat.completions.create({
      model: "gpt-4-turbo-preview",
      messages: [
        {
          role: "system",
          content: "You are a quiz generator that creates educational questions based on provided content. Generate questions that directly test understanding of specific information from the provided text. Never generate generic questions or questions unrelated to the content."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" }
    });

    if (!response.choices?.[0]?.message?.content) {
      throw new Error('Failed to get a valid response from OpenAI');
    }

    const result = JSON.parse(response.choices[0].message.content);
    
    if (!result?.questions || !Array.isArray(result.questions)) {
      throw new Error('Invalid response format from OpenAI');
    }

    const questions = result.questions.map((q: Question) => ({
      ...q,
      id: generateId()
    }));

    console.log('Generated questions:', {
      questionCount: questions.length
    });

    return questions;
  } catch (error) {
    console.error('Error generating questions:', error);
    throw error;
  }
};
*/}

export const calculatePercentage = (score: number, total: number): number => {
  if (total === 0) return 0;
  return Math.round((score / total) * 100);
};
