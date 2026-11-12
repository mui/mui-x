import * as React from 'react';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { defineScenario } from '../utils/scenario';

const pad = (value: number) => String(value).padStart(2, '0');
const time = (minutes: number) => `${pad(Math.floor(minutes / 60))}:${pad(minutes % 60)}:00`;

// 200 events over the week of July 14, 2025: 40 a day from 8:00, one every 15 minutes, half an hour
// each, so they overlap.
const events: SchedulerEvent[] = Array.from({ length: 200 }, (_, index) => {
  const day = `2025-07-${14 + (index % 5)}`;
  const start = 8 * 60 + Math.floor(index / 5) * 15;
  return {
    id: `event-${index}`,
    title: `Event ${index}`,
    start: `${day}T${time(start)}`,
    end: `${day}T${time(start + 30)}`,
  };
});

export const eventCalendar = defineScenario('EventCalendar week view with 200 events', () => (
  <div style={{ width: 1200, height: 700 }}>
    <EventCalendar
      events={events}
      defaultView="week"
      defaultVisibleDate={new Date(2025, 6, 16)}
      defaultPreferences={{ isSidePanelOpen: false }}
    />
  </div>
));
