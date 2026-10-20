import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

export default function MetricCard({ title, value, change, direction = 'up', detail, icon: Icon, tone = 'mint' }) {
  const Trend = direction === 'down' ? ArrowDownRight : ArrowUpRight
  return (
    <article className="metric-card">
      <div className={`metric-icon ${tone}`}><Icon size={18} /></div>
      <div className="metric-heading"><span>{title}</span><button aria-label={`More about ${title}`}>···</button></div>
      <div className="metric-value">{value}</div>
      <div className="metric-footer"><span className={`trend ${direction}`}><Trend size={14} />{change}</span><span>{detail}</span></div>
    </article>
  )
}
