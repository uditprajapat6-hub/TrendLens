import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { FiSearch, FiChevronDown } from 'react-icons/fi'
import HeroChart from '../components/HeroChart'
import TrendTicker from '../components/TrendTicker'
import StatCard from '../components/StatCard'
import FeatureCard from '../components/FeatureCard'
import { featureCards, testimonials, faqs } from '../services/mockData'

function FaqItem({ q, a }) {
  const [openState, setOpenState] = useState(false)
  return (
    <div className="border-b border-slate-200 dark:border-slate-800 py-5">
      <button
        className="flex w-full items-center justify-between text-left font-medium"
        onClick={() => setOpenState((v) => !v)}
      >
        {q}
        <FiChevronDown className={`transition-transform ${openState ? 'rotate-180' : ''}`} />
      </button>
      {openState && <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">{a}</p>}
    </div>
  )
}

export default function Landing() {
  const [query, setQuery] = useState('')

  return (
    <div>
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-6 pt-16 pb-10 grid md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-brand-blue/10 px-4 py-1.5 text-xs font-medium text-brand-blue">
            Search analytics, made readable
          </span>
          <h1 className="mt-5 font-display text-4xl md:text-5xl font-semibold leading-tight">
            Watch what the world is <span className="text-brand-blue">searching for</span>,
            before it trends.
          </h1>
          <p className="mt-5 text-slate-500 dark:text-slate-400 max-w-md">
            Track search interest, compare keywords, and turn raw query data into decisions —
            with AI-generated insights and forecasts built in.
          </p>

          <form
            onSubmit={(e) => e.preventDefault()}
            className="mt-8 flex items-center gap-2 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-surface-darkmuted p-2 max-w-md"
          >
            <FiSearch className="ml-3 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Try 'electric vehicles'"
              className="flex-1 bg-transparent px-1 py-2 text-sm outline-none"
            />
            <Link to="/register" className="btn-primary !py-2 !px-5 text-sm whitespace-nowrap">
              Analyze
            </Link>
          </form>

          <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
            <StatCard label="Keywords tracked" value="2.4M+" accent="blue" />
            <StatCard label="Regions covered" value="190" accent="green" />
            <StatCard label="Reports exported" value="58K" accent="yellow" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="glass-panel p-6"
        >
          <HeroChart />
        </motion.div>
      </section>

      <TrendTicker />

      {/* Feature grid */}
      <section id="dashboard-preview" className="mx-auto max-w-7xl px-6 py-20">
        <div className="max-w-xl mb-10">
          <h2 className="font-display text-3xl font-semibold">Everything you need to read a trend</h2>
          <p className="mt-3 text-slate-500 dark:text-slate-400">
            One dashboard for volume, geography, related queries, and where things are headed next.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {featureCards.map((f, i) => (
            <FeatureCard key={f.title} title={f.title} desc={f.desc} index={i} />
          ))}
        </div>
      </section>

      {/* Learning hub teaser */}
      <section id="learning-hub" className="bg-surface-muted dark:bg-surface-darkmuted/40 py-20">
        <div className="mx-auto max-w-7xl px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-display text-3xl font-semibold">Learn as you analyze</h2>
            <p className="mt-3 text-slate-500 dark:text-slate-400 max-w-md">
              Short, plain-language explainers on search volume, SEO fundamentals, and time-series
              reading — right next to the charts they explain.
            </p>
            <Link to="/register" className="btn-secondary mt-6 inline-flex">Explore the Learning Hub</Link>
          </div>
          <div id="games" className="glass-panel p-6">
            <h3 className="font-display font-semibold mb-4">Learn by playing</h3>
            <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <li>🔍 <strong>Trend Detective</strong> — guess which keyword had more searches</li>
              <li>⚔️ <strong>Keyword Battle</strong> — pick the winner between two terms</li>
              <li>📈 <strong>Trend Prediction</strong> — call next month's move before the reveal</li>
              <li>🧠 <strong>Daily SEO Quiz</strong> — five questions, fresh every day</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <h2 className="font-display text-3xl font-semibold mb-10">Trusted by people who track trends for a living</h2>
        <div className="grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <div key={t.name} className="glass-panel p-6">
              <p className="text-sm text-slate-600 dark:text-slate-300">“{t.quote}”</p>
              <div className="mt-4 text-sm font-medium">{t.name}</div>
              <div className="text-xs text-slate-400">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
        <h2 className="font-display text-3xl font-semibold mb-6">Frequently asked</h2>
        {faqs.map((f) => (
          <FaqItem key={f.q} q={f.q} a={f.a} />
        ))}
      </section>
    </div>
  )
}
