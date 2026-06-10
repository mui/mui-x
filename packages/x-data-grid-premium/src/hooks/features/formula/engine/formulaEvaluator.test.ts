import { evaluateFormula } from './formulaEvaluator';
import { parseFormula } from './formulaParser';
import type { FormulaResult, FormulaScalar } from './formulaTypes';
import { createTestContext } from './testUtils';
import type { CreateTestContextOptions, TestRow } from './testUtils';

const ROWS: TestRow[] = [
  { id: 'r1', price: 50, quantity: 4, name: 'Chair', inStock: true, note: null },
  { id: 'r2', price: 200, quantity: 1, name: 'Desk', inStock: false, note: 'fragile' },
];

function evaluate(
  expression: string,
  rows: TestRow[] = ROWS,
  options: CreateTestContextOptions = {},
): FormulaResult {
  const { ast, error } = parseFormula(expression);
  if (ast === null) {
    throw new Error(`Test expression did not parse: ${error?.message}`);
  }
  return evaluateFormula(ast, createTestContext(rows, undefined, options));
}

const expectValue = (expression: string, value: FormulaScalar) => {
  expect(evaluate(expression)).to.deep.equal({ type: 'value', value });
};

const expectErrorCode = (expression: string, code: string) => {
  const result = evaluate(expression);
  expect(result.type).to.equal('error');
  expect((result as { code: string }).code).to.equal(code);
};

