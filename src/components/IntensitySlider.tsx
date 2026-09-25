interface IntensitySliderProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
  label: string;
  hint?: string;
}

export function IntensitySlider({
  id,
  value,
  onChange,
  label,
  hint,
}: IntensitySliderProps) {
  return (
    <div className="intensity-control">
      <label htmlFor={id}>{label}</label>
      <div className="intensity-value" aria-live="polite">
        <strong>{value}</strong>
        <span>/ 100</span>
      </div>
      <input
        id={id}
        className="intensity-input"
        type="range"
        min="0"
        max="100"
        step="5"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      <div className="range-labels" aria-hidden="true">
        <span>很平稳</span>
        <span>非常强烈</span>
      </div>
      {hint && <p className="field-hint">{hint}</p>}
    </div>
  );
}
