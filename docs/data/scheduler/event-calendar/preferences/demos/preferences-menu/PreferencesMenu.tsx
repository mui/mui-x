import * as React from 'react';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../../../datasets/personal-agenda';

export default function PreferencesMenu() {
  // @focus-start @padding 1
  const [events, setEvents] = React.useState<SchedulerEvent[]>(initialEvents);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendar
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        preferencesMenuConfig={{
          toggleWeekendVisibility: false,
          toggleWeekStartsOn: true,
        }}
        defaultPreferences={{ isSidePanelOpen: false, weekStartsOn: 0 }}
      />
    </div>
  );
  // @focus-end
}