describe('formulaEvaluator', () => {
  describe('literals and operators', () => {
    it('evaluates arithmetic with precedence', () => {
      expectValue('1 + 2 * 3', 7);
      expectValue('(1 + 2) * 3', 9);
      expectValue('10 / 4', 2.5);
    });

    it('evaluates the Excel precedence quirks', () => {
      expectValue('-2 ^ 2', 4);
      expectValue('2 ^ -2', 0.25);
      expectValue('2 ^ 3 ^ 2', 64);
    });

    it('evaluates string concatenation', () => {
      expectValue('"a" & "b" & 1', 'ab1');
      expectValue('1 & 2', '12');
      expectValue('TRUE & "x"', 'TRUEx');
    });

    it('evaluates comparisons', () => {
      expectValue('1 < 2', true);
      expectValue('"a" = "A"', true);
      expectValue('1 <> 1', false);
      expectValue('2 >= 3', false);
    });

    it('coerces operands numerically', () => {
      expectValue('"5" + 1', 6);
      expectValue('TRUE + 1', 2);
    });

    it('returns #DIV/0! for division by zero', () => {
      expectErrorCode('1 / 0', '#DIV/0!');
      // Empty coerces to 0 in numeric context.
      expectErrorCode('1 / note', '#DIV/0!');
    });

    it('returns #VALUE! for failed coercion', () => {
      expectErrorCode('"abc" + 1', '#VALUE!');
      expectErrorCode('1 < "a"', '#VALUE!');
    });

    it('returns #VALUE! for non-finite results', () => {
      expectErrorCode('2 ^ 10000', '#VALUE!');
    });

    it('treats unary + as an identity operation (Excel behavior, no coercion)', () => {
      expectValue('+"abc"', 'abc');
      expectValue('+TRUE', true);
      expectValue('+"5"', '5');
      // Unary minus does coerce.
      expectValue('-"5"', -5);
    });
  });

  describe('references', () => {
    it('resolves same-row field refs against the current cell row', () => {
      expectValue('price * quantity', 200);
    });

    it('resolves field refs for a different current cell', () => {
      const result = evaluate('price * quantity', ROWS, {
        currentCell: { id: 'r2', field: 'total' },
      });
      expect(result).to.deep.equal({ type: 'value', value: 200 });
    });

    it('resolves FIELD("...") like a bare field ref', () => {
      expectValue('FIELD("price") * 2', 100);
    });

    it('returns #REF! for an unknown field', () => {
      const result = evaluate('missing + 1');
      expect(result).to.deep.equal({
        type: 'error',
        code: '#REF!',
        message: 'The field "missing" does not exist.',
      });
    });

    it('resolves stable cell refs through the resolver', () => {
      expectValue('REF(COLUMN("price"), ROW("r2")) - REF(COLUMN("price"), ROW("r1"))', 150);
    });

    it('returns #REF! for a missing row id', () => {
      const result = evaluate('REF(COLUMN("price"), ROW("missing"))');
      expect(result).to.deep.equal({
        type: 'error',
        code: '#REF!',
        message: 'The row with id "missing" does not exist.',
      });
    });

    it('returns #REF! for a missing field in a cell ref', () => {
      expectErrorCode('REF(COLUMN("missing"), ROW("r1"))', '#REF!');
    });

    it('treats empty cells as null (0 in numeric context)', () => {
      expectValue('note + 5', 5);
    });

    it('rejects positional refs until the position machinery lands', () => {
      const result = evaluate('REF(COLUMN("price"), ROW_POSITION(1))');
      expect(result).to.deep.equal({
        type: 'error',
        code: '#REF!',
        message: 'Positional references are not supported yet.',
      });
    });

    it('rejects ranges until the position machinery lands', () => {
      expectErrorCode(
        'SUM(RANGE(REF(COLUMN("price"), ROW("r1")), REF(COLUMN("price"), ROW("r2"))))',
        '#REF!',
      );
      expectErrorCode('SUM(COLUMN_VALUES("price"))', '#REF!');
    });
  });

  describe('error propagation', () => {
    it('propagates the first error left-to-right', () => {
      // Left operand fails with #REF!, right would fail with #DIV/0!.
      const result = evaluate('missing + 1 / 0');
      expect((result as { code: string }).code).to.equal('#REF!');
    });

    it('propagates dependency errors through eager function arguments', () => {
      expectErrorCode('SUM(1, missing)', '#REF!');
    });

    it('propagates errors through unary operators', () => {
      expectErrorCode('-missing', '#REF!');
    });
  });

  describe('functions', () => {
    it('evaluates aggregates over scalar arguments', () => {
      expectValue('SUM(1, 2, 3)', 6);
      expectValue('AVERAGE(2, 4)', 3);
      expectValue('MIN(3, 1, 2)', 1);
      expectValue('MAX(3, 1, 2)', 3);
      expectValue('COUNT(1, "a", 2)', 2);
      expectValue('COUNTA(1, "a", note)', 2);
    });

    it('skips empty cells in aggregates', () => {
      expectValue('SUM(1, note, 2)', 3);
      expectValue('AVERAGE(4, note)', 4);
    });

    it('evaluates math functions', () => {
      expectValue('ROUND(2.345, 2)', 2.35);
      expectValue('ROUND(2.5)', 3);
      expectValue('ROUND(-2.5)', -3);
      expectValue('ABS(-3)', 3);
      expectValue('MOD(-3, 2)', 1);
      expectValue('POWER(2, 10)', 1024);
    });

    it('evaluates logical functions', () => {
      // The default current cell is row r1 (price 50).
      expectValue('IF(price > 100, "expensive", "cheap")', 'cheap');
      expectValue('IF(price > 40, "expensive", "cheap")', 'expensive');
      expectValue('AND(TRUE, 1, "true")', true);
      expectValue('AND(TRUE, FALSE)', false);
      expectValue('OR(FALSE, 0)', false);
      expectValue('OR(FALSE, 1)', true);
      expectValue('NOT(FALSE)', true);
    });

    it('returns FALSE for IF without an else branch', () => {
      expectValue('IF(FALSE, 1)', false);
    });

    it('does not evaluate the untaken IF branch (laziness)', () => {
      const reads: string[] = [];
      const result = evaluate('IF(TRUE, price, missing + 1 / 0)', ROWS, {
        onGetCellValue: (ref) => reads.push(ref.field),
      });
      expect(result).to.deep.equal({ type: 'value', value: 50 });
      expect(reads).to.deep.equal(['price']);
    });

    it('short-circuits AND/OR', () => {
      const reads: string[] = [];
      evaluate('OR(TRUE, price)', ROWS, { onGetCellValue: (ref) => reads.push(ref.field) });
      expect(reads).to.deep.equal([]);
    });

    it('lets IFERROR swallow errors', () => {
      expectValue('IFERROR(1 / 0, "fallback")', 'fallback');
      expectValue('IFERROR(5, "fallback")', 5);
      expectValue('IFERROR(missing, 0)', 0);
    });

    it('lets ISBLANK observe errors as non-blank', () => {
      expectValue('ISBLANK(note)', true);
      expectValue('ISBLANK(price)', false);
      expectValue('ISBLANK(1 / 0)', false);
    });

    it('evaluates text functions', () => {
      expectValue('CONCAT("a", 1, TRUE)', 'a1TRUE');
      expectValue('CONCATENATE("a", "b")', 'ab');
      expectValue('LEN("abc")', 3);
      expectValue('UPPER("abc")', 'ABC');
      expectValue('LOWER("ABC")', 'abc');
      expectValue('TRIM("  a   b  ")', 'a b');
      expectValue('LEFT("abcdef", 2)', 'ab');
      expectValue('LEFT("abcdef")', 'a');
      expectValue('RIGHT("abcdef", 2)', 'ef');
      expectValue('RIGHT("abcdef", 0)', '');
    });

    it('returns #NAME? for unknown functions', () => {
      const result = evaluate('NOPE(1)');
      expect(result).to.deep.equal({
        type: 'error',
        code: '#NAME?',
        message: 'Unknown function "NOPE".',
      });
    });

    it('returns #VALUE! for arity violations', () => {
      expectErrorCode('ABS()', '#VALUE!');
      expectErrorCode('ABS(1, 2)', '#VALUE!');
      expectErrorCode('IF(TRUE)', '#VALUE!');
    });

    it('rejects negative character counts in LEFT/RIGHT', () => {
      expectErrorCode('LEFT("abc", -1)', '#VALUE!');
    });

    it('supports custom functions', () => {
      const result = evaluate('DOUBLE(price)', ROWS, {
        customFunctions: [
          {
            name: 'DOUBLE',
            minArgs: 1,
            maxArgs: 1,
            apply: (args, context) => {
              const value = context.coerce.toNumber(args[0] as never);
              return typeof value === 'number' ? value * 2 : value;
            },
          },
        ],
      });
      expect(result).to.deep.equal({ type: 'value', value: 100 });
    });

    it('returns #VALUE! when a function result overflows to a non-finite number', () => {
      const sumOverflow = evaluate('SUM(1e308, 1e308)');
      expect(sumOverflow).to.deep.equal({
        type: 'error',
        code: '#VALUE!',
        message: 'SUM() produced a non-finite number.',
      });
      expectErrorCode('POWER(2, 10000)', '#VALUE!');
      // The non-finite gate also covers consumption by other operators.
      expectErrorCode('SUM(1e308, 1e308) & "x"', '#VALUE!');
    });

    it('returns #VALUE! when a custom function returns a non-finite number', () => {
      const result = evaluate('INF()', ROWS, {
        customFunctions: [{ name: 'INF', minArgs: 0, maxArgs: 0, apply: () => Infinity }],
      });
      expect(result).to.deep.equal({
        type: 'error',
        code: '#VALUE!',
        message: 'INF() produced a non-finite number.',
      });
    });

    it('wraps exceptions thrown by functions as #ERROR!', () => {
      const result = evaluate('BOOM()', ROWS, {
        customFunctions: [
          {
            name: 'BOOM',
            minArgs: 0,
            maxArgs: 0,
            apply: () => {
              throw new Error('exploded');
            },
          },
        ],
      });
      expect(result).to.deep.equal({ type: 'error', code: '#ERROR!', message: 'exploded' });
    });

    it('normalizes an undefined function result to null', () => {
      const result = evaluate('NOTHING()', ROWS, {
        customFunctions: [
          {
            name: 'NOTHING',
            minArgs: 0,
            maxArgs: 0,
            apply: () => undefined as never,
          },
        ],
      });
      expect(result).to.deep.equal({ type: 'value', value: null });
    });
  });

  describe('empty cell semantics', () => {
    it('empty equals empty, not zero or the empty string', () => {
      expectValue('note = note', true);
      expectValue('note = 0', false);
      expectValue('note = ""', false);
    });
  });
});
