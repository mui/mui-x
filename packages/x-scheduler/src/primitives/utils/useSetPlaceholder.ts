'use client';
import { useEventCallback } from '../../base-ui-copy/utils/useEventCallback';
import { Store } from '../../base-ui-copy/utils/store';
import { useAdapter } from './adapter/useAdapter';
import { EventData } from '../models';

export function useSetPlaceholder<State extends { placeholder: EventData | null }>(
  store: Store<State>,
) {
  const adapter = useAdapter();

  const setPlaceholder = useEventCallback((newPlaceholder: EventData | null) => {
    const placeholder = store.state.placeholder;

    if (
      newPlaceholder != null &&
      placeholder != null &&
      adapter.isEqual(newPlaceholder.start, placeholder.start) &&
      adapter.isEqual(newPlaceholder.end, placeholder.end) &&
      placeholder.id === newPlaceholder.id
    ) {
      return;
    }

    store.set('placeholder', newPlaceholder);
  });

  return setPlaceholder;
}
