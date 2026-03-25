import type { APIRoute } from 'astro';

// This is a server-side API route — it runs on the server, never in the browser.
// That means the BUTTONDOWN_API_KEY stays secret and is never exposed to users.
export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const email = body?.email;

  if (!email || typeof email !== 'string') {
    return new Response(JSON.stringify({ error: 'Email is required.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const apiKey = import.meta.env.BUTTONDOWN_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'Newsletter service is not configured.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const response = await fetch('https://api.buttondown.com/v1/subscribers', {
    method: 'POST',
    headers: {
      Authorization: `Token ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email_address: email }),
  });

  if (!response.ok) {
    const error = await response.json();
    return new Response(JSON.stringify({ error: error?.detail ?? 'Subscription failed.' }), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
