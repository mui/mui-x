import * as React from 'react';

import { StandaloneDayView } from '@mui/x-scheduler/day-view';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../datasets/personal-agenda';

export default function BasicDayView() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <StandaloneDayView
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
      />
    </div>
  );
}
