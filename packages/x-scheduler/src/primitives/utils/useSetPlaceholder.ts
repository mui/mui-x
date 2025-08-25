'use client';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import { Store } from '@base-ui-components/utils/store';
import { useAdapter } from './adapter/useAdapter';
import { CalendarPrimitiveEventData } from '../models';

export function useSetPlaceholder<State extends { placeholder: CalendarPrimitiveEventData | null }>(
  store: Store<State>,
) {
  const adapter = useAdapter();

  const setPlaceholder = useEventCallback((newPlaceholder: CalendarPrimitiveEventData | null) => {
    const placeholder = store.state.placeholder;

    if (
      newPlaceholder != null &&
      placeholder != null &&
      adapter.isEqual(newPlaceholder.start, placeholder.start) &&
      adapter.isEqual(newPlaceholder.end, placeholder.end) &&
      placeholder.eventId === newPlaceholder.eventId &&
      placeholder.columnId === newPlaceholder.columnId
    ) {
      return;
    }

    store.set('placeholder', newPlaceholder);
  });

  return setPlaceholder;
}
