import { useState } from 'react';

export default function AdminLogin({ setPage, setToken }) {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(creds),
      });
      if (!res.ok) throw new Error('Invalid credentials');
      const data = await res.json();
      localStorage.setItem('mf_admin_token', data.token);
      setToken(data.token);
      setPage('dashboard');
    } catch (err) {
      setError('Invalid username or password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="login-wrap">
      <div className="login-card">
        <div className="section-eyebrow">Admin Portal</div>
        <h2 className="section-title font-display">Sign In</h2>
        <p className="text-sm text-muted mt-1">Access the research dashboard and responses.</p>
        <hr className="rule" />
        {error && <div className="alert alert-error">{error}</div>}
        <div className="field">
          <label className="label">Username</label>
          <input
            className="input"
            placeholder="admin"
            value={creds.username}
            onChange={(e) => setCreds((prev) => ({ ...prev, username: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && login()}
          />
        </div>
        <div className="field">
          <label className="label">Password</label>
          <input
            className="input"
            type="password"
            placeholder="••••••••"
            value={creds.password}
            onChange={(e) => setCreds((prev) => ({ ...prev, password: e.target.value }))}
            onKeyDown={(e) => e.key === 'Enter' && login()}
          />
        </div>
        <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={login} disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" />&nbsp;Signing in…
            </>
          ) : (
            'Sign In →'
          )}
        </button>
        <p className="text-sm text-muted mt-2 text-center">Demo credentials: BEEKAY / LETSOELA</p>
      </div>
    </div>
  );
}
