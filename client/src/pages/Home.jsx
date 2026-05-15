import { C } from '../data.js';

export default function Home({ setPage }) {
  return (
    <div className="page">
      <div className="hero">
        <div className="container" style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-eyebrow">Limkokwing University · Maseru, Lesotho</div>
          <h1 className="hero-title">The Effects of Access to Microfinance on Informal Business Growth</h1>
          <p className="hero-sub">A research study by Bokang Ts'oari examining how small-scale financial services shape the futures of clothing vendors in Maseru City.</p>
          <div className="hero-actions">
            <button className="btn btn-gold" onClick={() => setPage('questionnaire')}>
              Participate in Survey →
            </button>
            <button className="btn btn-outline" style={{ color: '#B0A898', borderColor: '#555' }} onClick={() => setPage('adminlogin')}>
              Admin Portal
            </button>
          </div>
        </div>
      </div>

      <div className="info-band">
        <div className="container">
          <div className="grid-3">
            {[
              { icon: '📋', title: '10–15 Minutes', desc: 'A short, straightforward questionnaire with fixed choices.' },
              { icon: '🔒', title: 'Fully Confidential', desc: 'Your name and personal details will never appear in any report.' },
              { icon: '🤝', title: 'Voluntary', desc: 'You may withdraw at any time without any penalty.' },
            ].map((item) => (
              <div key={item.title} className="info-item">
                <div className="info-icon">{item.icon}</div>
                <div>
                  <div className="info-item-title">{item.title}</div>
                  <div className="info-item-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="py-6">
        <div className="container">
          <div className="grid-2" style={{ alignItems: 'start', gap: '3rem' }}>
            <div>
              <div className="section-eyebrow">About the Research</div>
              <h2 className="section-title">Why This Study Matters</h2>
              <p className="section-body">Informal clothing vendors play a vital role in Maseru's economy, yet most cannot access the financial services needed to grow. This study examines whether microfinance—small loans, savings accounts, and financial training—makes a measurable difference.</p>
              <p className="section-body mt-2">Your experience as a trader is the data that policy-makers and financial institutions need to design better, more accessible support programs.</p>
              <button className="btn btn-primary mt-3" onClick={() => setPage('questionnaire')}>
                Take the Survey
              </button>
            </div>
            <div>
              <div className="section-eyebrow">Study Sections</div>
              <h2 className="section-title">What You'll Be Asked</h2>
              <div className="mt-3">
                {[
                  { label: 'A', name: 'Demographic Information', desc: 'Gender, age, education, years in business' },
                  { label: 'B', name: 'Financial Access', desc: 'Services used, barriers, funding sources' },
                  { label: 'C', name: 'Business Performance', desc: 'Stock, sales levels, and recent trends' },
                  { label: 'D', name: 'Effects of Microfinance', desc: 'Your opinions on a 5-point scale' },
                  { label: 'E', name: 'Challenges', desc: 'Growth and access barriers you face' },
                  { label: 'F', name: 'Suggestions', desc: 'What support would help most' },
                ].map((section) => (
                  <div key={section.label} className="flex gap-2 mt-2" style={{ alignItems: 'flex-start' }}>
                    <div style={{ width: 28, height: 28, borderRadius: '50%', background: C.teal, color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.78rem', fontWeight: 700, flexShrink: 0, marginTop: 2 }}>
                      {section.label}
                    </div>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{section.name}</div>
                      <div style={{ fontSize: '0.83rem', color: '#666' }}>{section.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: C.ink, color: C.paper, padding: '2rem 0', textAlign: 'center' }}>
        <div className="container">
          <p className="text-sm" style={{ color: '#888' }}>© 2025 Bokang Ts'oari · Limkokwing University of Creative Technology · Maseru, Lesotho</p>
        </div>
      </div>
    </div>
  );
}
