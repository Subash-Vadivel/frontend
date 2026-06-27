export default function MetricCard({ label, value, detail, icon: Icon, tone = 'neutral' }) {
  return (
    <article className={`metric-card ${tone}`}>
      <div className="metric-icon">{Icon && <Icon size={18} />}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        {detail && <p>{detail}</p>}
      </div>
    </article>
  );
}
