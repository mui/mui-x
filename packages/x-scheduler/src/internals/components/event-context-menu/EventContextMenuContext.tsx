'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { useEventEditingTriggerProps } from '../event-editing';
import { EventContextMenu } from './EventContextMenu';
import type {
  EventContextMenuAnchorPosition,
  EventContextMenuContextValue,
  EventContextMenuProviderProps,
  EventContextMenuTriggerProps,
} from './EventContextMenu.types';

export const EventContextMenuContext = React.createContext<
  EventContextMenuContextValue | undefined
>(undefined);

/**
 * Returns `undefined` outside a provider (unlike most context hooks in this package) so
 * `EventContextMenuTrigger` can be used anywhere `EventEditingTrigger` is, degrading gracefully
 * to edit-only behavior where no context menu surface is mounted.
 */
export function useEventContextMenuContext(): EventContextMenuContextValue | undefined {
  return React.useContext(EventContextMenuContext);
}

interface EventContextMenuState {
  open: boolean;
  occurrence: SchedulerRenderableEventOccurrence | null;
  anchorEl: HTMLElement | null;
  anchorPosition: EventContextMenuAnchorPosition | null;
}

const INITIAL_STATE: EventContextMenuState = {
  open: false,
  occurrence: null,
  anchorEl: null,
  anchorPosition: null,
};

export function EventContextMenuProvider(props: EventContextMenuProviderProps) {
  const { children } = props;
  const [state, setState] = React.useState<EventContextMenuState>(INITIAL_STATE);

  const openMenu = useStableCallback(
    (
      occurrence: SchedulerRenderableEventOccurrence,
      anchorEl: HTMLElement,
      anchorPosition: EventContextMenuAnchorPosition | null = null,
    ) => {
      setState({ open: true, occurrence, anchorEl, anchorPosition });
    },
  );

  // Keep the occurrence and anchor while closing so the menu's exit transition can play.
  const closeMenu = useStableCallback(() => {
    setState((prev) => (prev.open ? { ...prev, open: false } : prev));
  });

  const contextValue = React.useMemo<EventContextMenuContextValue>(
    () => ({ openMenu }),
    [openMenu],
  );

  return (
    <EventContextMenuContext.Provider value={contextValue}>
      {children}
      {state.occurrence && state.anchorEl && (
        <EventContextMenu
          open={state.open}
          occurrence={state.occurrence}
          anchorEl={state.anchorEl}
          anchorPosition={state.anchorPosition}
          onClose={closeMenu}
        />
      )}
    </EventContextMenuContext.Provider>
  );
}

/**
 * Wraps an element so it edits its occurrence on click (same as `EventEditingTrigger`) and opens
 * the event context menu on right-click or on `Space` while it is focused.
 */
export function EventContextMenuTrigger(props: EventContextMenuTriggerProps) {
  const { occurrence, onClick, children } = props;
  const editing = useEventEditingTriggerProps(occurrence);
  const menuContext = useEventContextMenuContext();

  return React.cloneElement(children as React.ReactElement<any>, {
    ref: editing.ref,
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      onClick?.(event);
      editing.onClick();
    },
    onContextMenu: (event: React.MouseEvent<HTMLElement>) => {
      if (!menuContext) {
        return;
      }
      event.preventDefault();
      menuContext.openMenu(occurrence, event.currentTarget, {
        top: event.clientY - 4,
        left: event.clientX - 2,
      });
    },
    onKeyUp: (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key !== ' ' || !menuContext) {
        return;
      }
      // Suppresses Base UI's `useButton` Space->click synthesis (which would open Edit instead)
      // for this keyup. See the "Key mechanism" section of the implementation plan for why this
      // works: `elementProps` (this handler) is merged in before `getButtonProps` in every event
      // primitive, so calling this before returning suppresses the internal click synthesis.
      (event as unknown as { preventBaseUIHandler?: () => void }).preventBaseUIHandler?.();
      event.preventDefault();
      menuContext.openMenu(occurrence, event.currentTarget);
    },
  });
}
