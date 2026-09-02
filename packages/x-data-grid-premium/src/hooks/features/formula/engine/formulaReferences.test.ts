import { describe, it, expect } from 'vitest';
import {
  buildFormulaReferences,
  collectCanonicalReferences,
  scanA1References,
} from './formulaReferences';
import type { FormulaRawReference } from './formulaReferences';
import { parseFormula } from './formulaParser';
import { createTestPositionContext } from './testUtils';
import type { FormulaPositionContext } from './formulaTypes';

// fields: A=item, B=price, C=quantity, D=total · rows: 1=r1, 2=r2, 3=r3
const context: FormulaPositionContext = createTestPositionContext(
  ['r1', 'r2', 'r3'],
  ['item', 'price', 'quantity', 'total'],
);

const canonical = (expression: string): FormulaRawReference[] => {
  const { ast } = parseFormula(expression);
  if (ast === null) {
    throw new Error(`Test expression did not parse: ${expression}`);
  }
  return collectCanonicalReferences(ast);
};

const a1 = (expression: string): FormulaRawReference[] => scanA1References(expression, context);

/** Each reference's span slices back to the token it covers. */
const slices = (expression: string, references: FormulaRawReference[]): string[] =>
  references.map((ref) => expression.slice(ref.spans[0].start, ref.spans[0].end));

