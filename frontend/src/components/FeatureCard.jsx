import { motion } from 'framer-motion'

const ACCENTS = ['bg-brand-blue', 'bg-brand-green', 'bg-brand-yellow', 'bg-brand-red']

export default function FeatureCard({ title, desc, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      className="glass-panel p-6"
    >
      <span className={`mb-4 inline-block h-2.5 w-2.5 rounded-full ${ACCENTS[index % ACCENTS.length]}`} />
      <h3 className="font-display text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400">{desc}</p>
    </motion.div>
  )
}
