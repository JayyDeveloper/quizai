import {OpenAI} from 'openai';

const openai = new OpenAI({ apiKey:process.env.OPENAI_API_KEY  });

export async function handler(event) {
  const {content} = JSON.parse(event.body || '{}');

try {
  
const response = await openai.chat.completions.create({
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

}

}

