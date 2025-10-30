import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';
import { ToolbarButton } from '@mui/x-data-grid-premium';
import { useCalendarContext } from './CalendarContext';

function CalendarDensity() {
  const { density, setDensity } = useCalendarContext();
  return (
    <ToggleButtonGroup
      value={density}
      onChange={(_, value) => value && setDensity(value)}
      size="small"
      exclusive
    >
      <ToolbarButton render={<ToggleButton value="compact">Compact</ToggleButton>} />
      <ToolbarButton render={<ToggleButton value="comfortable">Comfortable</ToggleButton>} />
    </ToggleButtonGroup>
  );
}

export { CalendarDensity };
