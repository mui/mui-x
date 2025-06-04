import React from 'react';
import { useCalendarContext } from './CalendarContext';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

function CalendarDensity() {
  const { density, setDensity } = useCalendarContext();
  return (
    <ToggleButtonGroup
      value={density}
      onChange={(_, value) => value && setDensity(value)}
      size="small"
      exclusive
    >
      <ToggleButton value="compact">Compact</ToggleButton>
      <ToggleButton value="comfortable">Comfortable</ToggleButton>
    </ToggleButtonGroup>
  );
}

export { CalendarDensity };
