import * as React from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { useEventTimelinePremiumApiRef } from '@mui/x-scheduler-premium/use-event-timeline-premium-api-ref';
import { EventTimelinePremiumPreset } from '@mui/x-scheduler-headless-premium/models';
import {
  resources as allResources,
  defaultVisibleDate,
  getEvents,
  updateEvents,
} from './fakeServer';

const resources = allResources.slice(0, 5);

const presetOptions: { value: EventTimelinePremiumPreset; label: string }[] = [
  { value: 'dayAndMonth', label: 'Days' },
  { value: 'dayAndWeek', label: 'Weeks' },
];

const presets = presetOptions.map((option) => option.value);

export default function BasicDataSource() {
  const [preset, setPreset] =
    React.useState<EventTimelinePremiumPreset>('dayAndMonth');
  const [visibleDate, setVisibleDate] = React.useState<Date>(defaultVisibleDate);
  const apiRef = useEventTimelinePremiumApiRef();

  const handlePresetChange = (event: SelectChangeEvent) => {
    setPreset(event.target.value as EventTimelinePremiumPreset);
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
        <IconButton
          onClick={(event) => apiRef.current?.goToPreviousVisibleDate(event)}
        >
          <ChevronLeftIcon />
        </IconButton>
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
          dataSource={{ getEvents, updateEvents }}
          resources={resources}
          resourceColumnLabel="Theater"
          presets={presets}
          preset={preset}
          onPresetChange={setPreset}
          visibleDate={visibleDate}
          onVisibleDateChange={setVisibleDate}
        />
      </div>
    </Stack>
  );
}
