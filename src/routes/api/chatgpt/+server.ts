import { error } from '@sveltejs/kit';
import { ChatGPTAPI } from 'chatgpt';

const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

const api = new ChatGPTAPI({
    apiKey
});
 
/** @type {import('./$types').RequestHandler} */
export async function GET({ url }) {
  // const query = url.searchParams.get('query');
  // if (!query) {
  //   throw error(400, 'Missing query');
  // }

  // const response = await api.sendMessage(query, {
  //   systemMessage: `You are ChatGPT, a large language model trained by OpenAI. You answer as concisely as possible for each response
  //   If you are generating a list, do not have too many items.
  //   Current date: ${new Date().toISOString()}\n\n`,
  //   onProgress: (partialResponse) => console.log(partialResponse.text)
  // });
 
  // return new Response(JSON.stringify(response));

  return new Response(apiKey);
}