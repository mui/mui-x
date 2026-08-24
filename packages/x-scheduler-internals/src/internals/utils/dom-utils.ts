/**
 * Node checks by `nodeType` rather than `instanceof`: listeners following an
 * element's `ownerDocument` receive targets from that document, and a scheduler
 * rendered into another one (an iframe portal) hands them constructors that are not
 * the ambient realm's. An `instanceof` guard rejects them all, so whatever the guard
 * protects — a keystroke reaching the right handler, an element resolving its
 * ancestors — silently stops working in that document.
 */
const ELEMENT_NODE = 1;

export function isElement(target: EventTarget | null): target is Element {
  return (target as Node | null)?.nodeType === ELEMENT_NODE;
}

export function isNode(target: EventTarget | null): target is Node {
  return typeof (target as Node | null)?.nodeType === 'number';
}
