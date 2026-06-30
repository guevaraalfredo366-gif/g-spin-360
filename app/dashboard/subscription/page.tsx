'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth, daysRemaining, isLicenseExpired } from '@/components/auth/AuthProvider';
import { LICENSES, LICENSE_MAP, formatPriceMXN } from '@/lib/licenses';

interface PaymentRecord {
  id: string;
  date: { toDate(): Date };
  licenseId: string;
  amount: number;
  currency: string;
  status: string;
  stripeSessionId: string;
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: currency.toUpperCase(),
    minimumFractionDigits: 0,
  }).format(amount / 100);
}

function formatDate(ts: { toDate(): Date } | undefined | null): string {
  if (!ts?.toDate) return '—';
  return ts.toDate().toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function SubscriptionPage() {
  const { user, profile } = useAuth();
  const searchParams = useSearchParams();
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [paymentsLoaded, setPaymentsLoaded] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState('');

  const isSuccess = searchParams.get('success') === '1';
  const isCanceled = searchParams.get('canceled') === '1';

  const currentLicense = LICENSE_MAP[profile?.licenseId ?? 'starter'];
  const licenseStatus = profile?.licenseStatus ?? 'trial';
  const expired = isLicenseExpired(profile);
  const days = daysRemaining(profile);
  const isLifetime = licenseStatus === 'lifetime';

  const progressPct = isLifetime
    ? 100
    : currentLicense.days
      ? Math.min(100, Math.max(0, (days / currentLicense.days) * 100))
      : 0;

  // Load billing history from users/{uid}/payments subcollection
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'users', user.uid, 'payments'), orderBy('date', 'desc'));
    const unsub = onSnapshot(
      q,
      (snap) => {
        setPayments(snap.docs.map((d) => ({ id: d.id, ...d.data() } as PaymentRecord)));
        setPaymentsLoaded(true);
      },
      () => setPaymentsLoaded(true)
    );
    return unsub;
  }, [user]);

  const handlePurchase = async (licenseId: string) => {
    if (!user) return;
    setCheckoutLoading(licenseId);
    setCheckoutError('');
    try {
      const token = await user.getIdToken();
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ licenseId }),
      });
      const data = await res.json() as { url?: string; error?: string };
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCheckoutError(data.error ?? 'Error al iniciar el pago. Intenta de nuevo.');
      }
    } catch {
      setCheckoutError('Error de conexión. Verifica tu internet e intenta de nuevo.');
    } finally {
      setCheckoutLoading(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '32px', maxWidth: '1280px' }}>

      {/* Title */}
      <div>
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#ffffff', margin: '0 0 4px' }}>Membresía</h1>
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Gestiona tu licencia de acceso G-Spin y facturación.</p>
      </div>

      {/* Success / canceled banners */}
      {isSuccess && (
        <div style={{ padding: '16px 20px', borderRadius: '12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#22C55E', fontSize: '14px', fontWeight: 600 }}>
          ✓ Pago completado. Tu licencia ha sido extendida.
        </div>
      )}
      {isCanceled && (
        <div style={{ padding: '16px 20px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', fontSize: '14px', fontWeight: 600 }}>
          El proceso de pago fue cancelado. Puedes intentarlo de nuevo cuando quieras.
        </div>
      )}
      {checkoutError && (
        <div style={{ padding: '16px 20px', borderRadius: '12px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#EF4444', fontSize: '14px' }}>
          {checkoutError}
        </div>
      )}

      {/* Current license card */}
      <div
        style={{
          padding: '24px', borderRadius: '16px', position: 'relative', overflow: 'hidden',
          background: expired
            ? 'linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(239,68,68,0.04) 100%)'
            : 'linear-gradient(135deg, rgba(157,124,255,0.12) 0%, rgba(124,92,219,0.06) 100%)',
          border: `1px solid ${expired ? 'rgba(239,68,68,0.3)' : 'rgba(157,124,255,0.25)'}`,
        }}
      >
        <div className="blob" style={{ width: '200px', height: '200px', right: '-40px', top: '-40px', background: currentLicense.color, opacity: 0.12, zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: currentLicense.color, marginBottom: '4px' }}>
              Licencia actual
            </p>
            <h2 style={{ fontSize: '28px', fontWeight: 900, color: '#ffffff', marginBottom: '4px' }}>
              {currentLicense.name}
            </h2>
            {expired && (
              <p style={{ fontSize: '13px', color: '#EF4444', fontWeight: 700, marginBottom: '16px' }}>
                ⚠ Tu licencia ha expirado — renueva para seguir creando eventos.
              </p>
            )}
            {!expired && isLifetime && (
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>
                Acceso vitalicio — sin restricciones de tiempo
              </p>
            )}
            {!expired && !isLifetime && (
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>
                Vence el <strong style={{ color: '#ffffff' }}>{formatDate(profile?.expiryDate)}</strong>
              </p>
            )}
            {!isLifetime && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: 'rgba(255,255,255,0.45)' }}>Días restantes</span>
                  <span style={{ fontWeight: 700, color: '#ffffff' }}>{expired ? '0' : days} / {currentLicense.days}</span>
                </div>
                <div style={{ height: '6px', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)' }}>
                  <div style={{ height: '100%', width: `${expired ? 0 : progressPct}%`, borderRadius: '9999px', background: expired ? '#EF4444' : `linear-gradient(90deg, ${currentLicense.color}, #7C5CDB)`, transition: 'width 0.4s' }} />
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)' }}>
              Estado: <span style={{ color: licenseStatus === 'active' || licenseStatus === 'lifetime' ? '#22C55E' : expired ? '#EF4444' : '#9D7CFF' }}>
                {expired ? 'expirada' : licenseStatus === 'lifetime' ? 'vitalicia' : licenseStatus === 'active' ? 'activa' : 'prueba'}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* License catalog */}
      <div>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '20px' }}>Licencias G-Spin — acceso total</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
          {LICENSES.map((license) => {
            const isCurrent = license.id === currentLicense.id && !expired;
            const isLoading = checkoutLoading === license.id;
            return (
              <div
                key={license.id}
                style={{
                  padding: '20px', borderRadius: '16px',
                  background: isCurrent ? '#13112A' : '#0F0F1A',
                  border: `1px solid ${isCurrent ? license.color + '50' : '#1E1E35'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', margin: 0 }}>{license.name}</p>
                  {isCurrent && (
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '8px', background: `${license.color}22`, color: license.color }}>
                      Actual
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '16px' }}>{license.tagline}</p>

                <p style={{ fontSize: '22px', fontWeight: 900, marginBottom: '20px', color: license.color }}>
                  {formatPriceMXN(license.priceCents)}
                </p>

                <button
                  disabled={!license.purchasable || isLoading}
                  onClick={() => handlePurchase(license.id)}
                  style={{
                    width: '100%', padding: '10px', borderRadius: '10px',
                    fontSize: '12px', fontWeight: 700,
                    cursor: !license.purchasable || isLoading ? 'default' : 'pointer',
                    background: !license.purchasable ? 'transparent' : isLoading ? `${license.color}80` : license.color,
                    color: !license.purchasable ? 'rgba(255,255,255,0.3)' : '#ffffff',
                    border: !license.purchasable ? '1px solid #1E1E35' : 'none',
                    transition: 'opacity 0.2s',
                  }}
                >
                  {!license.purchasable ? 'Plan de prueba' : isLoading ? 'Redirigiendo…' : isCurrent ? 'Renovar' : 'Comprar'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Billing history */}
      <div>
        <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', marginBottom: '16px' }}>Historial de pagos</h2>
        <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#0F0F1A', border: '1px solid #1E1E35' }}>
          {!paymentsLoaded ? (
            <div style={{ padding: '32px', textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.25)' }}>Cargando historial…</div>
          ) : payments.length === 0 ? (
            <div style={{ padding: '32px', textAlign: 'center', fontSize: '14px', color: 'rgba(255,255,255,0.25)' }}>
              Sin pagos registrados aún.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1E1E35' }}>
                    {['Fecha', 'Licencia', 'Monto', 'Estado'].map((h) => (
                      <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map((row, i) => (
                    <tr key={row.id} style={{ borderBottom: i < payments.length - 1 ? '1px solid rgba(30,30,53,0.5)' : 'none' }}>
                      <td style={{ padding: '14px 20px', fontSize: '13px', color: 'rgba(255,255,255,0.6)' }}>{formatDate(row.date)}</td>
                      <td style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 500, color: '#ffffff' }}>{LICENSE_MAP[row.licenseId as keyof typeof LICENSE_MAP]?.name ?? row.licenseId}</td>
                      <td style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 700, color: '#ffffff' }}>{formatCurrency(row.amount, row.currency)}</td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ display: 'inline-flex', padding: '4px 10px', borderRadius: '8px', fontSize: '10px', fontWeight: 700, background: 'rgba(34,197,94,0.1)', color: '#22C55E', border: '1px solid rgba(34,197,94,0.2)' }}>
                          {row.status === 'completed' ? 'Pagado' : row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
