import type { BookingRequest } from './schema';

export interface BookingMeta {
  /** Čas přijetí požadavku */
  receivedAt: Date;
  ip?: string;
  userAgent?: string;
}

export type BookingResult =
  | { ok: true; reference: string }
  | { ok: false; reason: 'not_configured' | 'provider_error'; message?: string };

/**
 * Rozhraní pro zpracování objednávky.
 * Dnes: e-mail přes Resend. Do budoucna lze přidat např. rezervační systém
 * (Reservio, Cal.com, vlastní DB…) implementací tohoto rozhraní.
 */
export interface BookingProvider {
  readonly name: string;
  isConfigured(): boolean;
  submit(request: BookingRequest, meta: BookingMeta): Promise<BookingResult>;
}
