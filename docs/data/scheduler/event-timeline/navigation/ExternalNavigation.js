import * as React from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { useEventTimelinePremiumApiRef } from '@mui/x-scheduler-premium/use-event-timeline-premium-api-ref';

import {
  initialEvents,
  resources as allResources,
  defaultVisibleDate,
} from '../../datasets/company-roadmap';

const resources = allResources.slice(0, 5);

const presetOptions = [
  { value: 'dayAndHour', label: 'Time' },
  { value: 'day', label: 'Days' },
  { value: 'dayAndWeek', label: 'Weeks' },
  { value: 'monthAndYear', label: 'Months' },
  { value: 'year', label: 'Years' },
];

export default function ExternalNavigation() {
  const [events, setEvents] = React.useState(initialEvents);
  const [preset, setPreset] = React.useState('monthAndYear');
  const [visibleDate, setVisibleDate] = React.useState(defaultVisibleDate);
  const apiRef = useEventTimelinePremiumApiRef();

  const handlePresetChange = (event) => {
    setPreset(event.target.value);
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <IconButton
          onClick={(event) => apiRef.current?.goToPreviousVisibleDate(event)}
        >
          <ChevronLeftIcon />
        </IconButton>
        <Button
          variant="outlined"
          onClick={(event) =>
            apiRef.current?.setVisibleDate({ visibleDate: new Date(), event })
          }
        >
          Today
        </Button>
        <IconButton onClick={(event) => apiRef.current?.goToNextVisibleDate(event)}>
          <ChevronRightIcon />
        </IconButton>
        <Select value={preset} onChange={handlePresetChange} size="small">
          {presetOptions.map(({ value, label }) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      </Stack>
      <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
        <EventTimelinePremium
          apiRef={apiRef}
          events={events}
          resources={resources}
          preset={preset}
          onPresetChange={setPreset}
          visibleDate={visibleDate}
          onVisibleDateChange={setVisibleDate}
          onEventsChange={setEvents}
        />
      </div>
    </Stack>
  );
}
