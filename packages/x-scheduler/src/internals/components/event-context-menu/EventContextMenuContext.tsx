'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { isCoarsePointer } from '@mui/x-scheduler-internals/internals';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import { useEventEditingTriggerProps } from '../event-editing';
import { EventContextMenu } from './EventContextMenu';
import type {
  EventContextMenuAnchorPosition,
  EventContextMenuContextValue,
  EventContextMenuProviderProps,
  EventContextMenuTriggerProps,
  OpenEventContextMenuOptions,
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
  onEditingCanceled?: () => void;
  stableAnchor?: HTMLElement | null;
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
      options: OpenEventContextMenuOptions = {},
    ) => {
      setState({
        open: true,
        occurrence,
        anchorEl,
        anchorPosition: options.anchorPosition ?? null,
        onEditingCanceled: options.onEditingCanceled,
        stableAnchor: options.stableAnchor,
      });
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
          onEditingCanceled={state.onEditingCanceled}
          stableAnchor={state.stableAnchor}
          onClose={closeMenu}
        />
      )}
    </EventContextMenuContext.Provider>
  );
}

/**
 * Wraps an element so it edits its occurrence on click (same as `EventEditingTrigger`) and opens
 * the event context menu on right-click or on `Space` while it is focused. `onEditingCanceled` and
 * `stableAnchor` behave exactly as they do on `EventEditingTrigger` — forwarded to `startEditing`
 * both for the direct click and for Edit chosen from the menu.
 *
 * On a coarse pointer, activation arms the toolbar instead of opening the dialog directly
 * (`editingModePolicy.ts`), and that toolbar already exposes Edit and Delete — so right-click and
 * Space fall through to their default behavior (arm/re-arm) here instead of also opening a
 * redundant menu whose own Edit item would otherwise just re-arm a no-op.
 */
export function EventContextMenuTrigger(props: EventContextMenuTriggerProps) {
  const { occurrence, onClick, onEditingCanceled, stableAnchor, children } = props;
  const editing = useEventEditingTriggerProps(occurrence, { onEditingCanceled, stableAnchor });
  const menuContext = useEventContextMenuContext();

  return React.cloneElement(children as React.ReactElement<any>, {
    ref: editing.ref,
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      onClick?.(event);
      editing.onClick(event);
    },
    onContextMenu: (event: React.MouseEvent<HTMLElement>) => {
      if (!menuContext || isCoarsePointer()) {
        return;
      }
      event.preventDefault();
      menuContext.openMenu(occurrence, event.currentTarget, {
        anchorPosition: { top: event.clientY - 4, left: event.clientX - 2 },
        onEditingCanceled,
        stableAnchor,
      });
    },
    onKeyUp: (event: React.KeyboardEvent<HTMLElement>) => {
      if (event.key !== ' ' || !menuContext || isCoarsePointer()) {
        return;
      }
      // Suppresses Base UI's `useButton` Space->click synthesis (which would open Edit instead) for
      // this keyup. `useButton`'s own `onKeyUp` calls `makeEventPreventable(event)`, then this
      // external handler (since every calendar-grid event primitive merges `elementProps` — what
      // this trigger clones onto the child — before its own `getButtonProps`), and only afterward
      // checks `event.baseUIHandlerPrevented` before firing the click. Calling `preventBaseUIHandler`
      // here, before that check runs, is what suppresses it.
      (event as unknown as { preventBaseUIHandler?: () => void }).preventBaseUIHandler?.();
      event.preventDefault();
      menuContext.openMenu(occurrence, event.currentTarget, { onEditingCanceled, stableAnchor });
    },
  });
}
