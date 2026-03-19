interface SliderFieldProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  helper: string;
  onChange: (value: number) => void;
}

export function SliderField({
  label,
  value,
  min,
  max,
  step = 1,
  helper,
  onChange,
}: SliderFieldProps) {
  return (
    <label className="soft-card block p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-semibold text-foreground">{label}</span>
        <span className="rounded-full border border-border/10 bg-card/70 px-3 py-1 text-xs font-semibold text-muted">
          {value}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-card accent-accent"
      />
      <p className="mt-2 text-xs leading-5 text-muted">{helper}</p>
    </label>
  );
}
