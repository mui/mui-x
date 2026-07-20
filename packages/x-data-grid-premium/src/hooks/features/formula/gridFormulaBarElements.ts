import type { RefObject } from '@mui/x-internals/types';
import type { GridPrivateApiPremium } from '../../../models/gridApiPremium';

/**
 * Instance-scoped registry of "focus-safe" formula elements: the formula-bar
 * roots and the suggestion-popup panels mounted for THIS grid instance.
 * Interactions inside them must not clear the grid's cell focus (which would
 * also stop an in-progress cell edit). DOM containment against the grid root
 * cannot answer "is this element ours?" — a formula bar can be portaled
 * anywhere in the page, and the suggestion popup is body-portaled — so the
 * elements register themselves here through callback refs (registration
 * follows the ELEMENT lifecycle, not the component's: a bar that unmounts its
 * DOM while staying rendered as `null` re-registers its fresh element when it
 * reappears).
 */

export function registerFormulaFocusSafeElement(
  apiRef: RefObject<GridPrivateApiPremium>,
  element: Element,
): void {
  apiRef.current.caches.formula.focusSafeElements.add(element);
}

export function unregisterFormulaFocusSafeElement(
  apiRef: RefObject<GridPrivateApiPremium>,
  element: Element,
): void {
  apiRef.current.caches.formula.focusSafeElements.delete(element);
}

/**
 * Whether `target` sits inside one of this grid's registered focus-safe
 * elements. Containment is checked against the registered elements themselves
 * (the set is tiny), so it works for any DOM placement and needs no class
 * matching — another grid's bar or popup is an ordinary outside element for
 * this grid.
 * @param {RefObject<GridPrivateApiPremium>} apiRef The private grid api.
 * @param {unknown} target The event target or element to test.
 * @returns {boolean} `true` when the target is inside a registered element.
 */
export function isFormulaFocusSafeTarget(
  apiRef: RefObject<GridPrivateApiPremium>,
  target: unknown,
): boolean {
  const node = target as Node | null;
  if (node === null || typeof node !== 'object' || !('nodeType' in node)) {
    return false;
  }
  for (const element of apiRef.current.caches.formula.focusSafeElements) {
    if (element.contains(node)) {
      return true;
    }
  }
  return false;
}

/**
 * Whether DOM focus currently sits inside one of this grid's focus-safe
 * elements (in practice: a formula bar — the popup panels never take focus) —
 * the case where the in-cell editor must not pull focus (or the caret) back to
 * itself.
 * @param {RefObject<GridPrivateApiPremium>} apiRef The private grid api.
 * @param {Document} doc The document to read the active element from.
 * @returns {boolean} `true` when a registered element owns the focus.
 */
export function formulaBarOwnsFocus(
  apiRef: RefObject<GridPrivateApiPremium>,
  doc: Document,
): boolean {
  return isFormulaFocusSafeTarget(apiRef, doc.activeElement);
}
