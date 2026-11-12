import { z } from 'zod';

import { isEmail, isPhone } from './shared';

export { isEmail, isPhone, SERVICE_OPTIONS } from './shared';

/** Sdílené validační schéma – používá ho formulář i API endpoint. */
export const bookingSchema = z.object({
  name: z.string().trim().min(2, 'Vyplňte prosím jméno.').max(100, 'Jméno je příliš dlouhé.'),
  contact: z
    .string()
    .trim()
    .min(1, 'Zadejte telefon nebo e-mail.')
    .max(120)
    .refine((v) => isEmail(v) || isPhone(v), 'Zadejte platný telefon nebo e-mail.'),
  car: z.string().trim().min(2, 'Uveďte značku a model vozu.').max(120, 'Text je příliš dlouhý.'),
  service: z.string().trim().max(60).optional().default(''),
  message: z.string().trim().min(5, 'Popište prosím, s čím potřebujete pomoci.').max(2000, 'Zpráva je příliš dlouhá.'),
  preferredDate: z.string().trim().max(40).optional().default(''),
  /** Honeypot – skryté pole, které vyplní jen boti. */
  website: z.string().optional().default(''),
});

export type BookingInput = z.input<typeof bookingSchema>;
export type BookingRequest = z.output<typeof bookingSchema>;

export type FieldErrors = Partial<Record<keyof BookingRequest, string>>;

export function flattenErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof BookingRequest;
    if (key && !out[key]) out[key] = issue.message;
  }
  return out;
}
