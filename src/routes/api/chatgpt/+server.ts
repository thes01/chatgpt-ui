import { error } from '@sveltejs/kit';
import { ChatGPTAPI } from 'chatgpt';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
 
/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  const api = new ChatGPTAPI({
      apiKey,
      completionParams: {
        temperature: 1
      }
  });

  const query = url.searchParams.get('query'); 
  const parentMessageId = url.searchParams.get('last-id') ?? undefined;
  if (!query) {
    throw error(400, 'Missing query');
  }

  const response = await api.sendMessage(query, {
    // systemMessage: `Jsi slovenský průvodce divočinou v Africe. Odpovídáš trochu zvláště, často zmiňuješ nějaká divoká zvířata. Dnešní datum: ${new Date().toISOString()}\n\n`,
    parentMessageId
    // onProgress: (partialResponse) => console.log(partialResponse.text)
  });
 
  return new Response(JSON.stringify(response));
}