import { useState } from 'react';
import { LIKERT_QS } from '../data.js';

export default function Dashboard({ responses, setPage, setToken }) {
  const [tab, setTab] = useState('overview');
  const [selectedResponse, setSelectedResponse] = useState(null);

  const count = responses.length;
  const pct = (field, value) => {
    const total = responses.filter((item) => item[field] === value).length;
    return count ? Math.round((total / count) * 100) : 0;
  };
  const avgLikert = (key) => {
    if (!count) return 0;
    return (responses.reduce((sum, item) => sum + (item.likert?.[key] || 0), 0) / count).toFixed(1);
  };
  const freq = (field) => {
    const accumulator = {};
    responses.forEach((item) => {
      const values = Array.isArray(item[field]) ? item[field] : [item[field]];
      values.forEach((value) => {
        if (value) {
          accumulator[value] = (accumulator[value] || 0) + 1;
        }
      });
    });
    return Object.entries(accumulator).sort((a, b) => b[1] - a[1]);
  };

  const MiniBar = ({ data, total }) => (
    <div className="bar-chart">
      {data.map(([label, value]) => (
        <div key={label} className="bar-row">
          <div className="bar-label">{label}</div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: `${total ? (value / total) * 100 : 0}%` }} />
          </div>
          <div className="bar-count">{value}</div>
        </div>
      ))}
    </div>
  );

  const tabs = ['overview', 'charts', 'responses'];

  return (
    <div className="admin-layout">
      <aside className="sidebar">
        <div className="sidebar-label">Navigation</div>
        {tabs.map((item) => (
          <button key={item} className={`sidebar-item ${tab === item ? 'active' : ''}`} onClick={() => setTab(item)}>
            {item === 'overview' && '📊 '}
            {item === 'charts' && '📈 '}
            {item === 'responses' && '📋 '}
            {item.charAt(0).toUpperCase() + item.slice(1)}
          </button>
        ))}
        <div className="sidebar-label" style={{ marginTop: 'auto' }}>
          Actions
        </div>
        <button className="sidebar-item" onClick={() => setPage('questionnaire')}>
          ➕ New Survey
        </button>
        <button className="sidebar-item" onClick={() => {
          setToken(null);
          localStorage.removeItem('mf_admin_token');
          setPage('home');
        }}>
          🚪 Logout
        </button>
      </aside>

      <main className="main-panel">
        {tab === 'overview' && (
          <>
            <div className="section-eyebrow">Admin Dashboard</div>
            <h2 className="section-title font-display">Research Overview</h2>
            <p className="text-sm text-muted">The Effects of Access to Microfinance · Maseru City</p>

            <div className="grid-4 mt-3">
              {[{
                num: count,
                lbl: 'Total Responses',
              }, {
                num: `${pct('has_financial_access', 'Yes')}%`,
                lbl: 'Have Financial Access',
              }, {
                num: freq('sales_trend').find(([key]) => key === 'Increased')?.[1] || 0,
                lbl: 'Sales Increased',
              }, {
                num: avgLikert('q1'),
                lbl: 'Avg: MF Helps Growth',
              }].map((item) => (
                <div key={item.lbl} className="card stat-box">
                  <div className="stat-num">{item.num}</div>
                  <div className="stat-lbl">{item.lbl}</div>
                </div>
              ))}
            </div>

            <div className="grid-2 mt-3" style={{ alignItems: 'start' }}>
              <div className="card">
                <div className="section-eyebrow">Demographics</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', marginBottom: '1rem' }}>Gender Distribution</h3>
                <MiniBar data={freq('gender')} total={count} />
              </div>
              <div className="card">
                <div className="section-eyebrow">Business Performance</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', marginBottom: '1rem' }}>Sales Trend</h3>
                <MiniBar data={freq('sales_trend')} total={count} />
              </div>
              <div className="card">
                <div className="section-eyebrow">Growth Obstacles</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', marginBottom: '1rem' }}>Top Challenges</h3>
                <MiniBar data={freq('challenges_growth').slice(0, 5)} total={count} />
              </div>
              <div className="card">
                <div className="section-eyebrow">Support Needed</div>
                <h3 style={{ fontFamily: "'Playfair Display',serif", fontSize: '1rem', marginBottom: '1rem' }}>Requested Support</h3>
                <MiniBar data={freq('support_needed')} total={count} />
              </div>
            </div>
          </>
        )}

        {tab === 'charts' && (
          <>
            <div className="section-eyebrow">Analytics</div>
            <h2 className="section-title font-display">Likert Scale Analysis</h2>
            <p className="text-sm text-muted mt-1">Average score per statement (5 = Strongly Agree)</p>

            <div className="card mt-3">
              {LIKERT_QS.map((question, index) => {
                const key = `q${index + 1}`;
                const avg = parseFloat(avgLikert(key));
                const pctWidth = (avg / 5) * 100;
                const color = avg >= 4 ? 'var(--teal)' : avg >= 3 ? 'var(--gold)' : 'var(--rust)';
                return (
                  <div key={key} style={{ padding: '1rem 0', borderBottom: '1px solid #EDE7D9' }}>
                    <div className="flex-between mb-1">
                      <span style={{ fontSize: '0.9rem' }}>{question}</span>
                      <span style={{ fontFamily: "'Playfair Display',serif", fontWeight: 700, color, fontSize: '1.1rem', marginLeft: '1rem', whiteSpace: 'nowrap' }}>{avg}</span>
                    </div>
                    <div style={{ height: 8, background: 'var(--cream)', borderRadius: 4, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pctWidth}%`, background: color, borderRadius: 4, transition: 'width 0.6s' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {tab === 'responses' && (
          <>
            <div className="section-eyebrow">Responses</div>
            <h2 className="section-title font-display">Survey Responses</h2>
            <div className="table-wrap mt-3">
              <table>
                <thead>
                  <tr>
                    <th>Submitted</th>
                    <th>Participant</th>
                    <th>Gender</th>
                    <th>Age</th>
                    <th>Sales Trend</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {responses.map((response) => (
                    <tr
                      key={response.id}
                      onClick={() => setSelectedResponse(response)}
                      style={{ cursor: 'pointer', background: selectedResponse?.id === response.id ? '#f6f7f8' : 'transparent' }}
                    >
                      <td>{response.timestamp}</td>
                      <td>{response.name || 'Anonymous'}</td>
                      <td>{response.gender}</td>
                      <td>{response.age}</td>
                      <td>{response.sales_trend}</td>
                      <td>{selectedResponse?.id === response.id ? 'Selected' : 'View'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card mt-4">
              <div className="section-eyebrow">Full Response Detail</div>
              {!selectedResponse ? (
                <p className="text-sm text-muted mt-2">Select a row above to view the complete response form.</p>
              ) : (
                <div className="grid-2 mt-3" style={{ gap: '1.5rem' }}>
                  <div>
                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--rust)', marginBottom: '0.5rem' }}>Participant Credentials</h4>
                    <div className="detail-row"><strong>Full Name</strong>: {selectedResponse.name || '—'}</div>
                    <div className="detail-row"><strong>Survey Date</strong>: {selectedResponse.date || '—'}</div>
                    <div className="detail-row"><strong>Gender</strong>: {selectedResponse.gender || '—'}</div>
                    <div className="detail-row"><strong>Age Group</strong>: {selectedResponse.age || '—'}</div>
                    <div className="detail-row"><strong>Education Level</strong>: {selectedResponse.education || '—'}</div>
                    <div className="detail-row"><strong>Years in Business</strong>: {selectedResponse.years_in_business || '—'}</div>
                    
                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--rust)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Business Performance</h4>
                    <div className="detail-row"><strong>Stock per Week</strong>: {selectedResponse.stock_per_week || '—'}</div>
                    <div className="detail-row"><strong>Business Sales</strong>: {selectedResponse.business_sales || '—'}</div>
                    <div className="detail-row"><strong>Sales Trend (1yr)</strong>: {selectedResponse.sales_trend || '—'}</div>
                    <div className="detail-row"><strong>Growth Challenges</strong>: {selectedResponse.challenges_growth?.length ? selectedResponse.challenges_growth.join(', ') : '—'}</div>
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--rust)', marginBottom: '0.5rem' }}>Financial Profile</h4>
                    <div className="detail-row"><strong>Financial Access</strong>: {selectedResponse.has_financial_access || '—'}</div>
                    {selectedResponse.has_financial_access === 'Yes' ? (
                      <div className="detail-row"><strong>Financial Services</strong>: {selectedResponse.financial_services?.length ? selectedResponse.financial_services.join(', ') : '—'}</div>
                    ) : (
                      <div className="detail-row"><strong>Reason for No Access</strong>: {selectedResponse.no_access_reason || '—'}</div>
                    )}
                    <div className="detail-row"><strong>Primary Funding</strong>: {selectedResponse.funding_source || '—'}</div>
                    <div className="detail-row"><strong>MF Challenges</strong>: {selectedResponse.challenges_microfinance?.length ? selectedResponse.challenges_microfinance.join(', ') : '—'}</div>
                    
                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--rust)', marginTop: '1.5rem', marginBottom: '0.5rem' }}>Support & Feedback</h4>
                    <div className="detail-row"><strong>Support Needed</strong>: {selectedResponse.support_needed?.length ? selectedResponse.support_needed.join(', ') : '—'}</div>
                    <div className="detail-row"><strong>Comments</strong>: {selectedResponse.comments || '—'}</div>
                  </div>
                  <div style={{ gridColumn: '1 / -1', marginTop: '1rem', borderTop: '1px solid #EDE7D9', paddingTop: '1rem' }}>
                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--rust)', marginBottom: '0.5rem' }}>Likert Scale Responses</h4>
                    <div className="grid-2">
                      {LIKERT_QS.map((question, index) => (
                        <div key={question} className="detail-row" style={{ fontSize: '0.9rem', padding: '0.4rem 0' }}>
                          <span style={{ color: '#666' }}>{question}</span><br />
                          <strong>{selectedResponse.likert?.[`q${index + 1}`] ?? '—'} / 5</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
