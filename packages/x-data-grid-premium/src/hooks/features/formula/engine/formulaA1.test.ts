import { parseFormula } from './formulaParser';
import { serializeFormulaAst } from './formulaSerializer';
import {
  columnIndexToLetters,
  columnLettersToIndex,
  toCanonicalFormula,
  toDisplayFormula,
} from './formulaA1';
import { createTestPositionContext } from './testUtils';
import type { FormulaAstNode } from './formulaAst';
import type { FormulaPositionContext, FormulaRowId } from './formulaTypes';

const stripSpans = (node: unknown): unknown => {
  if (Array.isArray(node)) {
    return node.map(stripSpans);
  }
  if (typeof node === 'object' && node !== null) {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(node)) {
      if (key !== 'span') {
        result[key] = stripSpans(value);
      }
    }
    return result;
  }
  return node;
};

const parseOk = (expression: string): FormulaAstNode => {
  const { ast, error } = parseFormula(expression);
  if (ast === null) {
    throw new Error(`Test expression did not parse: ${error?.message}`);
  }
  return ast;
};

// A 3-column × 5-row context: columns A,B,C map to price,qty,total; rows 1..5
// map to r1..r5. The transforms operate on the expression (no leading `=`).
const FIELDS = ['price', 'qty', 'total'];
const ROW_IDS: FormulaRowId[] = ['r1', 'r2', 'r3', 'r4', 'r5'];
const CONTEXT: FormulaPositionContext = createTestPositionContext(ROW_IDS, FIELDS);

const toCanonical = (
  expression: string,
  options?: { columnOffset?: number; rowOffset?: number },
  context: FormulaPositionContext = CONTEXT,
) => toCanonicalFormula(expression, { positionContext: context }, options).source;

const toDisplay = (expression: string, context: FormulaPositionContext = CONTEXT) =>
  toDisplayFormula(expression, { positionContext: context });

// Anchored variants: the committing/owning cell is supplied, so plain range
// endpoints freeze to / render from ANCHOR offsets.
const toCanonicalAt = (
  expression: string,
  anchorCell: { id: FormulaRowId; field: string },
  options?: { columnOffset?: number; rowOffset?: number },
  context: FormulaPositionContext = CONTEXT,
) => toCanonicalFormula(expression, { positionContext: context, anchorCell }, options).source;

const toDisplayAt = (
  expression: string,
  anchorCell: { id: FormulaRowId; field: string },
  context: FormulaPositionContext = CONTEXT,
) => toDisplayFormula(expression, { positionContext: context, anchorCell });

