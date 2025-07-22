import * as React from 'react';
import { useModernLayoutEffect } from '@base-ui-components/react/utils';
import { EventCalendarStoreContext } from '../internals/hooks/useEventCalendarStore';
import { Store } from '../../base-ui-copy/utils/store';
import { useLazyRef } from '../../base-ui-copy/utils/useLazyRef';
import { EventCalendarProps } from '../event-calendar/EventCalendar.types';
import { State } from '../event-calendar/store';
import { getAdapter } from '../../primitives/utils/adapter/getAdapter';

const adapter = getAdapter();

/**
 * Temporary component to help rendering standalone views in the doc.
 * A clean solution will be implemented later.
 */
export function StandaloneView(props: StandaloneViewProps) {
  const { children, events, resources } = props;

  const store = useLazyRef(
    () =>
      new Store<State>({
        events,
        resources: resources || [],
        visibleResources: new Map(),
        visibleDate: adapter.date('2025-05-26'),
        currentView: 'week',
        views: ['week', 'day', 'month', 'agenda'],
      }),
  ).current;

  useModernLayoutEffect(() => {
    store.apply({ events, resources });
  }, [events, resources]);

  return (
    <EventCalendarStoreContext.Provider value={store}>
      {children}
    </EventCalendarStoreContext.Provider>
  );
}

export interface StandaloneViewProps extends Pick<EventCalendarProps, 'events' | 'resources'> {
  children?: React.ReactNode;
}
