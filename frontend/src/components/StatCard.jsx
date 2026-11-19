export default function StatCard({ label, value, accent = 'blue' }) {
  const accentClass = {
    blue: 'text-brand-blue',
    green: 'text-brand-green',
    yellow: 'text-brand-yellow',
    red: 'text-brand-red',
  }[accent]

  return (
    <div className="glass-panel px-5 py-4">
      <div className={`font-mono text-2xl font-semibold ${accentClass}`}>{value}</div>
      <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">{label}</div>
    </div>
  )
}
