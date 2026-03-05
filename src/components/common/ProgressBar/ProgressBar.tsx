import type { CSSProperties } from "react";
import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbar } from "react-circular-progressbar";
import styles from "./ProgressBar.module.css";

export type ProgressBarProps = {
  value: number;
  max: number;
  size?: number;
  color?: string;
  strokeWidth?: number;
  showValue?: boolean;
  className?: string;
};

export function ProgressBar({
  value,
  max,
  size,
  color,
  strokeWidth = 10,
  showValue = false,
  className,
}: ProgressBarProps) {
  const parsedValue = Number(value);
  const parsedMax = Number(max);
  const safeValue = Number.isFinite(parsedValue) ? parsedValue : 0;
  const safeMax = Number.isFinite(parsedMax) && parsedMax > 0 ? parsedMax : 0;
  const percentage =
    safeMax === 0 ? 0 : Math.min(100, Math.round((safeValue / safeMax) * 100));

  const cssVars: CSSProperties = {};

  if (typeof size === "number") {
    (cssVars as Record<string, string>)["--progress-size"] = `${size}px`;
  }

  if (typeof color === "string" && color.trim()) {
    (cssVars as Record<string, string>)["--progress-color"] = color;
  }

  return (
    <div
      className={`${styles.progressBar} ${className ?? ""}`.trim()}
      style={Object.keys(cssVars).length > 0 ? cssVars : undefined}
      role="img"
      aria-label={`Progress ${percentage}%`}
    >
      <CircularProgressbar
        value={safeValue}
        maxValue={safeMax || 100}
        strokeWidth={strokeWidth}
        text={showValue ? `${percentage}%` : ""}
      />
    </div>
  );
}
