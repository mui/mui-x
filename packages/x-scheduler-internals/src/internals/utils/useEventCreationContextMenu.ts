'use client';
import type * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useSchedulerStoreContext } from '../../use-scheduler-store-context';
import { schedulerEventSelectors, schedulerOtherSelectors } from '../../scheduler-selectors';
import { isCoarsePointer } from './pointer-utils';
import { useGridContextMenuContext } from './GridContextMenuContext';
import type { CreationPlaceholderFields, GetCreationPlaceholderParams } from './useEventCreation';

/**
 * Returns the `onContextMenu` handler that opens the grid context menu when the grid is
 * right-clicked outside any event.
 *
 * Takes the same `getCreationPlaceholder` as `useEventCreation`: the placeholder fields are read
 * when the menu opens, so the "New event" action creates the event at the right-clicked date,
 * time and resource, even though it runs later, once the item is clicked.
 *
 * The menu does not open (and the native browser menu stays) when it would be empty, on a coarse
 * pointer (like the event context menu), or when the right-click targets an event or a button.
 */
export function useEventCreationContextMenu(
  getCreationPlaceholder: (params: GetCreationPlaceholderParams) => CreationPlaceholderFields,
): { onContextMenu?: React.MouseEventHandler<HTMLDivElement> } {
  const store = useSchedulerStoreContext();
  const creationConfig = useStore(store, schedulerEventSelectors.creationConfig);
  const menuContext = useGridContextMenuContext();

  if (!menuContext) {
    return {};
  }

  const onContextMenu = (event: React.MouseEvent<HTMLDivElement>) => {
    // An event's own context menu already handled it.
    if (event.defaultPrevented || isCoarsePointer()) {
      return;
    }
    const target = event.target as HTMLElement;
    if (target !== event.currentTarget && target.closest('button, [role="button"]')) {
      return;
    }

    let createEvent: ((nativeEvent?: Event) => void) | undefined;
    if (creationConfig !== false) {
      const fields = getCreationPlaceholder({
        event,
        creationConfig,
        timezone: schedulerOtherSelectors.displayTimezone(store.state),
      });
      createEvent = (nativeEvent?: Event) => {
        store.setOccurrencePlaceholder({ type: 'creation', ...fields }, nativeEvent);
      };
    }

    // Don't open an empty menu.
    if (!createEvent) {
      return;
    }

    event.preventDefault();
    menuContext.openMenu({
      anchorEl: event.currentTarget,
      anchorPosition: { top: event.clientY - 4, left: event.clientX - 2 },
      createEvent,
    });
  };

  return { onContextMenu };
}
