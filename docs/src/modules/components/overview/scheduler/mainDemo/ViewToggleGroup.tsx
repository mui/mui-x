import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup, { toggleButtonGroupClasses } from '@mui/material/ToggleButtonGroup';
import Paper from '@mui/material/Paper';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import ViewTimelineIcon from '@mui/icons-material/ViewTimeline';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(({ theme }) => ({
  gap: theme.spacing(0.5),
  padding: theme.spacing(0.5),
  [`& .${toggleButtonGroupClasses.grouped}`]: {
    border: 0,
    borderRadius: theme.shape.borderRadius,
  },
}));

export type SchedulerView = 'calendar' | 'timeline';

export type ViewToggleGroupProps = {
  selected: SchedulerView;
  onToggleChange: (value: SchedulerView) => void;
};

export default function ViewToggleGroup({ selected, onToggleChange }: ViewToggleGroupProps) {
  return (
    <Paper
      elevation={0}
      sx={(theme) => ({
        display: 'flex',
        border: `1px solid ${theme.palette.divider}`,
        flexWrap: 'wrap',
        width: 'fit-content',
      })}
    >
      <StyledToggleButtonGroup
        orientation="horizontal"
        value={selected}
        exclusive
        size="small"
        onChange={(_event, value) => {
          if (value && value !== selected) {
            onToggleChange(value);
          }
        }}
      >
        <ToggleButton value="calendar" title="Event Calendar" sx={{ gap: 1 }}>
          <CalendarMonthIcon fontSize="small" />
          Event Calendar
        </ToggleButton>
        <ToggleButton value="timeline" title="Event Timeline" sx={{ gap: 1 }}>
          <ViewTimelineIcon fontSize="small" />
          Event Timeline
        </ToggleButton>
      </StyledToggleButtonGroup>
    </Paper>
  );
}
