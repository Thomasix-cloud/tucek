/**
 * Skutečné recenze zákazníků (např. z Google profilu firmy).
 * Nevkládejte vymyšlené recenze – dokud je pole prázdné, sekce se na produkci nezobrazí.
 *
 * Příklad položky:
 * { author: 'Jan N.', rating: 5, text: '…', date: '2026-10-01', source: 'Google' }
 */
export interface Review {
  author: string;
  rating: 1 | 2 | 3 | 4 | 5;
  text: string;
  /** ISO datum */
  date?: string;
  source?: 'Google' | 'Facebook' | 'Firmy.cz' | 'Osobně';
}

export const reviews: Review[] = [];
