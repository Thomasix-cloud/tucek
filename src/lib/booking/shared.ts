/** Lehké sdílené validátory bez závislostí – bezpečné pro klientský bundle. */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const PHONE_RE = /^\+?[\d\s()/-]{9,20}$/;

export const isEmail = (v: string) => EMAIL_RE.test(v.trim());
export const isPhone = (v: string) => PHONE_RE.test(v.trim()) && v.replace(/\D/g, '').length >= 9;

export const SERVICE_OPTIONS = [
  'Servis a pravidelná údržba',
  'Oprava / závada',
  'Pneuservis',
  'Diagnostika',
  'Klimatizace',
  'Geometrie',
  'Autoelektrika',
  'Jiné',
] as const;
