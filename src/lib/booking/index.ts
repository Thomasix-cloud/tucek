import { BOOKING_FROM_EMAIL, BOOKING_PROVIDER, BOOKING_SEND_CONFIRMATION, BOOKING_TO_EMAIL, RESEND_API_KEY } from 'astro:env/server';
import { ResendBookingProvider } from './providers/resend';
import type { BookingProvider } from './types';

export * from './schema';
export * from './types';

/** Vrátí aktivního poskytovatele podle proměnné BOOKING_PROVIDER (výchozí: resend). */
export function getBookingProvider(): BookingProvider {
  switch (BOOKING_PROVIDER) {
    case 'resend':
    default:
      return new ResendBookingProvider({
        apiKey: RESEND_API_KEY,
        to: BOOKING_TO_EMAIL,
        from: BOOKING_FROM_EMAIL,
        sendConfirmation: BOOKING_SEND_CONFIRMATION,
      });
  }
}
