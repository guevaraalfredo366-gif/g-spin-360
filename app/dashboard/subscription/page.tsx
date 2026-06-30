'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/components/auth/AuthProvider';

type Period = 'monthly' | 'annual';

const PLANS = [
  {
    id: 'starter', name: 'Starter', color: '#6b7280',
    price: { monthly: 0, annual: 0 },
    features: ['7 días de prueba', '1 evento activo', '50 videos', 'Marca de agua G-SPIN'],
  },
  {
    id: 'pro', name: 'Pro', color: '#9D7CFF',
    price: { monthly: 1499, annual: 1199 },
    features: ['30 días de acceso', 'Eventos ilimitados', 'Sin marca de agua', 'Intros/outros', 'Música personalizada'],
  },
  {
    id: 'business', name: 'Business', color: '#FF7300',
    price: { monthly: 3999, annual: 3199 },
    features: ['Todo en Pro', 'Filtros premium', 'Multi-operador', 'Galería marca blanca', 'API access'],
  },
];

interface PaymentRecord {
  id: string;
  date: { toDate(): Date };
  plan: string;
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

function formatDate(ts: { toDate(): Date } | undefined): string {
  if (!ts?.toDate) return '—';
  return ts.toDate().toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function SubscriptionPage() {
  const { user, profile } = useAuth();
  const searchParams      = useSearchParams();
  const [period, setPeriod]           = useState<Period>('monthly');
  const [payments, setPayments]       = useState<PaymentRecord[]>([]);
  const [paymentsLoaded, setPaymentsLoaded] = useState(false);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [checkoutError,   setCheckoutError]   = useState('');

  const isSuccess  = searchParams.get('success')  === '1';
  const isCanceled = searchParams.get('canceled') === '1';

  const currentPlan = profile?.plan ?? 'starter';
  const daysRemaining = profile?.daysRemaining ?? 0;
  const activatedAt   = profile?.activatedAt;
  const subscriptionStatus = profile?.subscriptionStatus ?? 'trial';

  // Compute days remaining from activatedAt if daysRemaining not stored
  const computedDays = (() => {
    if (daysRemaining) return daysRemaining;
    if (!activatedAt) return 0;
    const elapsed = Math.floor((Date.now() - activatedAt.toDate().getTime()) / 86_400_000);
    return Math.max(0, 30 - elapsed);
  })();
  const progressPct = currentPlan === 'starter' ? 100 : Math.min(100, (computedDays / 30) * 100);

  // Load billing history from users/{uid}/payments subcollection
  useEffect(() => {
    if (!user) return;
    const q = query(
      collection(db, 'users', user.uid, 'payments'),
      orderBy('date', 'desc')
    );
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

  const handleUpgrade = async (planId: string) => {
    if (!user || planId === 'starter') return;
    setCheckoutLoading(planId);
    setCheckoutError('');
    try {
      const token = await user.getIdToken();
      const res   = await fetch('/api/checkout', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body:    JSON.stringify({ plan: planId, period }),
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
        <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Gestiona tu plan de acceso y facturación.</p>
      </div>

      {/* Success / canceled banners */}
      {isSuccess && (
        <div style={{ padding: '16px 20px', borderRadius: '12px', background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.25)', color: '#22C55E', fontSize: '14px', fontWeight: 600 }}>
          ✓ Pago completado. Tu plan ha sido actualizado.
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

      {/* Current plan card */}
      <div
        style={{
          padding: '24px', borderRadius: '16px', position: 'relative', overflow: 'hidden',
          background: 'linear-gradient(135deg, rgba(157,124,255,0.12) 0%, rgba(124,92,219,0.06) 100%)',
          border: '1px solid rgba(157,124,255,0.25)',
        }}
      >
        <div className="blob" style={{ width: '200px', height: '200px', right: '-40px', top: '-40px', background: '#9D7CFF', opacity: 0.12, zIndex: 0 }} />
        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', alignItems: 'center' }}>
          <div>
            <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#9D7CFF', marginBottom: '4px' }}>
              Plan actual
            </p>
            <h2 style={{ fontSize: '30px', fontWeight: 900, color: '#ffffff', marginBottom: '4px', textTransform: 'capitalize' }}>
              {currentPlan}
            </h2>
            {currentPlan !== 'starter' && activatedAt && (
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>
                Activo desde <strong style={{ color: '#ffffff' }}>{formatDate(activatedAt)}</strong>
              </p>
            )}
            {currentPlan === 'starter' && (
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>
                Plan gratuito — sin restricciones de tiempo
              </p>
            )}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                <span style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {currentPlan === 'starter' ? 'Sin límite de tiempo' : 'Días restantes'}
                </span>
                <span style={{ fontWeight: 700, color: '#ffffff' }}>
                  {currentPlan === 'starter' ? '∞' : `${computedDays} / 30`}
                </span>
              </div>
              <div style={{ height: '6px', borderRadius: '9999px', background: 'rgba(255,255,255,0.08)' }}>
                <div style={{ height: '100%', width: `${progressPct}%`, borderRadius: '9999px', background: 'linear-gradient(90deg, #9D7CFF, #7C5CDB)', transition: 'width 0.4s' }} />
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <p style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(255,255,255,0.35)' }}>
              Estado: <span style={{ color: subscriptionStatus === 'active' ? '#22C55E' : '#9D7CFF', textTransform: 'capitalize' }}>{subscriptionStatus}</span>
            </p>
            {currentPlan !== 'starter' && (
              <button
                onClick={() => handleUpgrade(currentPlan)}
                disabled={!!checkoutLoading}
                style={{
                  width: '100%', padding: '12px', borderRadius: '12px',
                  fontSize: '14px', fontWeight: 700, color: '#ffffff',
                  background: checkoutLoading ? 'rgba(157,124,255,0.5)' : '#9D7CFF',
                  boxShadow: '0 0 20px rgba(157,124,255,0.3)', border: 'none',
                  cursor: checkoutLoading ? 'default' : 'pointer',
                }}
              >
                {checkoutLoading === currentPlan ? 'Redirigiendo…' : 'Renovar ahora'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Upgrade plans */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: 0 }}>Cambiar plan</h2>
          <div style={{ display: 'flex', padding: '4px', borderRadius: '12px', background: '#0F0F1A', border: '1px solid #1E1E35' }}>
            {([['monthly', 'Mensual'], ['annual', 'Anual -20%']] as const).map(([key, label]) => (
              <button
                key={key}
                onClick={() => setPeriod(key)}
                style={{
                  padding: '6px 14px', borderRadius: '8px', fontSize: '12px', fontWeight: 500, border: 'none', cursor: 'pointer', transition: 'all 0.2s',
                  background: period === key ? '#9D7CFF' : 'transparent',
                  color:      period === key ? '#ffffff' : 'rgba(255,255,255,0.4)',
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
          {PLANS.map((plan) => {
            const isCurrent = plan.id === currentPlan;
            const price     = plan.price[period];
            const isLoading = checkoutLoading === plan.id;
            return (
              <div
                key={plan.id}
                style={{
                  padding: '20px', borderRadius: '16px',
                  background: isCurrent ? '#13112A' : '#0F0F1A',
                  border: `1px solid ${isCurrent ? plan.color + '50' : '#1E1E35'}`,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: '#ffffff', margin: 0 }}>{plan.name}</p>
                  {isCurrent && (
                    <span style={{ fontSize: '10px', fontWeight: 700, padding: '3px 8px', borderRadius: '8px', background: `${plan.color}22`, color: plan.color }}>
                      Actual
                    </span>
                  )}
                </div>

                <p style={{ fontSize: '24px', fontWeight: 900, marginBottom: '16px', color: plan.color }}>
                  {price === 0 ? 'Gratis' : `$${price.toLocaleString()}`}
                  {price > 0 && <span style={{ fontSize: '12px', fontWeight: 400, color: 'rgba(255,255,255,0.4)', marginLeft: '4px' }}>/mes</span>}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                  {plan.features.map((f) => (
                    <p key={f} style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: 0 }}>✓ {f}</p>
                  ))}
                </div>

                <button
                  disabled={isCurrent || isLoading || plan.id === 'starter'}
                  onClick={() => handleUpgrade(plan.id)}
                  style={{
                    width: '100%', padding: '10px', borderRadius: '10px',
                    fontSize: '12px', fontWeight: 700,
                    cursor: (isCurrent || plan.id === 'starter') ? 'default' : 'pointer',
                    opacity: isCurrent ? 0.6 : 1,
                    background: isCurrent ? 'transparent' : isLoading ? 'rgba(157,124,255,0.5)' : plan.color,
                    color:  isCurrent ? plan.color : '#ffffff',
                    border: isCurrent ? `1px solid ${plan.color}40` : 'none',
                    transition: 'opacity 0.2s',
                  }}
                >
                  {isCurrent ? 'Plan activo' : isLoading ? 'Redirigiendo…' : plan.id === 'starter' ? 'Plan gratuito' : 'Actualizar'}
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
                    {['Fecha', 'Plan', 'Monto', 'Estado'].map((h) => (
                      <th key={h} style={{ textAlign: 'left', padding: '14px 20px', fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', whiteSpace: 'nowrap' }}>
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {payments.map((row, i) => (
                    <tr key={row.id} style={{ borderBottom: i < payments.length - 1 ? '1px solid rgba(30,30,53,0.5)' : 'none' }}>
                      <td style={{ padding: '14px 20px', fontSize: '13px', color: 'rgba(255,255,255,0.6)', textTransform: 'capitalize' }}>{formatDate(row.date)}</td>
                      <td style={{ padding: '14px 20px', fontSize: '13px', fontWeight: 500, color: '#ffffff', textTransform: 'capitalize' }}>{row.plan}</td>
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
