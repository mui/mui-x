import * as React from 'react';
import { EventCalendarStoreContext } from '@mui/x-scheduler/primitives/use-event-calendar-store-context/useEventCalendarStoreContext';
import { CalendarOccurrencePlaceholder } from '@mui/x-scheduler/primitives/models';

export function PlaceholderSeeder({ placeholder }: { placeholder: CalendarOccurrencePlaceholder }) {
  const store = React.useContext(EventCalendarStoreContext);
  if (!store) {
    throw new Error('PlaceholderSeeder must be used inside StandaloneView');
  }

  React.useEffect(() => {
    store.setOccurrencePlaceholder(placeholder);
  }, [store, placeholder]);

  return null;
}
