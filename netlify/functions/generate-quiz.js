import {OpenAI} from 'openai';

const openai = new OpenAI({ apiKey:process.env.OPENAI_API_KEY  });

export async function handler(event) {
  const {content} = JSON.parse(event.body || '{}');

try {
  const response = await openai.chat.completions.create ({
    model:'gpt-4',
    messages: [
      {
        role:'system',
        content: 'you are a quiz generator, return quiz questions based only on the provided content.'
      },
      {
        role:'user',
        content:`create a 20 question mulitple choice and 10 true and false quiz from this content:\n\n${content}`
      }
    ]
  });
  return {
    statusCode:200,
    body:JSON.stringify({quiz: response.choices[0].message.content})
  };
} catch(err) {
  console.error('OpenAI error:', err);
  return {
    statusCode:500,
    body: JSON.stringify({error: 'Failed to generate quiz'})
};
}

  
}
