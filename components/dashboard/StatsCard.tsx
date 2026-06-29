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
      className="relative rounded-2xl p-5 overflow-hidden"
      style={{ background: '#0F0F1A', border: '1px solid #1E1E35' }}
    >
      {/* Glow orb */}
      <div
        className="absolute -top-6 -right-6 w-24 h-24 rounded-full blur-2xl opacity-20"
        style={{ background: accent }}
      />

      <div className="relative flex items-start justify-between mb-4">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: `${accent}18`, color: accent }}
        >
          {icon}
        </div>
        {trend && (
          <span
            className="text-xs font-bold px-2 py-1 rounded-lg"
            style={{
              background: trend.up ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
              color:      trend.up ? '#22C55E' : '#EF4444',
            }}
          >
            {trend.up ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>

      <p className="text-3xl font-black text-white mb-1">{value}</p>
      <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{title}</p>
      {subtitle && (
        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.25)' }}>{subtitle}</p>
      )}
    </div>
  );
}
