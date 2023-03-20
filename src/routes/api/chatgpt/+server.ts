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

  const readable = new ReadableStream({
		async start(ctr) {
      await api.sendMessage(query, { parentMessageId, onProgress: (partialResponse) => {
        let str = JSON.stringify(partialResponse);
        ctr.enqueue(`${str}\n\n`);
      }});

      ctr.close();
		},
		cancel() {
			console.log('cancel');
		}
	});

	return new Response(readable, {
		headers: {
			'content-type': 'text/event-stream',
		}
  });
}