import { useState } from 'react';

// This is a React component — it needs client:load or client:visible
// in the .astro file that uses it, or it will render as static HTML with no interactivity.
export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus('loading');

    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();

    if (res.ok) {
      setStatus('success');
      setMessage('You're subscribed! Check your inbox to confirm.');
      setEmail('');
    } else {
      setStatus('error');
      setMessage(data.error ?? 'Something went wrong. Try again.');
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
        required
        disabled={status === 'loading' || status === 'success'}
      />
      <button type="submit" disabled={status === 'loading' || status === 'success'}>
        {status === 'loading' ? 'Subscribing…' : 'Subscribe'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
