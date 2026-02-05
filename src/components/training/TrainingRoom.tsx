import { useBreakpoint } from "../../hooks/useBreakpoint";
import type { TrainingRoomProps } from "../../types/training";
import { TrainingRoomDesktop } from "./TrainingRoomDesktop";
import { TrainingRoomMobile } from "./TrainingRoomMobile";

export function TrainingRoom({ tasks, onSubmit }: TrainingRoomProps) {
  const { isDesktop } = useBreakpoint();
  return isDesktop ? (
    <TrainingRoomDesktop tasks={tasks} onSubmit={onSubmit} />
  ) : (
    <TrainingRoomMobile tasks={tasks} onSubmit={onSubmit} />
  );
}
