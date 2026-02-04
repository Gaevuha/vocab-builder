import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export type ProgressBarProps = {
  value: number;
  max: number;
};

export function ProgressBar({ value, max }: ProgressBarProps) {
  const percentage =
    max === 0 ? 0 : Math.min(100, Math.round((value / max) * 100));

  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
      <Box sx={{ width: "100%" }}>
        <LinearProgress
          variant="determinate"
          value={percentage}
          aria-valuenow={percentage}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </Box>
      <Typography variant="body2" color="text.secondary">
        {percentage}%
      </Typography>
    </Box>
  );
}
