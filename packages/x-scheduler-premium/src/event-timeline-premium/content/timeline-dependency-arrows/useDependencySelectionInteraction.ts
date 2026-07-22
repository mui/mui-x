'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import { eventTimelinePremiumDependencySelectors } from '@mui/x-scheduler-internals-premium/event-timeline-premium-selectors';

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false;
  }
  return target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
}

/**
 * Keyboard and click-away interactions of the selected dependency: Delete/Backspace
 * deletes it, Escape deselects, clicking outside the arrow deselects.
 * Document-level listeners because the SVG arrows are not focusable — the keyboard
 * accessibility story of dependencies is deliberately deferred.
 */
export function useDependencySelectionInteraction() {
  const store = useEventTimelinePremiumStoreContext();
  const selectedId = useStore(store, eventTimelinePremiumDependencySelectors.selectedId);

  React.useEffect(() => {
    if (selectedId === null) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // Typing in the event dialog (or any editable) must not touch the arrows.
      if (isEditableTarget(event.target)) {
        return;
      }
      if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        store.deleteDependency(selectedId);
        store.setSelectedDependency(null);
      } else if (event.key === 'Escape') {
        store.setSelectedDependency(null);
      }
    };

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target;
      if (
        target instanceof Element &&
        target.closest('[data-dependency-hit], [data-dependency-delete-button]')
      ) {
        return;
      }
      store.setSelectedDependency(null);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [store, selectedId]);
}
