export default function DataPanel({ title, eyebrow, description, action, children, className = '' }) {
  return (
    <section className={`data-panel ${className}`.trim()}>
      {(title || eyebrow || description || action) && (
        <div className="panel-heading">
          <div>
            {eyebrow && <p className="panel-eyebrow">{eyebrow}</p>}
            {title && <h2>{title}</h2>}
            {description && <p>{description}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
