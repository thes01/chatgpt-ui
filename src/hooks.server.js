 
/** @type {import('@sveltejs/kit').HandleServerError} */
export function handleError({ error, event }) {
  // example integration with https://sentry.io/
  return {
    message: JSON.stringify({error, event}),
  };
}