// Local mock data so pages render immediately during UI development,
// independent of whether the FastAPI backend is running.
// Real usage flows through services/api.js -> the backend.

export const trendingKeywords = [
  { keyword: 'ChatGPT', category: 'Technology', change_pct: 214 },
  { keyword: 'IPL 2026', category: 'Sports', change_pct: 388 },
  { keyword: 'Bitcoin', category: 'Finance', change_pct: 76 },
  { keyword: 'iPhone 18', category: 'Technology', change_pct: 152 },
  { keyword: 'World Cup', category: 'Sports', change_pct: 421 },
  { keyword: 'Tesla', category: 'Finance', change_pct: 33 },
]

export function generateSeries(seed = 1, days = 30, base = 45) {
  let value = base
  const out = []
  const today = new Date()
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    value += Math.sin(i / 4 + seed) * 6 + (Math.random() - 0.5) * 5
    value = Math.max(5, Math.min(100, value))
    out.push({ date: d.toISOString().slice(0, 10), value: Math.round(value * 10) / 10 })
  }
  return out
}

export const featureCards = [
  { title: 'Compare keywords', desc: 'Track up to five search terms side by side over any time window.' },
  { title: 'Regional breakdown', desc: 'See exactly which countries and regions are driving demand.' },
  { title: 'AI insights', desc: 'Automatic read-outs on momentum, seasonality, and growth rate.' },
  { title: 'Forecasting', desc: "Project where a keyword's interest is headed next month." },
  { title: 'Export reports', desc: 'Download charts and full analyses as PDF or CSV in one click.' },
  { title: 'Gamified learning', desc: 'Learn SEO fundamentals through quizzes and trend-guessing games.' },
]

export const testimonials = [
  { name: 'Ananya R.', role: 'Growth Marketer', quote: 'Cut my weekly trend research from two hours to ten minutes.' },
  { name: 'Marcus T.', role: 'SEO Consultant', quote: 'The regional heatmap caught a market shift my old tools missed.' },
  { name: 'Priya D.', role: 'Product Manager', quote: 'The daily quiz is a genuinely fun way for the team to stay sharp on SEO.' },
]

export const faqs = [
  { q: 'Where does the search data come from?', a: 'Search interest is sourced from Google Trends data, normalized to a 0-100 scale relative to the selected time window and region.' },
  { q: 'Can I compare more than one keyword at a time?', a: 'Yes — compare up to five keywords at once across the same date range and region.' },
  { q: 'Is there a free plan?', a: 'Yes. Core dashboards, comparisons, and the learning hub are free. Saved reports and exports are part of a paid tier.' },
  { q: 'Can I export my analysis?', a: 'Every dashboard can be exported as a PDF report or raw CSV for further analysis.' },
]
