import { FiTrendingUp } from 'react-icons/fi'

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-surface-dark">
      <div className="mx-auto max-w-7xl px-6 py-12 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-semibold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-blue text-white">
              <FiTrendingUp size={16} />
            </span>
            Trendlens
          </div>
          <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 max-w-xs">
            Search-trend analytics, comparisons, and forecasting — with a bit of SEO practice built in.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li>Dashboard</li>
            <li>Keyword comparison</li>
            <li>Reports & export</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Learn</h4>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li>Learning Hub</li>
            <li>Daily SEO Quiz</li>
            <li>Trend Detective</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
            <li>About</li>
            <li>Privacy</li>
            <li>Terms</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 dark:border-slate-800 py-6 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Trendlens. Built as a demonstration analytics platform.
      </div>
    </footer>
  )
}
