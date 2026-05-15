export default function Navbar({ page, setPage, token, setToken }) {
  return (
    <nav className="navbar">
      <span className="navbar-brand" onClick={() => setPage('home')}>
        <span>Micro</span>Finance<span> Study</span>
      </span>
      <div className="navbar-links">
        <button className={`nav-link ${page === 'home' ? 'active' : ''}`} onClick={() => setPage('home')}>
          Home
        </button>
        <button className={`nav-link ${page === 'questionnaire' ? 'active' : ''}`} onClick={() => setPage('questionnaire')}>
          Survey
        </button>
        {token ? (
          <>
            <button className={`nav-link ${page === 'dashboard' ? 'active' : ''}`} onClick={() => setPage('dashboard')}>
              Dashboard
            </button>
            <button
              className="nav-link"
              onClick={() => {
                setToken(null);
                setPage('home');
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <button className={`nav-link ${page === 'adminlogin' ? 'active' : ''}`} onClick={() => setPage('adminlogin')}>
            Admin
          </button>
        )}
      </div>
    </nav>
  );
}
