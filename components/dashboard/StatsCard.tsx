interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accent: string;
  trend?: { value: string; up: boolean };
}

export default function StatsCard({ title, value, subtitle, icon, accent, trend }: StatsCardProps) {
  return (
    <div
      style={{
        position: 'relative',
        borderRadius: '20px',
        padding: '24px',
        overflow: 'hidden',
        background: '#0F0F1A',
        border: '1px solid #1E1E35',
      }}
    >
      {/* Glow orb */}
      <div
        style={{
          position: 'absolute',
          top: '-24px',
          right: '-24px',
          width: '96px',
          height: '96px',
          borderRadius: '50%',
          filter: 'blur(24px)',
          opacity: 0.2,
          background: accent,
        }}
      />

      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div
          style={{
            width: '40px', height: '40px',
            borderRadius: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `${accent}18`,
            color: accent,
          }}
        >
          {icon}
        </div>
        {trend && (
          <span
            style={{
              fontSize: '11px', fontWeight: 700,
              padding: '4px 8px', borderRadius: '8px',
              background: trend.up ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              color:      trend.up ? '#22C55E' : '#EF4444',
            }}
          >
            {trend.up ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>

      <p style={{ fontSize: '30px', fontWeight: 900, color: '#ffffff', margin: '0 0 4px', lineHeight: 1.1 }}>{value}</p>
      <p style={{ fontSize: '14px', fontWeight: 500, color: 'rgba(255,255,255,0.5)', margin: 0 }}>{title}</p>
      {subtitle && (
        <p style={{ fontSize: '11px', marginTop: '4px', color: 'rgba(255,255,255,0.25)' }}>{subtitle}</p>
      )}
    </div>
  );
}
