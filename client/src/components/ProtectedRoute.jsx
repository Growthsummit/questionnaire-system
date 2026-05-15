export default function ProtectedRoute({ token, children, setPage }) {
  if (!token) {
    return (
      <div className="flex-center" style={{ minHeight: 'calc(100vh - 64px)', flexDirection: 'column', gap: '1rem', background: 'var(--cream)' }}>
        <div style={{ fontSize: '2.5rem' }}>🔒</div>
        <h2 className="section-title font-display">Access Restricted</h2>
        <p className="text-muted text-sm">You need to sign in as an administrator to view this page.</p>
        <button className="btn btn-primary" onClick={() => setPage('adminlogin')}>
          Sign In
        </button>
      </div>
    );
  }
  return children;
}
