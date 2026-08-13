'use client';
import * as React from 'react';
import { useStore } from '@base-ui/utils/store';
import { getTarget } from '@mui/x-internals/domUtils';
import { useEventTimelinePremiumStoreContext } from '@mui/x-scheduler-internals-premium/use-event-timeline-premium-store-context';
import { eventTimelinePremiumDependencySelectors } from '@mui/x-scheduler-internals-premium/event-timeline-premium-selectors';
import { isElement, isNode } from './nodeGuards';

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

/**
 * The dialog subset of the guard also applies to presses: a press inside the open
 * event dialog belongs to the dialog, it must neither deselect the arrow underneath
 * nor swallow the control's click.
 */
const GUARDED_PRESS_TARGETS = 'dialog, [role="dialog"]';

function isGuardedKeyTarget(event: KeyboardEvent): boolean {
  // At the document level `event.target` is retargeted to the shadow host, which
  // would mask an editable living inside it: the composed path has the real target.
  const target = getTarget(event);
  if (!isElement(target)) {
    return false;
  }
  // Only defined on HTML elements: an SVG target reads `undefined` and falls through.
  if ((target as Partial<HTMLElement>).isContentEditable) {
    return true;
  }
  return target.closest(GUARDED_KEY_TARGETS) !== null;
}

/**
 * Keyboard and click-away interactions of the selected dependency: Delete/Backspace
 * deletes it, Escape deselects, clicking outside the arrow deselects.
 * Document-level listeners because the SVG arrows are not focusable — the keyboard
 * accessibility story of dependencies is deliberately deferred, and so is arbitration
 * between several timelines on one page (each instance holding a selection reacts to
 * the same document-level keystroke until a focus story scopes it).
 */
export function useDependencySelectionInteraction(elementRef: React.RefObject<Element | null>) {
  const store = useEventTimelinePremiumStoreContext();
  const selectedId = useStore(store, eventTimelinePremiumDependencySelectors.selectedId);

  // The armed one-shot swallow deliberately outlives the effect below (deselecting
  // tears the effect down before the click arrives), so only unmounting may disarm it.
  const armedDisarmRef = React.useRef<(() => void) | null>(null);
  React.useEffect(() => () => armedDisarmRef.current?.(), []);

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
        store.deleteSelectedDependency();
      } else if (event.key === 'Escape') {
        // Escape during an in-flight creation drag cancels the drag (pragmatic
        // handles it); one keystroke must not also drop the selection.
        if (store.state.dependencyCreation === null) {
          store.setSelectedDependencyId(null);
        }
      }
    };

    const doc = elementRef.current?.ownerDocument ?? document;

    const handlePointerDown = (event: PointerEvent) => {
      // Only a primary-button press is a click-away: auxiliary presses (context
      // menu, middle click) produce `auxclick`, not `click`, so they would leave
      // the swallow armed for an unrelated later click.
      if (event.button !== 0) {
        return;
      }
      // Same retargeting caveat as the keyboard guard: at the document level a press
      // inside a shadow root reports the host, the composed path has the real target.
      const target = getTarget(event);
      if (isElement(target)) {
        // A press on one of this timeline's own interaction surfaces belongs to that
        // surface — another timeline's arrows are ordinary click-aways, or one Delete
        // would delete a link in each timeline holding a selection.
        const interactionHit = target.closest(
          '[data-dependency-hit], [data-dependency-delete-button]',
        );
        if (
          (interactionHit !== null && elementRef.current?.contains(interactionHit)) ||
          target.closest(GUARDED_PRESS_TARGETS) !== null
        ) {
          return;
        }
      }
      store.setSelectedDependencyId(null);
      // Inside the timeline, dismissing the selection is this press's whole meaning:
      // the click it produces must not also create an event or open a dialog — the
      // same first-click-dismisses behavior the event dialog gets from its backdrop.
      // A press outside the timeline only deselects: its click belongs to whatever
      // the user pressed (the backdrop analogy stops at the timeline's edge).
      const timelineGrid = elementRef.current?.closest('[role="grid"]');
      if (!isNode(target) || !timelineGrid?.contains(target)) {
        return;
      }
      // The one-shot listeners outlive this effect on purpose (deselecting tears it
      // down before the click arrives) and disarm themselves on the click, or on any
      // signal that the press will not produce one (a drag, a canceled pointer, a
      // keystroke).
      function swallowClick(clickEvent: MouseEvent) {
        clickEvent.stopPropagation();
        disarm();
      }
      function disarm() {
        armedDisarmRef.current = null;
        doc.removeEventListener('click', swallowClick, { capture: true });
        doc.removeEventListener('pointerdown', disarm, { capture: true });
        doc.removeEventListener('dragstart', disarm, { capture: true });
        doc.removeEventListener('pointercancel', disarm, { capture: true });
        doc.removeEventListener('keydown', disarm, { capture: true });
      }
      armedDisarmRef.current = disarm;
      doc.addEventListener('click', swallowClick, { capture: true });
      doc.addEventListener('pointerdown', disarm, { capture: true });
      doc.addEventListener('dragstart', disarm, { capture: true });
      doc.addEventListener('pointercancel', disarm, { capture: true });
      doc.addEventListener('keydown', disarm, { capture: true });
    };

    doc.addEventListener('keydown', handleKeyDown);
    doc.addEventListener('pointerdown', handlePointerDown);
    return () => {
      doc.removeEventListener('keydown', handleKeyDown);
      doc.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [store, selectedId, elementRef]);
}
