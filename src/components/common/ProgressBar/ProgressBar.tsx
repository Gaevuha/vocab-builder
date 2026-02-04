export type ProgressBarProps = {
  value: number;
  max: number;
};

export function ProgressBar({ value, max }: ProgressBarProps) {
  const percentage =
    max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100));

  return (
    <div
      className="progress-bar"
      role="progressbar"
      aria-valuenow={percentage}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div className="progress-bar__fill" style={{ width: `${percentage}%` }} />
      <span className="progress-bar__label">{percentage}%</span>
    </div>
  );
}
