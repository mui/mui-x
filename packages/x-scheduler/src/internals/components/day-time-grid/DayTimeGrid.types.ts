import { SchedulerProcessedDate } from '@mui/x-scheduler-internals/models';
import { TimeGridEventComponent } from '../event/time-grid-event/TimeGridEvent.types';

export interface DayTimeGridSlots {
  /**
   * The component used to render each event in the time-grid area.
   * @default TimeGridEvent
   */
  timeGridEvent?: TimeGridEventComponent;
}

export interface DayTimeGridProps extends ExportedDayTimeGridProps {
  /**
   * The days to render in the time grid view.
   */
  days: SchedulerProcessedDate[];
  /**
   * Internal slot overrides. Not part of the public API — consumed only by
   * sibling views in `@mui/x-scheduler` (e.g. CompactDayTimeGrid) to swap the
   * time-grid event variant.
   * @internal
   */
  slots?: DayTimeGridSlots;
}

export interface ExportedDayTimeGridProps extends React.HTMLAttributes<HTMLDivElement> {}
