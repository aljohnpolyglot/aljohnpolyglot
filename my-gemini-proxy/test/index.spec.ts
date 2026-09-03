import { createExecutionContext } from 'cloudflare:test';
import { afterEach, describe, it, expect, vi } from 'vitest';
import worker from '../src/index';

// For now, you'll need to do something like this to get a correctly-typed
// `Request` to pass to `worker.fetch()`.
const IncomingRequest = Request<unknown, IncomingRequestCfProperties>;

describe('Gemini proxy', () => {
	afterEach(() => vi.unstubAllGlobals());

	it('rejects GET requests', async () => {
		const request = new IncomingRequest('http://example.com');
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, {}, ctx);
		expect(response.status).toBe(405);
	});

	it('rotates to the next key after a rate limit', async () => {
		const upstream = vi.fn()
			.mockResolvedValueOnce(Response.json({ error: 'limited' }, { status: 429 }))
			.mockResolvedValueOnce(Response.json({ candidates: [{ content: { parts: [{ text: 'ok' }] } }] }));
		vi.stubGlobal('fetch', upstream);
		const request = new IncomingRequest('https://example.com?model=gemini-3.7-flash', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ contents: [] })
		});
		const response = await worker.fetch(request, { GEMINI_API_KEY: 'first', GEMINI_API_KEY_2: 'second' }, createExecutionContext());

		expect(response.status).toBe(200);
		expect(upstream).toHaveBeenCalledTimes(2);
		expect(upstream.mock.calls[0][0]).toContain('gemini-3.7-flash');
		expect(upstream.mock.calls[0][0]).toContain('first');
		expect(upstream.mock.calls[1][0]).toContain('second');
	});
});
