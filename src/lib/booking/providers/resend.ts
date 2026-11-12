import { Resend } from 'resend';
import { site } from '../../../config/site';
import { isEmail, type BookingRequest } from '../schema';
import type { BookingMeta, BookingProvider, BookingResult } from '../types';

interface ResendConfig {
  apiKey?: string;
  to?: string;
  from?: string;
  sendConfirmation: boolean;
}

const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);

function rows(r: BookingRequest): [string, string][] {
  return [
    ['Jméno', r.name],
    ['Kontakt', r.contact],
    ['Vůz', r.car],
    ['Služba', r.service || '—'],
    ['Preferovaný termín', r.preferredDate || '—'],
    ['Popis', r.message],
  ];
}

function renderHtml(title: string, intro: string, r: BookingRequest) {
  const body = rows(r)
    .map(
      ([k, v]) =>
        `<tr><td style="padding:8px 16px 8px 0;color:#71717c;vertical-align:top;white-space:nowrap">${k}</td><td style="padding:8px 0;color:#111;white-space:pre-wrap">${esc(v)}</td></tr>`,
    )
    .join('');
  return `<div style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;max-width:600px">
<div style="border-left:4px solid #9e1825;padding-left:16px;margin-bottom:24px"><h2 style="margin:0;font-size:20px;color:#111">${esc(title)}</h2>
<p style="margin:4px 0 0;color:#555">${esc(intro)}</p></div>
<table style="border-collapse:collapse">${body}</table></div>`;
}

const renderText = (r: BookingRequest) => rows(r).map(([k, v]) => `${k}: ${v}`).join('\n');

export class ResendBookingProvider implements BookingProvider {
  readonly name = 'resend';
  constructor(private readonly cfg: ResendConfig) {}

  isConfigured() {
    return Boolean(this.cfg.apiKey && this.cfg.to && this.cfg.from);
  }

  async submit(r: BookingRequest, meta: BookingMeta): Promise<BookingResult> {
    if (!this.isConfigured()) return { ok: false, reason: 'not_configured' };
    const resend = new Resend(this.cfg.apiKey);
    const reference = `OBJ-${meta.receivedAt.toISOString().slice(2, 10).replace(/-/g, '')}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
    const customerEmail = isEmail(r.contact) ? r.contact.trim() : undefined;

    const { error } = await resend.emails.send({
      from: this.cfg.from!,
      to: this.cfg.to!.split(',').map((s) => s.trim()),
      replyTo: customerEmail,
      subject: `Nová objednávka do servisu – ${r.car} (${reference})`,
      html: renderHtml(`Nová objednávka ${reference}`, `Přijato ${meta.receivedAt.toLocaleString('cs-CZ', { timeZone: 'Europe/Prague' })} přes web.`, r),
      text: `Nová objednávka ${reference}\n\n${renderText(r)}`,
    });
    if (error) return { ok: false, reason: 'provider_error', message: error.message };

    if (customerEmail && this.cfg.sendConfirmation) {
      // Potvrzení zákazníkovi – chyba zde nesmí shodit celou objednávku.
      await resend.emails
        .send({
          from: this.cfg.from!,
          to: customerEmail,
          subject: `Přijali jsme vaši objednávku – ${site.brand}`,
          html: renderHtml(
            'Děkujeme, vaši objednávku jsme přijali',
            `Ozveme se vám co nejdříve a termín potvrdíme. V naléhavých případech volejte ${site.phones[0].display}.`,
            r,
          ),
          text: `Děkujeme, vaši objednávku jsme přijali. Ozveme se vám co nejdříve.\n\n${renderText(r)}\n\n${site.brand}, ${site.phones[0].display}`,
        })
        .catch(() => undefined);
    }

    return { ok: true, reference };
  }
}
