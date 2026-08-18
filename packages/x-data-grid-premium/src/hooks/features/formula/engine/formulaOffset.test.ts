import { parseFormula } from './formulaParser';
import { serializeFormulaAst } from './formulaSerializer';
import { offsetFormulaReferences } from './formulaOffset';
import { createTestPositionContext } from './testUtils';
import type { FormulaAstNode } from './formulaAst';
import type { FormulaRowId } from './formulaTypes';

const parseOk = (expression: string): FormulaAstNode => {
  const { ast, error } = parseFormula(expression);
  if (ast === null) {
    throw new Error(`Test expression did not parse: ${error?.message}`);
  }
  return ast;
};

// A 3-column × 5-row context: columns A,B,C map to price,qty,total; rows 1..5
// map to r1..r5. Offsets operate on the parsed expression (no leading `=`).
const FIELDS = ['price', 'qty', 'total'];
const ROW_IDS: FormulaRowId[] = ['r1', 'r2', 'r3', 'r4', 'r5'];
const context = createTestPositionContext(ROW_IDS, FIELDS);

const offset = (expression: string, rowDelta: number, columnDelta: number): string =>
  serializeFormulaAst(offsetFormulaReferences(parseOk(expression), rowDelta, columnDelta, context));

describe('offsetFormulaReferences', () => {
  it('returns the same node reference for a zero delta', () => {
    const ast = parseOk('REF(COLUMN("price"), ROW("r1")) * 2');
    expect(offsetFormulaReferences(ast, 0, 0, context)).toBe(ast);
  });

  describe('stable references (relative)', () => {
    it('shifts a stable row reference down', () => {
      expect(offset('REF(COLUMN("price"), ROW("r1"))', 1, 0)).toBe(
        'REF(COLUMN("price"), ROW("r2"))',
      );
      expect(offset('REF(COLUMN("price"), ROW("r1"))', 2, 0)).toBe(
        'REF(COLUMN("price"), ROW("r3"))',
      );
    });

    it('shifts a stable row reference up', () => {
      expect(offset('REF(COLUMN("price"), ROW("r3"))', -2, 0)).toBe(
        'REF(COLUMN("price"), ROW("r1"))',
      );
    });

    it('shifts a stable column reference right', () => {
      expect(offset('REF(COLUMN("price"), ROW("r1"))', 0, 1)).toBe('REF(COLUMN("qty"), ROW("r1"))');
      expect(offset('REF(COLUMN("price"), ROW("r1"))', 0, 2)).toBe(
        'REF(COLUMN("total"), ROW("r1"))',
      );
    });

    it('shifts both axes together (=A1*B1 dragged down → =A2*B2)', () => {
      expect(offset('REF(COLUMN("price"), ROW("r1")) * REF(COLUMN("qty"), ROW("r1"))', 1, 0)).toBe(
        'REF(COLUMN("price"), ROW("r2")) * REF(COLUMN("qty"), ROW("r2"))',
      );
    });
  });

  describe('positional references (absolute, from `$`)', () => {
    it('never shifts a fully positional reference', () => {
      expect(offset('REF(COLUMN_POSITION(1), ROW_POSITION(1))', 3, 1)).toBe(
        'REF(COLUMN_POSITION(1), ROW_POSITION(1))',
      );
    });

    it('shifts only the relative axis of a mixed reference', () => {
      // COLUMN("price") + ROW_POSITION(1): column relative, row absolute.
      expect(offset('REF(COLUMN("price"), ROW_POSITION(1))', 2, 1)).toBe(
        'REF(COLUMN("qty"), ROW_POSITION(1))',
      );
      // COLUMN_POSITION(1) + ROW("r1"): column absolute, row relative.
      expect(offset('REF(COLUMN_POSITION(1), ROW("r1"))', 2, 1)).toBe(
        'REF(COLUMN_POSITION(1), ROW("r3"))',
      );
    });
  });

  describe('range windows', () => {
    it('shifts every non-fixed axis (=SUM(A1:A3) down one → =SUM(A2:A4))', () => {
      expect(
        offset('SUM(RANGE_REF(COLUMN_FROM(1), ROW_FROM(1), COLUMN_TO(1), ROW_TO(3)))', 1, 0),
      ).toBe('SUM(RANGE_REF(COLUMN_FROM(1), ROW_FROM(2), COLUMN_TO(1), ROW_TO(4)))');
    });

    it('shifts the column axes on a horizontal fill (A1:A3 → B1:B3)', () => {
      expect(
        offset('SUM(RANGE_REF(COLUMN_FROM(1), ROW_FROM(1), COLUMN_TO(1), ROW_TO(3)))', 0, 1),
      ).toBe('SUM(RANGE_REF(COLUMN_FROM(2), ROW_FROM(1), COLUMN_TO(2), ROW_TO(3)))');
    });

    it('keeps a FIXED start while shifting a relative end (running total)', () => {
      // `=SUM($A$1:A1)` dragged down one → `=SUM($A$1:A2)`.
      expect(
        offset(
          'SUM(RANGE_REF(FIXED(COLUMN_FROM(1)), FIXED(ROW_FROM(1)), COLUMN_TO(1), ROW_TO(1)))',
          1,
          0,
        ),
      ).toBe('SUM(RANGE_REF(FIXED(COLUMN_FROM(1)), FIXED(ROW_FROM(1)), COLUMN_TO(1), ROW_TO(2)))');
    });

    it('never moves a FIXED axis, on either delta', () => {
      const window =
        'SUM(RANGE_REF(FIXED(COLUMN_FROM(1)), FIXED(ROW_FROM(1)), FIXED(COLUMN_TO(2)), FIXED(ROW_TO(4))))';
      expect(offset(window, 3, 2)).toBe(window);
    });

    it('clamps an underflowing axis at position 1 (the window shrinks at the top)', () => {
      // Filling `A2:A4` two rows up: the start clamps to 1, the end follows.
      expect(
        offset('SUM(RANGE_REF(COLUMN_FROM(1), ROW_FROM(2), COLUMN_TO(1), ROW_TO(4)))', -3, 0),
      ).toBe('SUM(RANGE_REF(COLUMN_FROM(1), ROW_FROM(1), COLUMN_TO(1), ROW_TO(1)))');
    });

    it('keeps the arithmetic index on overshoot (resolution clips, not the offset)', () => {
      // r5 is the last row; the window keeps counting past it and auto-clips
      // when it is resolved against the view.
      expect(
        offset('SUM(RANGE_REF(COLUMN_FROM(1), ROW_FROM(4), COLUMN_TO(1), ROW_TO(5)))', 2, 0),
      ).toBe('SUM(RANGE_REF(COLUMN_FROM(1), ROW_FROM(6), COLUMN_TO(1), ROW_TO(7)))');
      // Same past the last column.
      expect(
        offset('SUM(RANGE_REF(COLUMN_FROM(3), ROW_FROM(1), COLUMN_TO(3), ROW_TO(2)))', 0, 2),
      ).toBe('SUM(RANGE_REF(COLUMN_FROM(5), ROW_FROM(1), COLUMN_TO(5), ROW_TO(2)))');
    });

    it('copies ANCHOR axes verbatim — moving the formula IS the adjustment', () => {
      const window =
        'SUM(RANGE_REF(COLUMN_FROM(ANCHOR(-2)), ROW_FROM(ANCHOR(-3)), COLUMN_TO(ANCHOR(0)), ROW_TO(ANCHOR(-1))))';
      expect(offset(window, 3, 1)).toBe(window);
      expect(offset(window, -2, 0)).toBe(window);
    });

    it('shifts only the positional axes of a mixed FIXED/positional/ANCHOR window', () => {
      expect(
        offset(
          'SUM(RANGE_REF(FIXED(COLUMN_FROM(1)), ROW_FROM(2), COLUMN_TO(2), ROW_TO(ANCHOR(0))))',
          1,
          1,
        ),
      ).toBe('SUM(RANGE_REF(FIXED(COLUMN_FROM(1)), ROW_FROM(3), COLUMN_TO(3), ROW_TO(ANCHOR(0))))');
    });
  });

  describe('same-row field references', () => {
    it('leaves a same-row field reference unchanged on vertical fill', () => {
      expect(offset('price * qty', 2, 0)).toBe('price * qty');
    });

    it('shifts a same-row field reference on horizontal fill', () => {
      expect(offset('price', 0, 1)).toBe('qty');
      expect(offset('price * qty', 0, 1)).toBe('qty * total');
    });
  });

  describe('whole-column references', () => {
    it('leaves COLUMN_VALUES unchanged on vertical fill', () => {
      expect(offset('SUM(COLUMN_VALUES("price"))', 3, 0)).toBe('SUM(COLUMN_VALUES("price"))');
    });

    it('shifts COLUMN_VALUES on horizontal fill', () => {
      expect(offset('SUM(COLUMN_VALUES("price"))', 0, 1)).toBe('SUM(COLUMN_VALUES("qty"))');
    });
  });

  describe('out of bounds', () => {
    it('freezes overshoot to a positional reference that resolves to #REF!', () => {
      // r5 is the last row; +1 lands beyond the row set.
      expect(offset('REF(COLUMN("price"), ROW("r5"))', 1, 0)).toBe(
        'REF(COLUMN("price"), ROW_POSITION(6))',
      );
      // total is the last column; +1 lands beyond the columns.
      expect(offset('REF(COLUMN("total"), ROW("r1"))', 0, 1)).toBe(
        'REF(COLUMN_POSITION(4), ROW("r1"))',
      );
    });

    it('keeps the original reference on underflow (no representable position < 1)', () => {
      // r1 is the first row; -1 would land above it.
      expect(offset('REF(COLUMN("price"), ROW("r1"))', -1, 0)).toBe(
        'REF(COLUMN("price"), ROW("r1"))',
      );
      // price is the first column; -1 would land left of it.
      expect(offset('REF(COLUMN("price"), ROW("r1"))', 0, -1)).toBe(
        'REF(COLUMN("price"), ROW("r1"))',
      );
    });

    it('keeps a same-row field reference on horizontal overshoot', () => {
      expect(offset('total', 0, 1)).toBe('total');
    });
  });

  describe('references inside expressions and functions', () => {
    it('shifts references nested in function calls and operators', () => {
      expect(
        offset('IF(REF(COLUMN("price"), ROW("r1")) > 0, REF(COLUMN("qty"), ROW("r1")), 0)', 1, 0),
      ).toBe('IF(REF(COLUMN("price"), ROW("r2")) > 0, REF(COLUMN("qty"), ROW("r2")), 0)');
    });

    it('shifts references under a unary expression', () => {
      expect(offset('-REF(COLUMN("price"), ROW("r1"))', 1, 0)).toBe(
        '-REF(COLUMN("price"), ROW("r2"))',
      );
    });

    it('leaves literals untouched', () => {
      expect(offset('1 + 2 * 3', 5, 5)).toBe('1 + 2 * 3');
    });
  });
});