describe('formulaReferences', () => {
  describe('collectCanonicalReferences', () => {
    it('collects same-row field references', () => {
      const references = canonical('price * quantity');
      expect(references.map((ref) => ref.node.type)).to.deep.equal(['fieldRef', 'fieldRef']);
      expect(slices('price * quantity', references)).to.deep.equal(['price', 'quantity']);
    });

    it('collects field refs nested in calls and operators in source order', () => {
      const expression = 'IF(a > 1, SUM(b, -c), FIELD("d e"))';
      const references = canonical(expression);
      expect(references.every((ref) => ref.node.type === 'fieldRef')).to.equal(true);
      expect(references.map((ref) => (ref.node as { field: string }).field)).to.deep.equal([
        'a',
        'b',
        'c',
        'd e',
      ]);
    });

    it('collects an explicit cell reference as one whole chunk', () => {
      const expression = 'REF(COLUMN("total"), ROW("r1"))';
      const references = canonical(expression);
      expect(references).to.have.length(1);
      expect(references[0].node.type).to.equal('cellRef');
      expect(slices(expression, references)).to.deep.equal([expression]);
    });

    it('collects a range window as one reference, never its inner axes', () => {
      const expression = 'SUM(RANGE_REF(COLUMN_FROM(1), ROW_FROM(1), COLUMN_TO(4), ROW_TO(3)))';
      const references = canonical(expression);
      expect(references).to.have.length(1);
      expect(references[0].node.type).to.equal('rangeRef');
      expect(slices(expression, references)[0]).to.match(/^RANGE_REF\(.*\)$/);
    });

    it('collects COLUMN_VALUES', () => {
      const references = canonical('COLUMN_VALUES("total")');
      expect(references).to.have.length(1);
      expect(references[0].node.type).to.equal('columnValues');
    });

    it('returns nothing for an expression with no references', () => {
      expect(canonical('1 + 2 * 3')).to.have.length(0);
    });

    it('returns an empty list for an unparseable expression', () => {
      expect(
        buildFormulaReferences('price +', { a1Notation: false, positionContext: context }),
      ).to.deep.equal([]);
    });
  });

  describe('scanA1References', () => {
    it('scans a cell reference and freezes its identity to the current view', () => {
      const references = a1('B2');
      expect(references).to.have.length(1);
      const { node } = references[0];
      expect(node.type).to.equal('cellRef');
      expect((node as any).column).to.deep.equal({ kind: 'field', field: 'price' });
      expect((node as any).row).to.deep.equal({ kind: 'id', id: 'r2' });
      expect(references[0].spans[0]).to.deep.equal({ start: 0, end: 2 });
    });

    it('keeps an absolute axis positional', () => {
      const references = a1('$A$1');
      const { node } = references[0];
      expect((node as any).column).to.deep.equal({ kind: 'position', index: 1 });
      expect((node as any).row).to.deep.equal({ kind: 'position', index: 1 });
    });

    it('scans a range as one reference, as a positional window', () => {
      const references = a1('A1:B2');
      expect(references).to.have.length(1);
      const { node } = references[0];
      expect(node.type).to.equal('rangeRef');
      expect((node as any).columnFrom).to.deep.equal({ kind: 'position', index: 1, fixed: false });
      expect((node as any).rowFrom).to.deep.equal({ kind: 'position', index: 1, fixed: false });
      expect((node as any).columnTo).to.deep.equal({ kind: 'position', index: 2, fixed: false });
      expect((node as any).rowTo).to.deep.equal({ kind: 'position', index: 2, fixed: false });
      expect(references[0].spans[0]).to.deep.equal({ start: 0, end: 5 });
    });

    it('marks the `$` axes of a scanned window as fixed', () => {
      const { node } = a1('$A1:B$2')[0];
      expect((node as any).columnFrom).to.deep.equal({ kind: 'position', index: 1, fixed: true });
      expect((node as any).rowFrom).to.deep.equal({ kind: 'position', index: 1, fixed: false });
      expect((node as any).columnTo).to.deep.equal({ kind: 'position', index: 2, fixed: false });
      expect((node as any).rowTo).to.deep.equal({ kind: 'position', index: 2, fixed: true });
    });

    it('scans a window reaching past the view without consulting identities', () => {
      // Row 9 does not exist in this 3-row context: the window is still one
      // reference, stored as written, and clips only when resolved.
      const references = a1('A1:B9');
      expect(references).to.have.length(1);
      expect(references[0].node.type).to.equal('rangeRef');
      expect((references[0].node as any).rowTo).to.deep.equal({
        kind: 'position',
        index: 9,
        fixed: false,
      });
    });

    it('scans a whole-column range as COLUMN_VALUES', () => {
      const references = a1('B:B');
      expect(references).to.have.length(1);
      expect(references[0].node.type).to.equal('columnValues');
      expect((references[0].node as any).field).to.equal('price');
    });

    it('scans bare field references but not function names', () => {
      const expression = 'B2 * quantity + SUM(C1)';
      const references = a1(expression);
      const tokens = slices(expression, references);
      expect(tokens).to.deep.equal(['B2', 'quantity', 'C1']);
      // `SUM` is a call, never a field reference.
      expect(tokens).not.to.include('SUM');
    });

    it('treats `name (` with whitespace as a call, like the parser', () => {
      // The tokenizer skips whitespace, so `SUM (C1)` is a call — `SUM` is not a
      // field reference even with a space before the parenthesis.
      const references = a1('SUM (C1) + quantity');
      expect(slices('SUM (C1) + quantity', references)).to.deep.equal(['C1', 'quantity']);
    });

    it('ignores references inside string literals', () => {
      expect(a1('"B2" & quantity').map((ref) => slices('"B2" & quantity', [ref])[0])).to.deep.equal(
        ['quantity'],
      );
    });

    it('colors references in a half-typed formula the canonical walk could not parse', () => {
      // `B2 +` does not parse, but the textual scan still finds `B2`.
      expect(parseFormula('B2 +').ast).to.equal(null);
      const references = a1('B2 +');
      expect(references).to.have.length(1);
      expect(references[0].node.type).to.equal('cellRef');
    });

    it('reconstructs every reference token losslessly from its span', () => {
      const expression = '$A$1 + B2:C3 + total';
      const references = a1(expression);
      expect(slices(expression, references)).to.deep.equal(['$A$1', 'B2:C3', 'total']);
    });

    it('scans a FIELD("…") escape as one field reference', () => {
      // The A1 display dialect writes a field named like a cell address (`q1`)
      // through the escape; the whole call is the colored chunk, exactly the
      // span the canonical walk produces for the node it parses into.
      const expression = 'FIELD("q1") + B2';
      const references = a1(expression);
      expect(references.map((ref) => ref.node.type)).to.deep.equal(['fieldRef', 'cellRef']);
      expect((references[0].node as any).field).to.equal('q1');
      expect(slices(expression, references)).to.deep.equal(['FIELD("q1")', 'B2']);
    });

    it('scans FIELD escapes with any casing, inner whitespace and `""` escapes', () => {
      const expression = 'field ( "a""b" )';
      const references = a1(expression);
      expect(references).to.have.length(1);
      expect(references[0].node.type).to.equal('fieldRef');
      expect((references[0].node as any).field).to.equal('a"b');
      expect(slices(expression, references)).to.deep.equal([expression]);
    });

    it('leaves a malformed FIELD escape to the generic branches', () => {
      // Not a string argument: `FIELD` is a call and `q1` scans as a cell ref,
      // matching what the commit transform would do with the same text.
      const nonString = a1('FIELD(q1)');
      expect(nonString.map((ref) => ref.node.type)).to.deep.equal(['cellRef']);
      // Unterminated literal: no reference, no crash.
      expect(a1('FIELD("q1')).to.deep.equal([]);
    });
  });

  describe('dialect equivalence', () => {
    it('resolves the A1 `B2` to the same selectors as canonical REF()', () => {
      const a1Node = a1('B2')[0].node;
      const canonicalNode = canonical('REF(COLUMN("price"), ROW("r2"))')[0].node;
      expect((a1Node as any).column).to.deep.equal((canonicalNode as any).column);
      expect((a1Node as any).row).to.deep.equal((canonicalNode as any).row);
    });
  });

  describe('buildFormulaReferences', () => {
    it('routes to the A1 scanner when a1Notation is on', () => {
      const references = buildFormulaReferences('B2', {
        a1Notation: true,
        positionContext: context,
      });
      expect(references[0].node.type).to.equal('cellRef');
      expect((references[0].node as any).column).to.deep.equal({ kind: 'field', field: 'price' });
    });

    it('routes to the canonical walk when a1Notation is off', () => {
      const references = buildFormulaReferences('price', {
        a1Notation: false,
        positionContext: context,
      });
      expect(references[0].node.type).to.equal('fieldRef');
    });
  });
});
