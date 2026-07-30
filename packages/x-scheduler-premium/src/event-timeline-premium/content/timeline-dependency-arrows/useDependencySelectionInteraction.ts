'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import { eventTimelinePremiumDependencySelectors } from '@mui/x-scheduler-internals-premium/event-timeline-premium-selectors';

/**
 * Targets whose keystrokes must never reach the arrows: form controls (native or
 * ARIA), editable regions, and anything inside a dialog — the event dialog opens on
 * top of the timeline while an arrow can still be selected underneath.
 */
const GUARDED_KEY_TARGETS = [
  'input',
  'textarea',
  'select',
  '[role="combobox"]',
  '[role="listbox"]',
  '[role="textbox"]',
  '[contenteditable]:not([contenteditable="false"])',
  'dialog',
  '[role="dialog"]',
].join(', ');

function isGuardedKeyTarget(event: KeyboardEvent): boolean {
  // At the document level `event.target` is retargeted to the shadow host, which
  // would mask an editable living inside it: the composed path has the real target.
  const target = event.composedPath()[0] ?? event.target;
  if (!(target instanceof Element)) {
    return false;
  }
  if (target instanceof HTMLElement && target.isContentEditable) {
    return true;
  }
  return target.closest(GUARDED_KEY_TARGETS) !== null;
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
      if (isGuardedKeyTarget(event)) {
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
