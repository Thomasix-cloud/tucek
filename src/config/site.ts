/**
 * Jediný zdroj pravdy pro údaje o firmě.
 * Položky označené TODO je potřeba ověřit / doplnit od klienta.
 */

export const site = {
  brand: 'Autoservis Petr Tuček',
  shortName: 'Autoservis Tuček',
  legalName: 'Mapetoucan cars s.r.o.',
  tagline: 'Precizní servis. Bez kompromisů.',
  description:
    'Autoservis Petr Tuček v Malešovicích u Brna – servis a opravy automobilů, pneuservis, diagnostika, klimatizace, geometrie a autoelektrika. Specializace na BMW a koncern VW.',

  ico: '19348070',
  dic: 'CZ19348070',
  registeredOffice: 'Okružní 433/1, Lesná, 638 00 Brno',

  /** Provozovna – dílna */
  address: {
    street: 'Malešovice 113',
    city: 'Malešovice',
    zip: '664 65',
    region: 'Jihomoravský kraj',
    country: 'CZ',
    geo: { lat: 49.0250107, lng: 16.4987019 },
  },

  phones: [
    { display: '739 631 969', href: 'tel:+420739631969', e164: '+420739631969' },
  ],

  /** TODO: doplnit e-mail servisu. Dokud je prázdný, na webu se nezobrazuje. */
  email: '',

  /** TODO: ověřit – předpokládáme Po–Pá 9:00–18:00, víkend zavřeno. */
  hours: [
    {
      days: 'Pondělí – Pátek',
      time: '9:00 – 18:00',
      schemaDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '09:00',
      closes: '18:00',
    },
    { days: 'Sobota – Neděle', time: 'Zavřeno', schemaDays: [], opens: '', closes: '' },
  ],

  areaServed: ['Malešovice', 'Pohořelice', 'Hrušovany u Brna', 'Židlochovice', 'Ivančice', 'Brno', 'Brno-venkov'],

  /** TODO: doplnit odkazy na sociální sítě a Google profil – prázdné se nezobrazí. */
  social: {
    facebook: '',
    instagram: '',
    google: '',
  },

  maps: {
    google: 'https://www.google.com/maps/dir/?api=1&destination=49.0250107,16.4987019',
    mapy: 'https://mapy.com/fnc/v1/route?end=16.4987019,49.0250107',
    embed: 'https://www.google.com/maps?q=Male%C5%A1ovice+113,+664+65&z=15&output=embed',
  },
} as const;

export const nav = [
  { label: 'Úvod', href: '/#uvod' },
  { label: 'Služby', href: '/#sluzby' },
  { label: 'O nás', href: '/#o-nas' },
  { label: 'Galerie', href: '/#galerie' },
  { label: 'Kontakt', href: '/#kontakt' },
] as const;

export const primaryPhone = site.phones[0];
export const fullAddress = `${site.address.street}, ${site.address.zip} ${site.address.city}`;
