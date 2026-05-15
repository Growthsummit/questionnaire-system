export default function Radio({ name, value, checked, onChange, label }) {
  return (
    <label className={`option-row ${checked ? 'selected' : ''}`} onClick={() => onChange(value)}>
      <input type="radio" name={name} value={value} checked={checked} onChange={() => onChange(value)} />
      <span>{label}</span>
    </label>
  );
}
