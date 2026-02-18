import { SxProps } from '@mui/system/styleFunctionSx';
import { Theme } from '@mui/material/styles';
import { SchedulerProcessedDate } from '@mui/x-scheduler-headless/models';

export interface DayTimeGridProps extends ExportedDayTimeGridProps {
  /**
   * The days to render in the time grid view.
   */
  days: SchedulerProcessedDate[];
}

export interface ExportedDayTimeGridProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
}
