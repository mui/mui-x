import { afterEach, describe, expect, it } from 'vitest';
import type { FormulaTextSegment } from '../hooks/features/formula/gridFormulaReferenceHighlights';
import {
  FORMULA_REFERENCE_TOKEN_CLASS,
  getCaretOffset,
  getSelectionOffsets,
  normalizeSingleLine,
  renderSegments,
  setCaretOffset,
  setSelectionOffsets,
} from './formulaEditorCaret';

// `=price * quantity`: two colored tokens around plain gaps.
const FORMULA_SEGMENTS: FormulaTextSegment[] = [
  { text: '=', colorIndex: null },
  { text: 'price', colorIndex: 0 },
  { text: ' * ', colorIndex: null },
  { text: 'quantity', colorIndex: 1 },
];

describe('formulaEditorCaret', () => {
  let root: HTMLElement;

  afterEach(() => {
    root?.remove();
    document.getSelection()?.removeAllRanges();
  });

  function makeEditable(segments: FormulaTextSegment[]): HTMLElement {
    root = document.createElement('div');
    root.contentEditable = 'true';
    document.body.appendChild(root);
    renderSegments(root, segments);
    return root;
  }

  describe('renderSegments', () => {
    it('builds a flat run of text nodes and colored spans', () => {
      makeEditable(FORMULA_SEGMENTS);
      expect(root.textContent).to.equal('=price * quantity');
      const nodes = Array.from(root.childNodes);
      expect(nodes).to.have.length(4);
      expect(nodes[0].nodeType).to.equal(Node.TEXT_NODE);
      expect((nodes[1] as HTMLElement).tagName).to.equal('SPAN');
      expect(nodes[2].nodeType).to.equal(Node.TEXT_NODE);
      expect((nodes[3] as HTMLElement).tagName).to.equal('SPAN');
    });

    it('colors token spans with the palette var and tags them with the token class', () => {
      makeEditable(FORMULA_SEGMENTS);
      const spans = root.querySelectorAll('span');
      expect(spans).to.have.length(2);
      expect(spans[0].className).to.equal(FORMULA_REFERENCE_TOKEN_CLASS);
      expect(spans[0].style.color).to.equal('var(--DataGrid-formulaRefColor-0)');
      expect(spans[1].style.color).to.equal('var(--DataGrid-formulaRefColor-1)');
    });

    it('never produces block elements or line breaks', () => {
      makeEditable(FORMULA_SEGMENTS);
      expect(root.querySelector('br, div, p')).to.equal(null);
    });

    it('leaves the editable empty for no segments', () => {
      makeEditable([]);
      expect(root.childNodes).to.have.length(0);
      expect(root.textContent).to.equal('');
    });

    it('replaces the previous content on every rebuild', () => {
      makeEditable(FORMULA_SEGMENTS);
      renderSegments(root, [{ text: '=42', colorIndex: null }]);
      expect(root.textContent).to.equal('=42');
      expect(root.querySelectorAll('span')).to.have.length(0);
    });
  });

  describe('getCaretOffset / setCaretOffset round-trip', () => {
    // Boundaries of interest: start, inside the leading `=`, the `=`/token edge,
    // inside a token, the token/gap edge, and the very end.
    [0, 1, 3, 6, 9, 17].forEach((offset) => {
      it(`round-trips the caret at offset ${offset}`, () => {
        makeEditable(FORMULA_SEGMENTS);
        setCaretOffset(root, offset);
        expect(getCaretOffset(root)).to.equal(offset);
      });
    });

    it('round-trips a caret on the boundary between two adjacent spans', () => {
      makeEditable([
        { text: 'A', colorIndex: 0 },
        { text: 'B', colorIndex: 1 },
      ]);
      setCaretOffset(root, 1);
      expect(getCaretOffset(root)).to.equal(1);
    });

    it('clamps an offset past the end to the end of the text', () => {
      makeEditable(FORMULA_SEGMENTS);
      setCaretOffset(root, 100);
      expect(getCaretOffset(root)).to.equal(17);
    });

    it('places the caret in an empty editable', () => {
      makeEditable([]);
      setCaretOffset(root, 0);
      expect(getCaretOffset(root)).to.equal(0);
      setCaretOffset(root, 5);
      expect(getCaretOffset(root)).to.equal(0);
    });
  });

  describe('getCaretOffset edge cases', () => {
    it('returns null when there is no selection', () => {
      makeEditable(FORMULA_SEGMENTS);
      document.getSelection()?.removeAllRanges();
      expect(getCaretOffset(root)).to.equal(null);
    });

    it('returns null when the selection is outside the root', () => {
      makeEditable(FORMULA_SEGMENTS);
      const other = document.createElement('div');
      other.textContent = 'elsewhere';
      document.body.appendChild(other);
      const range = document.createRange();
      range.setStart(other.firstChild!, 2);
      range.collapse(true);
      const selection = document.getSelection()!;
      selection.removeAllRanges();
      selection.addRange(range);
      expect(getCaretOffset(root)).to.equal(null);
      other.remove();
    });
  });

  describe('getSelectionOffsets / setSelectionOffsets round-trip', () => {
    it('round-trips a non-collapsed selection spanning spans and gaps', () => {
      makeEditable(FORMULA_SEGMENTS);
      // From inside `price` (3) to inside `quantity` (12), across the ` * ` gap.
      setSelectionOffsets(root, { start: 3, end: 12 });
      expect(getSelectionOffsets(root)).to.deep.equal({ start: 3, end: 12 });
    });

    it('round-trips a selection that starts and ends inside the same token', () => {
      makeEditable(FORMULA_SEGMENTS);
      setSelectionOffsets(root, { start: 1, end: 6 });
      expect(getSelectionOffsets(root)).to.deep.equal({ start: 1, end: 6 });
      expect(document.getSelection()!.toString()).to.equal('price');
    });

    it('places a plain caret for a collapsed range', () => {
      makeEditable(FORMULA_SEGMENTS);
      setSelectionOffsets(root, { start: 9, end: 9 });
      expect(getCaretOffset(root)).to.equal(9);
      expect(getSelectionOffsets(root)).to.deep.equal({ start: 9, end: 9 });
    });

    it('returns null when there is no selection', () => {
      makeEditable(FORMULA_SEGMENTS);
      document.getSelection()?.removeAllRanges();
      expect(getSelectionOffsets(root)).to.equal(null);
    });
  });

  describe('normalizeSingleLine', () => {
    it('strips line breaks', () => {
      expect(normalizeSingleLine('a\nb\r\nc')).to.equal('abc');
      expect(normalizeSingleLine('=price\n')).to.equal('=price');
      expect(normalizeSingleLine('no breaks')).to.equal('no breaks');
    });
  });
});
