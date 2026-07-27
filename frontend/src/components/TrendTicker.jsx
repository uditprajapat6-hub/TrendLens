import { trendingKeywords } from '../services/mockData'

export default function TrendTicker() {
  const items = [...trendingKeywords, ...trendingKeywords]

  return (
    <div className="overflow-hidden border-y border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-surface-darkmuted/60 py-3">
      <div className="flex w-max animate-ticker gap-10 font-mono text-sm">
        {items.map((item, i) => (
          <span key={`${item.keyword}-${i}`} className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-slate-500 dark:text-slate-400">{item.keyword}</span>
            <span className={item.change_pct >= 0 ? 'text-brand-green' : 'text-brand-red'}>
              {item.change_pct >= 0 ? '▲' : '▼'} {Math.abs(item.change_pct)}%
            </span>
          </span>
        ))}
      </div>
    </div>
  )
}
