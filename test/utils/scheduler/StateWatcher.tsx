import * as React from 'react';
import { EventCalendarStoreContext } from '@mui/x-scheduler/primitives/use-event-calendar-store-context/useEventCalendarStoreContext';
import { EventCalendarState } from '@mui/x-scheduler/primitives/use-event-calendar/EventCalendarStore.types';

type Selector<T> = (state: EventCalendarState) => T;

export function StateWatcher<T>({
  selector,
  onValueChange,
}: {
  selector: Selector<T>;
  onValueChange: (value: T) => void;
}) {
  const store = React.useContext(EventCalendarStoreContext);
  if (!store) {
    throw new Error('StateWatcher must be used inside StandaloneView');
  }

  const getSelected = React.useCallback(() => selector(store.getSnapshot()), [store, selector]);

  const value = React.useSyncExternalStore(store.subscribe, getSelected, getSelected);

  React.useEffect(() => {
    onValueChange(value);
  }, [value, onValueChange]);

  return null;
}
