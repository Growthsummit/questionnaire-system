import { useState } from 'react';
import { C, SECTIONS, TOTAL, LIKERT_QS } from '../data.js';
import QuestionCard from '../components/QuestionCard.jsx';
import Radio from '../components/Radio.jsx';
import CheckOpt from '../components/CheckOpt.jsx';

export default function Questionnaire({ setPage, addResponse }) {
  const [step, setStep] = useState(0);
  const [consented, setConsented] = useState(false);
  const [form, setForm] = useState({
    name: '',
    signature: '',
    date: '',
    gender: '',
    age: '',
    education: '',
    years_in_business: '',
    has_financial_access: '',
    financial_services: [],
    no_access_reason: '',
    funding_source: '',
    stock_per_week: '',
    business_sales: '',
    sales_trend: '',
    likert: { q1: 0, q2: 0, q3: 0, q4: 0, q5: 0, q6: 0 },
    challenges_growth: [],
    challenges_microfinance: [],
    support_needed: [],
    comments: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const toggleArr = (key, value) => setForm((prev) => {
    const current = prev[key];
    return {
      ...prev,
      [key]: current.includes(value) ? current.filter((item) => item !== value) : [...current, value],
    };
  });
  const setLikert = (key, value) => setForm((prev) => ({ ...prev, likert: { ...prev.likert, [key]: value } }));

  const progress = (step / (TOTAL - 1)) * 100;

  const validate = () => {
    if (step === 0 && !consented) return 'Please tick the consent box to continue.';
    if (step === 1) {
      if (!form.gender) return 'Please select your gender.';
      if (!form.age) return 'Please select your age group.';
      if (!form.education) return 'Please select your education level.';
      if (!form.years_in_business) return 'Please select how long you have been in business.';
    }
    if (step === 2) {
      if (!form.has_financial_access) return 'Please answer the financial access question.';
      if (!form.funding_source) return 'Please select how you usually fund your business.';
    }
    if (step === 3) {
      if (!form.stock_per_week || !form.business_sales || !form.sales_trend) return 'Please complete all business performance questions.';
    }
    if (step === 4) {
      if (Object.values(form.likert).some((value) => value === 0)) return 'Please respond to all Likert scale statements.';
    }
    if (step === 5) {
      if (!form.challenges_growth.length) return 'Please select at least one growth challenge.';
      if (!form.challenges_microfinance.length) return 'Please select at least one microfinance challenge.';
    }
    if (step === 6 && !form.support_needed.length) return 'Please select at least one support option.';
    return '';
  };

  const next = () => {
    const err = validate();
    if (err) {
      setError(err);
      return;
    }
    setError('');
    setStep((value) => value + 1);
    window.scrollTo(0, 0);
  };

  const back = () => {
    setError('');
    setStep((value) => value - 1);
    window.scrollTo(0, 0);
  };

  const submit = async () => {
    setSubmitting(true);
    const payload = { ...form };

    const response = await fetch('/api/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      setSubmitting(false);
      setError('Unable to submit your survey. Please try again.');
      return;
    }

    const savedResponse = await response.json();
    addResponse(savedResponse);
    setSubmitting(false);
    setPage('thankyou');
  };

  return (
    <div className="page py-4">
      <div className="container">
        <div className="section-eyebrow">Research Questionnaire</div>
        <h1 className="section-title font-display">The Effects of Access to Microfinance</h1>
        <p className="text-sm text-muted mt-1">Researcher: Bokang Ts'oari · Limkokwing University</p>

        <div className="mt-3">
          <div className="flex-between mb-1">
            <span className="text-sm text-muted">{SECTIONS[step]}</span>
            <span className="progress-label">{step + 1} of {TOTAL}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {error && <div className="alert alert-error">⚠ {error}</div>}

        {step === 0 && (
          <QuestionCard eyebrow="Before You Begin" title="Informed Consent Form">
            <p style={{ fontSize: '0.93rem', color: '#444', lineHeight: 1.8 }}>
              You are invited to participate in a research study about access to microfinance and the growth of informal clothing businesses in Maseru City.
              <br />
              <br />
              Your participation is <strong>voluntary</strong>. You may withdraw at any time without penalty. All information collected will remain <strong>strictly confidential</strong> and used only for academic research.
              The questionnaire takes approximately <strong>10–15 minutes</strong>.
            </p>
            <hr className="rule" />
            <div className="field">
              <label className="label">Participant Name</label>
              <input className="input" placeholder="Enter your full name" value={form.name} onChange={(e) => set('name', e.target.value)} />
            </div>
            <div className="field">
              <label className="label">Today's Date</label>
              <input className="input" type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
            </div>
            <label className={`option-row mt-2 ${consented ? 'selected' : ''}`} onClick={() => setConsented((prev) => !prev)}>
              <input type="checkbox" checked={consented} onChange={(e) => setConsented(e.target.checked)} />
              <span style={{ fontSize: '0.93rem' }}>
                I have read the above information and <strong>voluntarily agree to participate</strong> in this research study.
              </span>
            </label>
          </QuestionCard>
        )}

        {step === 1 && (
          <>
            <QuestionCard eyebrow="Section A" title="1. What is your gender?">
              <div className="options-grid">
                {['Male', 'Female'].map((option) => (
                  <Radio key={option} name="gender" value={option} checked={form.gender === option} onChange={(value) => set('gender', value)} label={option} />
                ))}
              </div>
            </QuestionCard>
            <QuestionCard title="2. What is your age group?">
              <div className="options-grid">
                {['18–25', '26–35', '36–45', '46 and above'].map((option) => (
                  <Radio key={option} name="age" value={option} checked={form.age === option} onChange={(value) => set('age', value)} label={option} />
                ))}
              </div>
            </QuestionCard>
            <QuestionCard title="3. What is your highest level of education?">
              <div className="options-grid">
                {['No formal education', 'Primary education', 'Secondary education', 'Tertiary education'].map((option) => (
                  <Radio key={option} name="education" value={option} checked={form.education === option} onChange={(value) => set('education', value)} label={option} />
                ))}
              </div>
            </QuestionCard>
            <QuestionCard title="4. How long have you been running your clothing business?">
              <div className="options-grid">
                {['Less than 1 year', '1–3 years', '4–6 years', 'More than 6 years'].map((option) => (
                  <Radio key={option} name="years_in_business" value={option} checked={form.years_in_business === option} onChange={(value) => set('years_in_business', value)} label={option} />
                ))}
              </div>
            </QuestionCard>
          </>
        )}

        {step === 2 && (
          <>
            <QuestionCard eyebrow="Section B" title="5. Do you currently have access to financial services?">
              <div className="options-grid">
                {['Yes', 'No'].map((option) => (
                  <Radio key={option} name="has_financial_access" value={option} checked={form.has_financial_access === option} onChange={(value) => set('has_financial_access', value)} label={option} />
                ))}
              </div>
            </QuestionCard>

            {form.has_financial_access === 'Yes' && (
              <QuestionCard title="6a. Which financial services do you use? (tick all that apply)">
                <div className="options-grid">
                  {['Microfinance loans', 'Bank loans', 'Savings groups (stokvel)', 'Mobile money services', 'Other'].map((option) => (
                    <CheckOpt key={option} checked={form.financial_services.includes(option)} onChange={() => toggleArr('financial_services', option)} label={option} />
                  ))}
                </div>
              </QuestionCard>
            )}

            {form.has_financial_access === 'No' && (
              <QuestionCard title="6b. Why do you not have access to financial services?">
                <div className="options-grid">
                  {['No bank account', 'Lack of collateral', 'High interest rates', 'Complicated procedures', 'I do not qualify', 'Other'].map((option) => (
                    <Radio key={option} name="no_access_reason" value={option} checked={form.no_access_reason === option} onChange={(value) => set('no_access_reason', value)} label={option} />
                  ))}
                </div>
              </QuestionCard>
            )}

            <QuestionCard title="7. How do you usually get money to run your business?">
              <div className="options-grid">
                {['Personal savings', 'Family or friends', 'Informal lenders', 'Microfinance loans', 'Other'].map((option) => (
                  <Radio key={option} name="funding_source" value={option} checked={form.funding_source === option} onChange={(value) => set('funding_source', value)} label={option} />
                ))}
              </div>
            </QuestionCard>
          </>
        )}

        {step === 3 && (
          <>
            <QuestionCard eyebrow="Section C" title="8. How much stock do you usually buy per week?">
              <div className="options-grid">
                {['Very little', 'Small amount', 'Moderate amount', 'Large amount'].map((option) => (
                  <Radio key={option} name="stock_per_week" value={option} checked={form.stock_per_week === option} onChange={(value) => set('stock_per_week', value)} label={option} />
                ))}
              </div>
            </QuestionCard>
            <QuestionCard title="9. How would you describe your business sales?">
              <div className="options-grid">
                {['Very low', 'Low', 'Moderate', 'High'].map((option) => (
                  <Radio key={option} name="business_sales" value={option} checked={form.business_sales === option} onChange={(value) => set('business_sales', value)} label={option} />
                ))}
              </div>
            </QuestionCard>
            <QuestionCard title="10. In the past year, have your sales…">
              <div className="options-grid">
                {['Increased', 'Stayed the same', 'Decreased'].map((option) => (
                  <Radio key={option} name="sales_trend" value={option} checked={form.sales_trend === option} onChange={(value) => set('sales_trend', value)} label={option} />
                ))}
              </div>
            </QuestionCard>
          </>
        )}

        {step === 4 && (
          <QuestionCard eyebrow="Section D" title="Please indicate how strongly you agree or disagree with each statement.">
            <div className="likert-header">
              <div className="likert-header-label">Statement</div>
              {['Str. Agree', 'Agree', 'Neutral', 'Disagree', 'Str. Disagree'].map((label) => (
                <div key={label}>{label}</div>
              ))}
            </div>
            {LIKERT_QS.map((question, index) => {
              const key = `q${index + 1}`;
              return (
                <div key={key} className="likert-row">
                  <div className="likert-q">{question}</div>
                  {[5, 4, 3, 2, 1].map((value) => (
                    <div key={value} className="likert-cell">
                      <input type="radio" name={key} checked={form.likert[key] === value} onChange={() => setLikert(key, value)} />
                    </div>
                  ))}
                </div>
              );
            })}
          </QuestionCard>
        )}

        {step === 5 && (
          <>
            <QuestionCard eyebrow="Section E" title="11. What challenges do you face in growing your business? (tick all that apply)">
              <div className="options-grid">
                {['Lack of capital', 'Low sales', 'High competition', 'High transport costs', 'Lack of customers'].map((option) => (
                  <CheckOpt key={option} checked={form.challenges_growth.includes(option)} onChange={() => toggleArr('challenges_growth', option)} label={option} />
                ))}
              </div>
            </QuestionCard>
            <QuestionCard title="12. What challenges prevent vendors from accessing microfinance? (tick all that apply)">
              <div className="options-grid">
                {['High interest rates', 'Lack of collateral', 'Lack of information', 'Complicated application process', 'Financial exclusion'].map((option) => (
                  <CheckOpt key={option} checked={form.challenges_microfinance.includes(option)} onChange={() => toggleArr('challenges_microfinance', option)} label={option} />
                ))}
              </div>
            </QuestionCard>
          </>
        )}

        {step === 6 && (
          <>
            <QuestionCard eyebrow="Section F" title="13. What support would help your business grow? (tick all that apply)">
              <div className="options-grid">
                {['Easier access to loans', 'Financial training', 'Lower interest rates', 'Government support'].map((option) => (
                  <CheckOpt key={option} checked={form.support_needed.includes(option)} onChange={() => toggleArr('support_needed', option)} label={option} />
                ))}
              </div>
            </QuestionCard>
            <QuestionCard title="14. Additional comments or suggestions">
              <textarea className="textarea" placeholder="Share any additional thoughts here (optional)…" value={form.comments} onChange={(e) => set('comments', e.target.value)} />
            </QuestionCard>
          </>
        )}

        {step === 7 && (
          <QuestionCard eyebrow="Review" title="Please confirm your responses before submitting.">
            {[
              ['Participant', form.name || '—'],
              ['Gender', form.gender],
              ['Age', form.age],
              ['Education', form.education],
              ['Years in Business', form.years_in_business],
              ['Financial Access', form.has_financial_access],
              ['Funding Source', form.funding_source],
              ['Stock per Week', form.stock_per_week],
              ['Sales Level', form.business_sales],
              ['Sales Trend', form.sales_trend],
              ['Growth Challenges', form.challenges_growth.join(', ') || '—'],
              ['Microfinance Challenges', form.challenges_microfinance.join(', ') || '—'],
              ['Support Needed', form.support_needed.join(', ') || '—'],
            ].map(([label, value]) => (
              <div key={label} className="flex-between" style={{ padding: '0.55rem 0', borderBottom: '1px solid #EDE7D9', fontSize: '0.9rem' }}>
                <span style={{ color: '#666', minWidth: 200 }}>{label}</span>
                <span style={{ fontWeight: 500, textAlign: 'right' }}>{value}</span>
              </div>
            ))}
            <p className="text-sm text-muted mt-3">By submitting you confirm your responses are accurate and that you consent to participation.</p>
          </QuestionCard>
        )}

        <div className="flex-between mt-4">
          {step > 0 ? <button className="btn btn-outline" onClick={back}>← Back</button> : <div />}
          {step < TOTAL - 1 && <button className="btn btn-primary" onClick={next}>Continue →</button>}
          {step === TOTAL - 1 && (
            <button className="btn btn-gold" onClick={submit} disabled={submitting}>
              {submitting ? (
                <>
                  <span className="spinner" />&nbsp;Submitting…
                </>
              ) : (
                'Submit Survey ✓'
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
