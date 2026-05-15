export default function QuestionCard({ title, eyebrow, children }) {
  return (
    <div className="card mt-3">
      {eyebrow && <div className="section-eyebrow">{eyebrow}</div>}
      {title && (
        <div style={{ fontFamily: "'Source Serif 4', serif", fontWeight: 600, fontSize: '1rem', marginBottom: '1rem', color: 'var(--ink)' }}>
          {title}
        </div>
      )}
      {children}
    </div>
  );
}
