import type { APIRoute } from 'astro';
import { bookingSchema, flattenErrors, getBookingProvider } from '../../lib/booking';

export const prerender = false;

// Jednoduchý best-effort limit v rámci jedné instance serverless funkce.
const hits = new Map<string, number[]>();
const WINDOW_MS = 10 * 60 * 1000;
const MAX_HITS = 5;

function rateLimited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  list.push(now);
  hits.set(ip, list);
  return list.length > MAX_HITS;
}

export const POST: APIRoute = async ({ request, clientAddress, redirect }) => {
  const contentType = request.headers.get('content-type') ?? '';
  const wantsJson = (request.headers.get('accept') ?? '').includes('application/json');

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), { status, headers: { 'content-type': 'application/json; charset=utf-8' } });
  // Bez JavaScriptu (klasický POST formuláře) odpovídáme přesměrováním.
  const respond = (status: number, body: Record<string, unknown>, fallbackPath: string) =>
    wantsJson ? json(body, status) : redirect(fallbackPath, 303);

  let raw: Record<string, unknown>;
  try {
    raw = contentType.includes('application/json')
      ? await request.json()
      : Object.fromEntries((await request.formData()).entries());
  } catch {
    return respond(400, { ok: false, error: 'invalid_body' }, '/objednavka-chyba');
  }

  const parsed = bookingSchema.safeParse(raw);
  if (!parsed.success) {
    return respond(422, { ok: false, error: 'validation', fields: flattenErrors(parsed.error) }, '/objednavka-chyba');
  }

  // Honeypot vyplněný = bot. Tváříme se, že je vše v pořádku, ale nic neodesíláme.
  if (parsed.data.website) return respond(200, { ok: true, reference: 'OK' }, '/dekujeme');

  let ip = 'unknown';
  try {
    ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || clientAddress;
  } catch {
    /* clientAddress nemusí být k dispozici */
  }
  if (rateLimited(ip)) return respond(429, { ok: false, error: 'rate_limited' }, '/objednavka-chyba');

  const provider = getBookingProvider();
  if (!provider.isConfigured()) {
    return respond(503, { ok: false, error: 'not_configured' }, '/objednavka-chyba');
  }

  try {
    const result = await provider.submit(parsed.data, {
      receivedAt: new Date(),
      ip,
      userAgent: request.headers.get('user-agent') ?? undefined,
    });
    if (!result.ok) {
      console.error('[booking] provider error', result);
      const status = result.reason === 'not_configured' ? 503 : 502;
      return respond(status, { ok: false, error: result.reason }, '/objednavka-chyba');
    }
    return respond(200, { ok: true, reference: result.reference }, '/dekujeme');
  } catch (err) {
    console.error('[booking] unexpected error', err);
    return respond(500, { ok: false, error: 'server_error' }, '/objednavka-chyba');
  }
};

export const ALL: APIRoute = () =>
  new Response(JSON.stringify({ ok: false, error: 'method_not_allowed' }), {
    status: 405,
    headers: { allow: 'POST', 'content-type': 'application/json' },
  });
