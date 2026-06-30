// Single source of truth for the G-Spin license catalog.
// Used by both the checkout API (server, authoritative pricing) and the
// subscription page UI (display only — never trust prices sent from the client).

export type LicenseId =
  | 'starter'
  | 'lite'
  | 'basic'
  | 'standard'
  | 'premium'
  | 'elite'
  | 'pro'
  | 'max'
  | 'ultra'
  | 'infinity';

export interface License {
  id: LicenseId;
  name: string;
  /** Days of access granted. null = lifetime (no expiry). */
  days: number | null;
  /** Price in MXN cents (Stripe unit_amount). 0 = free, not purchasable. */
  priceCents: number;
  purchasable: boolean;
  color: string;
  tagline: string;
}

export const LICENSES: License[] = [
  { id: 'starter',  name: 'G-Spin Starter',  days: 7,    priceCents: 0,        purchasable: false, color: '#6b7280', tagline: 'Prueba gratuita de 7 días' },
  { id: 'lite',     name: 'G-Spin Lite',     days: 3,    priceCents: 16_900,   purchasable: true,  color: '#38BDF8', tagline: 'Acceso de 3 días' },
  { id: 'basic',    name: 'G-Spin Basic',    days: 30,   priceCents: 49_900,   purchasable: true,  color: '#22C55E', tagline: 'Acceso de 30 días' },
  { id: 'standard', name: 'G-Spin Standard', days: 60,   priceCents: 84_900,   purchasable: true,  color: '#9D7CFF', tagline: 'Acceso de 60 días' },
  { id: 'premium',  name: 'G-Spin Premium',  days: 180,  priceCents: 229_900,  purchasable: true,  color: '#A855F7', tagline: 'Acceso de 180 días' },
  { id: 'elite',    name: 'G-Spin Elite',    days: 365,  priceCents: 399_900,  purchasable: true,  color: '#FF7300', tagline: 'Acceso de 1 año' },
  { id: 'pro',      name: 'G-Spin Pro',      days: 730,  priceCents: 749_900,  purchasable: true,  color: '#FB923C', tagline: 'Acceso de 2 años' },
  { id: 'max',      name: 'G-Spin Max',      days: 1095, priceCents: 1_129_900, purchasable: true, color: '#F472B6', tagline: 'Acceso de 3 años' },
  { id: 'ultra',    name: 'G-Spin Ultra',    days: 1825, priceCents: 1_799_900, purchasable: true, color: '#EC4899', tagline: 'Acceso de 5 años' },
  { id: 'infinity', name: 'G-Spin Infinity', days: null, priceCents: 4_999_900, purchasable: true, color: '#FACC15', tagline: 'Acceso vitalicio' },
];

export const LICENSE_MAP: Record<LicenseId, License> = LICENSES.reduce(
  (acc, l) => ({ ...acc, [l.id]: l }),
  {} as Record<LicenseId, License>
);

export function isValidLicenseId(value: string): value is LicenseId {
  return Object.prototype.hasOwnProperty.call(LICENSE_MAP, value);
}

export function formatPriceMXN(priceCents: number): string {
  if (priceCents === 0) return 'Gratis';
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 0 }).format(priceCents / 100);
}
