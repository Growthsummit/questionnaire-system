export default function CheckOpt({ checked, onChange, label }) {
  return (
    <label className={`option-row ${checked ? 'selected' : ''}`} onClick={() => onChange(!checked)}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
