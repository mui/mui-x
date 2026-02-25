import * as React from 'react';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import { EventCalendarPremium } from '@mui/x-scheduler-premium/event-calendar-premium';

import {
  resources,
  defaultVisibleDate,
  getEvents,
  updateEvents,
} from './fakeServer';

export default function ErrorHandling() {
  const [failRequests, setFailRequests] = React.useState(false);

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

  return (
    <Stack spacing={2} width="100%">
      <FormControlLabel
        control={
          <Switch
            checked={failRequests}
            onChange={(event) => setFailRequests(event.target.checked)}
          />
        }
        label="Fail requests"
      />
      <div style={{ height: '700px', width: '100%' }}>
        <EventCalendarPremium
          events={[]}
          dataSource={{ getEvents: fetchData, updateEvents }}
          resources={resources}
          defaultVisibleDate={defaultVisibleDate}
          defaultPreferences={{ isSidePanelOpen: false }}
        />
      </div>
    </Stack>
  );
}
