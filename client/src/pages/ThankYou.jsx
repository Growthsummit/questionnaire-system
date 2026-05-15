export default function ThankYou({ setPage }) {
  return (
    <div className="thankyou-wrap">
      <div className="thankyou-card">
        <div className="check-circle">✅</div>
        <h2 className="section-title font-display">Thank You!</h2>
        <p style={{ color: '#555', marginTop: '1rem', lineHeight: 1.8 }}>
          Your responses have been successfully recorded. Your participation contributes to valuable research that may help improve financial services for informal traders in Maseru City.
        </p>
        <hr className="rule" />
        <p className="text-sm text-muted mt-3">Researcher: Bokang Ts'oari · Limkokwing University of Creative Technology</p>
        <button className="btn btn-primary mt-3" onClick={() => setPage('home')}>
          Return to Home
        </button>
      </div>
    </div>
  );
}
