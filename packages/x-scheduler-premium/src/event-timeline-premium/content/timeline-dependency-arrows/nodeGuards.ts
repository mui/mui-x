/**
 * Node checks by `nodeType` rather than `instanceof`: the dependency listeners follow
 * the element's `ownerDocument`, so a timeline rendered into another document (an
 * iframe portal) receives targets whose constructors are not the ambient realm's. An
 * `instanceof` guard rejects them all — Backspace in one of that document's inputs
 * would delete the selected dependency, and hovering one of its events would never
 * reveal a terminal.
 */
const ELEMENT_NODE = 1;

export function isElement(target: EventTarget | null): target is Element {
  return (target as Node | null)?.nodeType === ELEMENT_NODE;
}

export function isNode(target: EventTarget | null): target is Node {
  return typeof (target as Node | null)?.nodeType === 'number';
}
