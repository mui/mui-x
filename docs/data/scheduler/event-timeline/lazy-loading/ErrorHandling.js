import * as React from 'react';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';
import { useEventTimelinePremiumApiRef } from '@mui/x-scheduler-premium/use-event-timeline-premium-api-ref';

import {
  resources as allResources,
  defaultVisibleDate,
  getEvents,
  updateEvents,
} from './fakeServer';

const resources = allResources.slice(0, 5);

const presetOptions = [
  { value: 'dayAndMonth', label: 'Days' },
  { value: 'dayAndWeek', label: 'Weeks' },
];

const presets = presetOptions.map((option) => option.value);

export default function ErrorHandling() {
  const [failRequests, setFailRequests] = React.useState(false);
  const [preset, setPreset] = React.useState('dayAndMonth');
  const [visibleDate, setVisibleDate] = React.useState(defaultVisibleDate);
  const apiRef = useEventTimelinePremiumApiRef();

  const fetchData = React.useCallback(
    async (start, end) => {
      if (failRequests) {
        return new Promise((_resolve, reject) => {
          setTimeout(() => reject(new Error('Error fetching data')), 500);
        });
      }
      return getEvents(start, end);
    },
    [failRequests],
  );

  const handlePresetChange = (event) => {
    setPreset(event.target.value);
  };

  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
        <FormControlLabel
          control={
            <Switch
              checked={failRequests}
              onChange={(event) => setFailRequests(event.target.checked)}
            />
          }
          label="Fail requests"
        />
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <IconButton
            onClick={(event) => apiRef.current?.goToPreviousVisibleDate(event)}
          >
            <ChevronLeftIcon />
          </IconButton>
          <IconButton
            onClick={(event) => apiRef.current?.goToNextVisibleDate(event)}
          >
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
      </Stack>
      <div style={{ height: '500px', width: '100%', overflow: 'auto' }}>
        <EventTimelinePremium
          apiRef={apiRef}
          dataSource={{ getEvents: fetchData, updateEvents }}
          resources={resources}
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