describe('formulaA1', () => {
  describe('columnIndexToLetters', () => {
    it('maps 1-based indexes to bijective base-26 letters', () => {
      expect(columnIndexToLetters(1)).to.equal('A');
      expect(columnIndexToLetters(26)).to.equal('Z');
      expect(columnIndexToLetters(27)).to.equal('AA');
      expect(columnIndexToLetters(52)).to.equal('AZ');
      expect(columnIndexToLetters(53)).to.equal('BA');
      expect(columnIndexToLetters(702)).to.equal('ZZ');
      expect(columnIndexToLetters(703)).to.equal('AAA');
    });

    it('returns an empty string for invalid input', () => {
      expect(columnIndexToLetters(0)).to.equal('');
      expect(columnIndexToLetters(-1)).to.equal('');
      expect(columnIndexToLetters(1.5)).to.equal('');
    });
  });

  describe('columnLettersToIndex', () => {
    it('is the inverse of columnIndexToLetters (case-insensitive)', () => {
      expect(columnLettersToIndex('A')).to.equal(1);
      expect(columnLettersToIndex('z')).to.equal(26);
      expect(columnLettersToIndex('AA')).to.equal(27);
      expect(columnLettersToIndex('zz')).to.equal(702);
      expect(columnLettersToIndex('AAA')).to.equal(703);
    });

    it('round-trips every index in a wide range', () => {
      for (let index = 1; index <= 1000; index += 1) {
        expect(columnLettersToIndex(columnIndexToLetters(index))).to.equal(index);
      }
    });

    it('returns 0 for non-letters', () => {
      expect(columnLettersToIndex('')).to.equal(0);
      expect(columnLettersToIndex('A1')).to.equal(0);
    });
  });

  describe('toCanonicalFormula — D5 mapping', () => {
    it('freezes a fully relative ref to stable column + row', () => {
      expect(toCanonical('A1')).to.equal('REF(COLUMN("price"), ROW("r1"))');
      expect(toCanonical('B3')).to.equal('REF(COLUMN("qty"), ROW("r3"))');
      expect(toCanonical('C5')).to.equal('REF(COLUMN("total"), ROW("r5"))');
    });

    it('keeps an absolute column positional ($A → COLUMN_POSITION)', () => {
      expect(toCanonical('$A1')).to.equal('REF(COLUMN_POSITION(1), ROW("r1"))');
    });

    it('keeps an absolute row positional (A$1 → ROW_POSITION)', () => {
      expect(toCanonical('A$1')).to.equal('REF(COLUMN("price"), ROW_POSITION(1))');
    });

    it('keeps both axes positional ($A$1)', () => {
      expect(toCanonical('$A$1')).to.equal('REF(COLUMN_POSITION(1), ROW_POSITION(1))');
    });

    it('falls back to a positional selector for an out-of-bounds relative axis', () => {
      // Column D (4) and row 9 do not exist → positional → #REF! at bind time.
      expect(toCanonical('D1')).to.equal('REF(COLUMN_POSITION(4), ROW("r1"))');
      expect(toCanonical('A9')).to.equal('REF(COLUMN("price"), ROW_POSITION(9))');
    });
  });

  describe('toCanonicalFormula — ranges', () => {
    it('rewrites a rectangle A1:B5 into a positional RANGE_REF window', () => {
      expect(toCanonical('SUM(A1:B5)')).to.equal(
        'SUM(RANGE_REF(COLUMN_FROM(1), ROW_FROM(1), COLUMN_TO(2), ROW_TO(5)))',
      );
    });

    it('marks `$` axes as FIXED (fill-pinned), positions stay positions', () => {
      expect(toCanonical('SUM($A$1:$A$4)')).to.equal(
        'SUM(RANGE_REF(FIXED(COLUMN_FROM(1)), FIXED(ROW_FROM(1)), FIXED(COLUMN_TO(1)), FIXED(ROW_TO(4))))',
      );
      // Mixed: only the `$` axes are pinned.
      expect(toCanonical('$A1:B5')).to.equal(
        'RANGE_REF(FIXED(COLUMN_FROM(1)), ROW_FROM(1), COLUMN_TO(2), ROW_TO(5))',
      );
    });

    it('stores an out-of-view window as written (it clips at resolve time)', () => {
      // Row 9 does not exist in the 5-row context: no identity is consulted, the
      // window is stored verbatim and auto-clips to the last row when resolved.
      expect(toCanonical('SUM(A1:A9)')).to.equal(
        'SUM(RANGE_REF(COLUMN_FROM(1), ROW_FROM(1), COLUMN_TO(1), ROW_TO(9)))',
      );
    });

    it('tolerates spaces around the colon', () => {
      expect(toCanonical('A1 : B2')).to.equal(
        'RANGE_REF(COLUMN_FROM(1), ROW_FROM(1), COLUMN_TO(2), ROW_TO(2))',
      );
    });

    it('rewrites a whole-column range A:A into COLUMN_VALUES', () => {
      expect(toCanonical('SUM(C:C)')).to.equal('SUM(COLUMN_VALUES("total"))');
    });

    it('leaves a mixed whole-column range untouched', () => {
      // A:B has no single COLUMN_VALUES form — copied verbatim, fails downstream.
      expect(toCanonical('A:B')).to.equal('A:B');
    });
  });

  describe('toCanonicalFormula — passthrough', () => {
    it('leaves canonical syntax unchanged', () => {
      const canonical = 'REF(COLUMN("price"), ROW("r1")) + COLUMN_VALUES("total")';
      expect(toCanonical(canonical)).to.equal(canonical);
    });

    it('does not touch references inside string literals', () => {
      expect(toCanonical('"A1" & B2')).to.equal('"A1" & REF(COLUMN("qty"), ROW("r2"))');
    });

    it('does not capture a function call whose name ends in digits', () => {
      // LOG10( stays a call; only the bare A1 freezes.
      expect(toCanonical('LOG10(A1)')).to.equal('LOG10(REF(COLUMN("price"), ROW("r1")))');
    });

    it('treats a bare identifier as a same-row field reference', () => {
      expect(toCanonical('price + qty')).to.equal('price + qty');
    });

    it('does not capture special-form names', () => {
      const canonical = 'COLUMN_VALUES("price") + ROW_POSITION';
      expect(toCanonical(canonical)).to.equal(canonical);
    });

    it('reports whether anything changed', () => {
      expect(toCanonicalFormula('A1', { positionContext: CONTEXT }).changed).to.equal(true);
      expect(toCanonicalFormula('price + qty', { positionContext: CONTEXT }).changed).to.equal(
        false,
      );
    });
  });

  describe('toCanonicalFormula — paste offset', () => {
    it('shifts relative axes by the paste offset before freezing', () => {
      // Pasting `A1` one row down and one column right → B2.
      expect(toCanonical('A1', { rowOffset: 1, columnOffset: 1 })).to.equal(
        'REF(COLUMN("qty"), ROW("r2"))',
      );
    });

    it('does not shift absolute axes', () => {
      expect(toCanonical('$A$1', { rowOffset: 2, columnOffset: 2 })).to.equal(
        'REF(COLUMN_POSITION(1), ROW_POSITION(1))',
      );
    });

    it('only shifts the relative axis of a mixed ref', () => {
      expect(toCanonical('$A1', { rowOffset: 1, columnOffset: 1 })).to.equal(
        'REF(COLUMN_POSITION(1), ROW("r2"))',
      );
    });

    it('shifts the non-`$` axes of a range window', () => {
      expect(toCanonical('A1:B2', { rowOffset: 1, columnOffset: 1 })).to.equal(
        'RANGE_REF(COLUMN_FROM(2), ROW_FROM(2), COLUMN_TO(3), ROW_TO(3))',
      );
    });

    it('pins the `$` axes of a range window against the offset', () => {
      expect(toCanonical('$A$1:B2', { rowOffset: 1, columnOffset: 1 })).to.equal(
        'RANGE_REF(FIXED(COLUMN_FROM(1)), FIXED(ROW_FROM(1)), COLUMN_TO(3), ROW_TO(3))',
      );
    });

    it('clamps a range axis pushed below position 1', () => {
      expect(toCanonical('A1:B2', { rowOffset: -5, columnOffset: -5 })).to.equal(
        'RANGE_REF(COLUMN_FROM(1), ROW_FROM(1), COLUMN_TO(1), ROW_TO(1))',
      );
    });
  });

  describe('toCanonicalFormula — anchored ranges', () => {
    // r3/total = row position 3, column position 3, inside the default band.
    const ANCHOR_CELL = { id: 'r3' as FormulaRowId, field: 'total' };

    it('freezes plain endpoints to ANCHOR offsets from the committing cell', () => {
      expect(toCanonicalAt('SUM(A1:B2)', ANCHOR_CELL)).to.equal(
        'SUM(RANGE_REF(COLUMN_FROM(ANCHOR(-2)), ROW_FROM(ANCHOR(-2)), COLUMN_TO(ANCHOR(-1)), ROW_TO(ANCHOR(-1))))',
      );
    });

    it('keeps `$` endpoints absolute (FIXED) with an anchor present', () => {
      expect(toCanonicalAt('SUM($A$1:$B$2)', ANCHOR_CELL)).to.equal(
        'SUM(RANGE_REF(FIXED(COLUMN_FROM(1)), FIXED(ROW_FROM(1)), FIXED(COLUMN_TO(2)), FIXED(ROW_TO(2))))',
      );
    });

    it('freezes the running-total shape ($A$1:A3) to FIXED start + ANCHOR end', () => {
      expect(toCanonicalAt('SUM($A$1:A3)', ANCHOR_CELL)).to.equal(
        'SUM(RANGE_REF(FIXED(COLUMN_FROM(1)), FIXED(ROW_FROM(1)), COLUMN_TO(ANCHOR(-2)), ROW_TO(ANCHOR(0))))',
      );
    });

    it('freezes plain endpoints absolutely when the anchor row is pinned (outside the band)', () => {
      // r1 pinned top, r5 pinned bottom: the data band is rows 2..4.
      const pinnedContext = createTestPositionContext(ROW_IDS, FIELDS, 0, {
        dataFromIndex: 2,
        dataToIndex: 4,
      });
      expect(
        toCanonicalAt('SUM(A2:A4)', { id: 'r1', field: 'total' }, undefined, pinnedContext),
      ).to.equal('SUM(RANGE_REF(COLUMN_FROM(1), ROW_FROM(2), COLUMN_TO(1), ROW_TO(4)))');
    });

    it('freezes plain endpoints absolutely when the anchor has no position', () => {
      // Unknown row id and hidden column both disable the anchor.
      expect(toCanonicalAt('SUM(A1:A2)', { id: 'r9', field: 'total' })).to.equal(
        'SUM(RANGE_REF(COLUMN_FROM(1), ROW_FROM(1), COLUMN_TO(1), ROW_TO(2)))',
      );
      expect(toCanonicalAt('SUM(A1:A2)', { id: 'r3', field: 'hidden' })).to.equal(
        'SUM(RANGE_REF(COLUMN_FROM(1), ROW_FROM(1), COLUMN_TO(1), ROW_TO(2)))',
      );
    });

    it('applies the paste offset to the literal before freezing the delta', () => {
      // Rows 1..2 shift to 2..3, then freeze against row 3: deltas −1..0.
      expect(toCanonicalAt('SUM(A1:A2)', ANCHOR_CELL, { rowOffset: 1 })).to.equal(
        'SUM(RANGE_REF(COLUMN_FROM(ANCHOR(-2)), ROW_FROM(ANCHOR(-1)), COLUMN_TO(ANCHOR(-2)), ROW_TO(ANCHOR(0))))',
      );
    });

    it('leaves single-cell refs on the D5 mapping — the anchor only affects ranges', () => {
      expect(toCanonicalAt('A1 + $B$2', ANCHOR_CELL)).to.equal(toCanonical('A1 + $B$2'));
    });
  });

  describe('toDisplayFormula — anchored ranges', () => {
    const ANCHOR_CELL = { id: 'r3' as FormulaRowId, field: 'total' };
    const ANCHORED_WINDOW =
      'SUM(RANGE_REF(COLUMN_FROM(ANCHOR(-2)), ROW_FROM(ANCHOR(-2)), COLUMN_TO(ANCHOR(-1)), ROW_TO(ANCHOR(-1))))';

    it('renders ANCHOR axes at the anchored position', () => {
      expect(toDisplayAt(ANCHORED_WINDOW, ANCHOR_CELL)).to.equal('SUM(A1:B2)');
    });

    it('renders the window at the anchor cell it is displayed for — it moves with the formula', () => {
      // The same stored text one row lower shows the shifted window.
      expect(toDisplayAt(ANCHORED_WINDOW, { id: 'r4', field: 'total' })).to.equal('SUM(A2:B3)');
    });

    it('renders mixed FIXED/ANCHOR windows with `$` on the fixed axes only', () => {
      expect(
        toDisplayAt(
          'SUM(RANGE_REF(FIXED(COLUMN_FROM(1)), FIXED(ROW_FROM(1)), COLUMN_TO(ANCHOR(-2)), ROW_TO(ANCHOR(0))))',
          ANCHOR_CELL,
        ),
      ).to.equal('SUM($A$1:A3)');
    });

    it('falls back to canonical when an ANCHOR axis resolves below position 1', () => {
      // Anchor at row 2: ROW_FROM(ANCHOR(-3)) points above the view — A1 has
      // no token for it, and a clamped token would re-freeze to different
      // offsets on the next edited commit.
      const source =
        'SUM(RANGE_REF(COLUMN_FROM(ANCHOR(0)), ROW_FROM(ANCHOR(-3)), COLUMN_TO(ANCHOR(0)), ROW_TO(ANCHOR(-1))))';
      expect(toDisplayAt(source, { id: 'r2', field: 'total' })).to.equal(source);
    });

    it('falls back to canonical without an anchor cell or without an anchor position', () => {
      expect(toDisplay(ANCHORED_WINDOW)).to.equal(ANCHORED_WINDOW);
      expect(toDisplayAt(ANCHORED_WINDOW, { id: 'r9', field: 'total' })).to.equal(ANCHORED_WINDOW);
    });

    it('round-trips: an unchanged display re-freezes to the same canonical text', () => {
      const display = toDisplayAt(ANCHORED_WINDOW, ANCHOR_CELL);
      expect(toCanonicalAt(display, ANCHOR_CELL)).to.equal(ANCHORED_WINDOW);
    });
  });

  describe('toDisplayFormula', () => {
    it('renders stable refs as relative A1', () => {
      expect(toDisplay('REF(COLUMN("price"), ROW("r1"))')).to.equal('A1');
      expect(toDisplay('REF(COLUMN("total"), ROW("r5"))')).to.equal('C5');
    });

    it('renders positional refs as absolute A1', () => {
      expect(toDisplay('REF(COLUMN_POSITION(1), ROW_POSITION(1))')).to.equal('$A$1');
      expect(toDisplay('REF(COLUMN("price"), ROW_POSITION(1))')).to.equal('A$1');
      expect(toDisplay('REF(COLUMN_POSITION(1), ROW("r1"))')).to.equal('$A1');
    });

    it('renders RANGE_REF as an A1 rectangle', () => {
      expect(
        toDisplay('SUM(RANGE_REF(COLUMN_FROM(1), ROW_FROM(1), COLUMN_TO(2), ROW_TO(5)))'),
      ).to.equal('SUM(A1:B5)');
    });

    it('renders FIXED window axes with `$`', () => {
      expect(
        toDisplay(
          'RANGE_REF(FIXED(COLUMN_FROM(1)), FIXED(ROW_FROM(1)), FIXED(COLUMN_TO(1)), FIXED(ROW_TO(4)))',
        ),
      ).to.equal('$A$1:$A$4');
      expect(
        toDisplay('RANGE_REF(FIXED(COLUMN_FROM(1)), ROW_FROM(1), COLUMN_TO(2), ROW_TO(5))'),
      ).to.equal('$A1:B5');
    });

    it('renders a window that currently clips against the view edge', () => {
      // Positions are the model, so there is no canonical fallback for ranges:
      // an out-of-view window still renders as A1 and clips only when resolved.
      expect(
        toDisplay('SUM(RANGE_REF(COLUMN_FROM(1), ROW_FROM(1), COLUMN_TO(1), ROW_TO(9)))'),
      ).to.equal('SUM(A1:A9)');
    });

    it('renders COLUMN_VALUES as a whole-column range', () => {
      expect(toDisplay('SUM(COLUMN_VALUES("total"))')).to.equal('SUM(C:C)');
    });

    it('falls back to canonical for a ref with no current position', () => {
      // `missing` is not a visible field → not displayable as A1.
      expect(toDisplay('REF(COLUMN("missing"), ROW("r1"))')).to.equal(
        'REF(COLUMN("missing"), ROW("r1"))',
      );
      expect(toDisplay('REF(COLUMN("price"), ROW("r99"))')).to.equal(
        'REF(COLUMN("price"), ROW("r99"))',
      );
    });

    it('preserves operators, precedence and bare field refs', () => {
      expect(toDisplay('(A1 + B1) * price')).to.equal('(A1 + B1) * price');
    });

    it('returns the input unchanged when it does not parse', () => {
      expect(toDisplay('A1 +')).to.equal('A1 +');
    });
  });

  describe('round-trip', () => {
    const roundTrips = (a1: string) => {
      const canonical = toCanonical(a1);
      const display = toDisplay(canonical);
      // A1 → canonical → A1 is stable.
      expect(display).to.equal(a1);
      // canonical → A1 → canonical is stable (semantic identity through the AST).
      expect(toCanonical(display)).to.equal(canonical);
    };

    it('is stable for every D5 reference shape', () => {
      roundTrips('A1');
      roundTrips('$A1');
      roundTrips('A$1');
      roundTrips('$A$1');
      roundTrips('B3 + C5');
      roundTrips('SUM(A1:B5)');
      roundTrips('SUM(C:C)');
    });

    it('is stable for every range window shape', () => {
      roundTrips('SUM(A1:B5)');
      roundTrips('SUM($A$1:$A$4)');
      roundTrips('$A1:B5');
      roundTrips('A$1:$B5');
      // A window reaching past the current view survives the round-trip too.
      roundTrips('SUM(A1:A9)');
    });

    it('preserves the canonical AST through a display round-trip', () => {
      const stored = toCanonical('SUM(A1:C3) + price * $B$2');
      const reCanonical = toCanonical(toDisplay(stored));
      expect(stripSpans(parseOk(reCanonical))).to.deep.equal(stripSpans(parseOk(stored)));
      // And the canonical text is byte-stable too.
      expect(serializeFormulaAst(parseOk(reCanonical))).to.equal(
        serializeFormulaAst(parseOk(stored)),
      );
    });
  });
});
