import * as React from 'react';

import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { defaultVisibleDate, resources } from '../../../data/scheduler/datasets/personal-agenda';

const API_KEY = process.env.NEXT_PUBLIC_SCHEDULER_AI_API_KEY ?? '';

export default function FullScreenAiHelper() {
  const [events, setEvents] = React.useState([]);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <EventCalendar
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        aiHelper={!!API_KEY}
        aiHelperApiKey={API_KEY}
        aiHelperModel="claude-3-haiku-20240307"
        aiHelperDefaultDuration={60}
      />
    </div>
  );
}
