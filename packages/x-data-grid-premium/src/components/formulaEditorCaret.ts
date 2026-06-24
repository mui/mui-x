import { getFormulaReferenceColorVar } from '../hooks/features/formula/gridFormulaReferenceHighlights';
import type { FormulaTextSegment } from '../hooks/features/formula/gridFormulaReferenceHighlights';

/**
 * The class on each colored reference token `<span>` inside the formula editor.
 * Shared with the in-grid overlay's theming/test selector.
 */
export const FORMULA_REFERENCE_TOKEN_CLASS = 'MuiDataGrid-formulaReferenceToken';

/**
 * A character range within `root.textContent`. Collapsed (`start === end`) when it
 * is a plain caret.
 */
export interface FormulaEditorSelection {
  start: number;
  end: number;
}

/**
 * Collapses a `Selection` to a single caret at `(node, offset)`, replacing any
 * existing selection.
 */
function placeCaret(doc: Document, node: Node, offset: number): void {
  const selection = doc.getSelection();
  if (!selection) {
    return;
  }
  const range = doc.createRange();
  range.setStart(node, offset);
  range.collapse(true);
  selection.removeAllRanges();
  selection.addRange(range);
}

/**
 * The DOM `(node, offset)` for a character `offset` into `root.textContent`. Walks
 * the text nodes summing their lengths; a boundary between two adjacent `<span>`s
 * resolves to the end of the earlier text node; an offset past the end clamps to
 * the end of the last text node; an empty editable resolves to the root itself.
 */
function locateOffset(root: HTMLElement, offset: number): { node: Node; offset: number } {
  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  let remaining = Math.max(0, offset);
  let lastTextNode: Text | null = null;
  for (let node = walker.nextNode() as Text | null; node; node = walker.nextNode() as Text | null) {
    lastTextNode = node;
    if (remaining <= node.length) {
      return { node, offset: remaining };
    }
    remaining -= node.length;
  }
  if (lastTextNode) {
    return { node: lastTextNode, offset: lastTextNode.length };
  }
  return { node: root, offset: 0 };
}

/**
 * The character offset of the collapsed caret within `root.textContent`, or
 * `null` when there is no selection or it sits outside `root`. The editable
 * splits its text across one text node per segment, so the offset is the length
 * of all text from the start of `root` up to the caret — measured with a range
 * so it is correct whether the caret sits in a text node, between two `<span>`s,
 * or in the empty root.
 */
export function getCaretOffset(root: HTMLElement): number | null {
  const doc = root.ownerDocument;
  const selection = doc.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }
  const range = selection.getRangeAt(0);
  if (!root.contains(range.startContainer)) {
    return null;
  }
  const preCaretRange = doc.createRange();
  preCaretRange.selectNodeContents(root);
  preCaretRange.setEnd(range.startContainer, range.startOffset);
  return preCaretRange.toString().length;
}

/**
 * Places the collapsed caret `offset` characters into `root.textContent`. Walks
 * the text nodes summing their lengths; an offset on a boundary between two
 * adjacent `<span>`s lands at the end of the earlier text node (the text-node
 * form). An offset past the end clamps to the end of the last text node; an empty
 * editable places the caret in the root itself.
 */
export function setCaretOffset(root: HTMLElement, offset: number): void {
  const { node, offset: localOffset } = locateOffset(root, offset);
  placeCaret(root.ownerDocument, node, localOffset);
}

/**
 * The character range of the current selection within `root.textContent`, or
 * `null` when there is no selection or it sits outside `root`. Captures both edges
 * so a non-collapsed selection survives a rebuild (not just the caret position).
 */
export function getSelectionOffsets(root: HTMLElement): FormulaEditorSelection | null {
  const doc = root.ownerDocument;
  const selection = doc.getSelection();
  if (!selection || selection.rangeCount === 0) {
    return null;
  }
  const range = selection.getRangeAt(0);
  if (!root.contains(range.startContainer) || !root.contains(range.endContainer)) {
    return null;
  }
  const measure = (node: Node, nodeOffset: number): number => {
    const preRange = doc.createRange();
    preRange.selectNodeContents(root);
    preRange.setEnd(node, nodeOffset);
    return preRange.toString().length;
  };
  return {
    start: measure(range.startContainer, range.startOffset),
    end: measure(range.endContainer, range.endOffset),
  };
}

/**
 * Restores a character range within `root.textContent`. A collapsed range places a
 * plain caret.
 */
export function setSelectionOffsets(root: HTMLElement, selection: FormulaEditorSelection): void {
  if (selection.start === selection.end) {
    setCaretOffset(root, selection.start);
    return;
  }
  const doc = root.ownerDocument;
  const start = locateOffset(root, selection.start);
  const end = locateOffset(root, selection.end);
  const range = doc.createRange();
  range.setStart(start.node, start.offset);
  range.setEnd(end.node, end.offset);
  const documentSelection = doc.getSelection();
  if (!documentSelection) {
    return;
  }
  documentSelection.removeAllRanges();
  documentSelection.addRange(range);
}

/**
 * Strips line breaks so the editor stays single-line. Applied to typed input and
 * pasted text — `contenteditable` would otherwise insert `<div>`/`<br>` on Enter
 * and embed newlines on paste.
 */
export function normalizeSingleLine(text: string): string {
  return text.replace(/[\r\n]+/g, '');
}

/**
 * Imperatively rebuilds the editable's children from `segments`: a flat run of
 * text nodes (plain gaps) and colored `<span>`s (reference tokens), no block
 * elements. The editable has no React-controlled children, so this never fights
 * React reconciliation (the React-contenteditable pattern). An empty `segments`
 * leaves the editable empty — the caret then goes into the root via
 * `setCaretOffset`.
 */
export function renderSegments(root: HTMLElement, segments: FormulaTextSegment[]): void {
  const doc = root.ownerDocument;
  root.textContent = '';
  for (const segment of segments) {
    if (segment.colorIndex === null) {
      root.appendChild(doc.createTextNode(segment.text));
    } else {
      const span = doc.createElement('span');
      span.className = FORMULA_REFERENCE_TOKEN_CLASS;
      span.style.color = getFormulaReferenceColorVar(segment.colorIndex);
      span.textContent = segment.text;
      root.appendChild(span);
    }
  }
}
