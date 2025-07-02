import * as React from 'react';

import { EventCalendar } from '@mui/x-scheduler/joy/event-calendar';
import {
  events as initialEvents,
  resources,
} from '../../../data/scheduler/event-calendar/month-events';

export default function FullEventCalendar() {
  const [events, setEvents] = React.useState(initialEvents);

  return <EventCalendar events={events} onEventsChange={setEvents} resources={resources} />;
}
