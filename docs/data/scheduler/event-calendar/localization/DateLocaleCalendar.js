import * as React from 'react';
import { fr } from 'date-fns/locale/fr';

import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import { frFR } from '@mui/x-scheduler/locales';
import {
  initialEvents,
  defaultVisibleDate,
  resources,
} from '../../datasets/personal-agenda';

export default function DateLocaleCalendar() {
  const [events, setEvents] = React.useState(initialEvents);

  return (
    <div style={{ height: '600px', width: '100%' }}>
      <EventCalendar
        events={events}
        resources={resources}
        defaultVisibleDate={defaultVisibleDate}
        onEventsChange={setEvents}
        localeText={frFR.components.MuiEventCalendar.defaultProps.localeText}
        dateLocale={fr}
        defaultPreferences={{ isSidePanelOpen: false }}
      />
    </div>
  );
}
