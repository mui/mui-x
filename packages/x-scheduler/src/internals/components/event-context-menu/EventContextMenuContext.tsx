'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useIsoLayoutEffect } from '@base-ui/utils/useIsoLayoutEffect';
import { isCoarsePointer, isEventOccurrence } from '@mui/x-scheduler-internals/internals';
import type { SchedulerRenderableEventOccurrence } from '@mui/x-scheduler-internals/models';
import {
  captureFocusFallback,
  resolveFocusFallback,
  useMoveFocusOutOnUnmount,
} from '../../utils/focus-utils';
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
  getFocusFallback?: () => HTMLElement | null;
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
      // Read while the anchor is still mounted.
      const occurrenceTimestamp = isEventOccurrence(occurrence)
        ? occurrence.start.epochMilliseconds
        : 0;
      const snapshot = captureFocusFallback(anchorEl, occurrence.id, occurrenceTimestamp);
      setState({
        open: true,
        occurrence,
        anchorEl,
        anchorPosition: options.anchorPosition ?? null,
        onEditingCanceled: options.onEditingCanceled,
        stableAnchor: options.stableAnchor,
        // Other events can be removed in the same update, so only the ones still mounted are kept.
        getFocusFallback:
          options.getFocusFallback ??
          (() =>
            snapshot
              ? resolveFocusFallback(
                  {
                    ...snapshot,
                    candidates: snapshot.candidates.filter(
                      (candidate) => candidate.element.isConnected,
                    ),
                  },
                  null,
                )
              : null),
      });
    },
  );

  // Keep the occurrence and anchor while closing so the menu's exit transition can play.
  const closeMenu = useStableCallback(() => {
    setState((prev) => (prev.open ? { ...prev, open: false } : prev));
  });

  const closeMenuForAnchor = useStableCallback((anchorEl: HTMLElement) => {
    if (state.open && state.anchorEl === anchorEl) {
      closeMenu();
    }
  });

  const isMenuOpenForAnchor = useStableCallback(
    (anchorEl: HTMLElement) => state.open && state.anchorEl === anchorEl,
  );

  const contextValue = React.useMemo<EventContextMenuContextValue>(
    () => ({ openMenu, closeMenuForAnchor, isMenuOpenForAnchor }),
    [openMenu, closeMenuForAnchor, isMenuOpenForAnchor],
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
          getFocusFallback={state.getFocusFallback}
          onClose={closeMenu}
        />
      )}
    </EventContextMenuContext.Provider>
  );
}

/** Shift+F10 or the Menu key, the keyboard shortcuts for a context menu. */
function isContextMenuKey(event: React.KeyboardEvent) {
  return event.key === 'ContextMenu' || (event.key === 'F10' && event.shiftKey);
}

/**
 * Wraps an element so it edits its occurrence on click (same as `EventEditingTrigger`) and opens
 * the event context menu on right-click, or on Shift+F10 or the Menu key while it is focused.
 * `onEditingCanceled` and `stableAnchor` behave exactly as they do on `EventEditingTrigger` —
 * forwarded to `startEditing` both for the direct click and for Edit chosen from the menu.
 * Unmounting closes the menu opened from it, and moves focus to the event's cell, column or row
 * (or the next agenda event) when it was focused.
 *
 * On a coarse pointer, activation arms the toolbar instead of opening the dialog directly
 * (`editingModePolicy.ts`), and that toolbar already exposes Edit and Delete — so right-click and
 * the keyboard shortcuts fall through to their default behavior here instead of also opening a
 * redundant menu whose own Edit item would otherwise just re-arm a no-op.
 */
export function EventContextMenuTrigger(props: EventContextMenuTriggerProps) {
  const { occurrence, onClick, onEditingCanceled, stableAnchor, getFocusFallback, children } =
    props;
  const editing = useEventEditingTriggerProps(occurrence, { onEditingCanceled, stableAnchor });
  const menuContext = useEventContextMenuContext();

  useIsoLayoutEffect(() => {
    const node = editing.ref.current;
    if (!menuContext || node === null) {
      return undefined;
    }
    return () => menuContext.closeMenuForAnchor(node);
  }, [menuContext, editing.ref]);

  // The "+N more" popover, which passes `getFocusFallback`, moves focus out of its own items.
  useMoveFocusOutOnUnmount(editing.ref, occurrence, getFocusFallback == null);

  const child = children as React.ReactElement<any>;
  const childProps = child.props as React.HTMLAttributes<HTMLElement>;

  return React.cloneElement(child, {
    ref: editing.ref,
    onClick: (event: React.MouseEvent<HTMLElement>) => {
      onClick?.(event);
      editing.onClick(event);
    },
    onContextMenu: (event: React.MouseEvent<HTMLElement>) => {
      // The browser can still fire `contextmenu` for the key that just opened the menu.
      if (menuContext?.isMenuOpenForAnchor(event.currentTarget)) {
        event.preventDefault();
        return;
      }
      if (!menuContext || isCoarsePointer()) {
        return;
      }
      event.preventDefault();
      menuContext.openMenu(occurrence, event.currentTarget, {
        anchorPosition: { top: event.clientY - 4, left: event.clientX - 2 },
        onEditingCanceled,
        stableAnchor,
        getFocusFallback,
      });
    },
    onKeyDown: (event: React.KeyboardEvent<HTMLElement>) => {
      childProps.onKeyDown?.(event);
      if (!isContextMenuKey(event) || !menuContext || isCoarsePointer()) {
        return;
      }
      event.preventDefault();
      menuContext.openMenu(occurrence, event.currentTarget, {
        onEditingCanceled,
        stableAnchor,
        getFocusFallback,
      });
    },
  });
}
