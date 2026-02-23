import { useEffect, useRef } from "react";
import "react-circular-progressbar/dist/styles.css";
import { CircularProgressbar } from "react-circular-progressbar";
import styles from "./ProgressBar.module.css";

export type ProgressBarProps = {
  value: number;
  max: number;
  size?: number;
  strokeWidth?: number;
  showValue?: boolean;
  className?: string;
};

export function ProgressBar({
  value,
  max,
  size = 32,
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
  const loggedRef = useRef(false);

  useEffect(() => {
    if (import.meta.env.DEV && !loggedRef.current) {
      loggedRef.current = true;
      console.debug("ProgressBar", {
        value,
        max,
        safeValue,
        safeMax,
        percentage,
      });
    }
  }, [value, max, safeValue, safeMax, percentage]);

  return (
    <div
      className={`${styles.progressBar} ${className ?? ""}`.trim()}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Progress ${percentage}%`}
    >
      <CircularProgressbar
        value={safeValue}
        maxValue={safeMax || 100}
        strokeWidth={strokeWidth}
        text={showValue ? `${percentage}%` : ""}
        styles={{
          path: {
            stroke: "#2bd627",
            strokeLinecap: "round",
            transition: "stroke-dashoffset 0.3s ease",
          },
          trail: { stroke: "#d4f8d3" },
          text: { fill: "#64748b", fontSize: "28px" },
        }}
      />
    </div>
  );
}
