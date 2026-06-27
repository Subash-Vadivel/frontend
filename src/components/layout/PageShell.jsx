export default function PageShell({ title, eyebrow, description, actions, children, className = '' }) {
  return (
    <section className={`page-shell ${className}`.trim()}>
      <header className="page-command">
        <div>
          {eyebrow && <p className="eyebrow">{eyebrow}</p>}
          <h1>{title}</h1>
          {description && <p className="page-description">{description}</p>}
        </div>
        {actions && <div className="page-actions">{actions}</div>}
      </header>
      {children}
    </section>
  );
}
