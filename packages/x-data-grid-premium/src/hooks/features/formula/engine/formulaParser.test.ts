import { describe, it, expect } from 'vitest';
import { parseFormula, createFormulaParser } from './formulaParser';
import type { FormulaAstNode } from './formulaAst';

/**
 * Recursively removes `span` properties so structural assertions stay readable.
 */
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

const parseOk = (expression: string): unknown => {
  const { ast, error } = parseFormula(expression);
  expect(error).to.equal(null);
  return stripSpans(ast);
};

const parseError = (expression: string): string => {
  const { ast, error } = parseFormula(expression);
  expect(ast).to.equal(null);
  return error!.message;
};

describe('formulaParser', () => {
  describe('literals', () => {
    it('parses number, string and boolean literals', () => {
      expect(parseOk('1.5')).to.deep.equal({ type: 'numberLiteral', value: 1.5 });
      expect(parseOk('"a""b"')).to.deep.equal({ type: 'stringLiteral', value: 'a"b' });
      expect(parseOk('TRUE')).to.deep.equal({ type: 'booleanLiteral', value: true });
      expect(parseOk('false')).to.deep.equal({ type: 'booleanLiteral', value: false });
    });
  });

  describe('field references', () => {
    it('parses a bare identifier as a same-row field ref', () => {
      expect(parseOk('price')).to.deep.equal({ type: 'fieldRef', field: 'price' });
    });

    it('preserves the case of field names', () => {
      expect(parseOk('unitPrice')).to.deep.equal({ type: 'fieldRef', field: 'unitPrice' });
    });

    it('parses FIELD("...") for arbitrary field names', () => {
      expect(parseOk('FIELD("unit price")')).to.deep.equal({
        type: 'fieldRef',
        field: 'unit price',
      });
    });

    it('requires a string literal inside FIELD()', () => {
      expect(parseError('FIELD(price)')).to.equal('FIELD() expects a string literal.');
    });
  });

  describe('operator precedence and associativity', () => {
    it('gives multiplication precedence over addition', () => {
      expect(parseOk('1 + 2 * 3')).to.deep.equal({
        type: 'binaryExpression',
        operator: '+',
        left: { type: 'numberLiteral', value: 1 },
        right: {
          type: 'binaryExpression',
          operator: '*',
          left: { type: 'numberLiteral', value: 2 },
          right: { type: 'numberLiteral', value: 3 },
        },
      });
    });

    it('parses comparison with the lowest precedence', () => {
      expect(parseOk('1 + 2 > 2 & "x"')).to.deep.equal({
        type: 'binaryExpression',
        operator: '>',
        left: {
          type: 'binaryExpression',
          operator: '+',
          left: { type: 'numberLiteral', value: 1 },
          right: { type: 'numberLiteral', value: 2 },
        },
        right: {
          type: 'binaryExpression',
          operator: '&',
          left: { type: 'numberLiteral', value: 2 },
          right: { type: 'stringLiteral', value: 'x' },
        },
      });
    });

    it('keeps binary operators left-associative', () => {
      expect(parseOk('1 - 2 - 3')).to.deep.equal({
        type: 'binaryExpression',
        operator: '-',
        left: {
          type: 'binaryExpression',
          operator: '-',
          left: { type: 'numberLiteral', value: 1 },
          right: { type: 'numberLiteral', value: 2 },
        },
        right: { type: 'numberLiteral', value: 3 },
      });
    });

    it('keeps ^ left-associative (Excel-compatible: 2^3^2 = (2^3)^2)', () => {
      expect(parseOk('2 ^ 3 ^ 2')).to.deep.equal({
        type: 'binaryExpression',
        operator: '^',
        left: {
          type: 'binaryExpression',
          operator: '^',
          left: { type: 'numberLiteral', value: 2 },
          right: { type: 'numberLiteral', value: 3 },
        },
        right: { type: 'numberLiteral', value: 2 },
      });
    });

    it('binds unary minus tighter than ^ (Excel-compatible: -2^2 = (-2)^2)', () => {
      expect(parseOk('-2 ^ 2')).to.deep.equal({
        type: 'binaryExpression',
        operator: '^',
        left: {
          type: 'unaryExpression',
          operator: '-',
          operand: { type: 'numberLiteral', value: 2 },
        },
        right: { type: 'numberLiteral', value: 2 },
      });
    });

    it('parses a unary operator on the right side of ^', () => {
      expect(parseOk('2 ^ -2')).to.deep.equal({
        type: 'binaryExpression',
        operator: '^',
        left: { type: 'numberLiteral', value: 2 },
        right: {
          type: 'unaryExpression',
          operator: '-',
          operand: { type: 'numberLiteral', value: 2 },
        },
      });
    });

    it('parses stacked unary operators', () => {
      expect(parseOk('--1')).to.deep.equal({
        type: 'unaryExpression',
        operator: '-',
        operand: {
          type: 'unaryExpression',
          operator: '-',
          operand: { type: 'numberLiteral', value: 1 },
        },
      });
    });

    it('honors parentheses', () => {
      expect(parseOk('(1 + 2) * 3')).to.deep.equal({
        type: 'binaryExpression',
        operator: '*',
        left: {
          type: 'binaryExpression',
          operator: '+',
          left: { type: 'numberLiteral', value: 1 },
          right: { type: 'numberLiteral', value: 2 },
        },
        right: { type: 'numberLiteral', value: 3 },
      });
    });
  });

  describe('function calls', () => {
    it('normalizes function names to uppercase', () => {
      expect(parseOk('sum(price, 1)')).to.deep.equal({
        type: 'functionCall',
        name: 'SUM',
        args: [
          { type: 'fieldRef', field: 'price' },
          { type: 'numberLiteral', value: 1 },
        ],
      });
    });

    it('parses a call with no arguments', () => {
      expect(parseOk('FOO()')).to.deep.equal({ type: 'functionCall', name: 'FOO', args: [] });
    });

    it('parses nested calls', () => {
      expect(parseOk('IF(a > 1, SUM(b, c), 0)')).to.deep.equal({
        type: 'functionCall',
        name: 'IF',
        args: [
          {
            type: 'binaryExpression',
            operator: '>',
            left: { type: 'fieldRef', field: 'a' },
            right: { type: 'numberLiteral', value: 1 },
          },
          {
            type: 'functionCall',
            name: 'SUM',
            args: [
              { type: 'fieldRef', field: 'b' },
              { type: 'fieldRef', field: 'c' },
            ],
          },
          { type: 'numberLiteral', value: 0 },
        ],
      });
    });

    it('rejects TRUE/FALSE used as functions', () => {
      expect(parseError('TRUE(1)')).to.equal('"TRUE" is not a function.');
    });
  });

  describe('special forms', () => {
    it('parses REF with stable selectors', () => {
      expect(parseOk('REF(COLUMN("total"), ROW("order-1"))')).to.deep.equal({
        type: 'cellRef',
        column: { kind: 'field', field: 'total' },
        row: { kind: 'id', id: 'order-1' },
      });
    });

    it('parses REF with a negative numeric row id', () => {
      expect(parseOk('REF(COLUMN("total"), ROW(-1))')).to.deep.equal({
        type: 'cellRef',
        column: { kind: 'field', field: 'total' },
        row: { kind: 'id', id: -1 },
      });
    });

    it('rejects a sign before a string row id', () => {
      expect(parseError('REF(COLUMN("a"), ROW(-"x"))')).to.equal(
        'ROW() expects a row id as a string or number literal.',
      );
      expect(parseError('REF(COLUMN("a"), ROW(-))')).to.equal(
        'ROW() expects a row id as a string or number literal.',
      );
    });

    it('rejects a non-finite numeric row id', () => {
      expect(parseError('REF(COLUMN("a"), ROW(1e999))')).to.equal(
        'ROW() expects a finite number literal.',
      );
    });

    it('parses REF with a numeric row id', () => {
      expect(parseOk('REF(COLUMN("total"), ROW(42))')).to.deep.equal({
        type: 'cellRef',
        column: { kind: 'field', field: 'total' },
        row: { kind: 'id', id: 42 },
      });
    });

    it('parses mixed-axis positional selectors', () => {
      expect(parseOk('REF(COLUMN("total"), ROW_POSITION(1))')).to.deep.equal({
        type: 'cellRef',
        column: { kind: 'field', field: 'total' },
        row: { kind: 'position', index: 1 },
      });
      expect(parseOk('REF(COLUMN_POSITION(2), ROW("a"))')).to.deep.equal({
        type: 'cellRef',
        column: { kind: 'position', index: 2 },
        row: { kind: 'id', id: 'a' },
      });
    });

    it('is case-insensitive for special form names', () => {
      expect(parseOk('ref(column("a"), row("b"))')).to.deep.equal({
        type: 'cellRef',
        column: { kind: 'field', field: 'a' },
        row: { kind: 'id', id: 'b' },
      });
    });

    it('parses RANGE_REF as a positional window', () => {
      expect(
        parseOk('RANGE_REF(COLUMN_FROM(1), ROW_FROM(1), COLUMN_TO(2), ROW_TO(5))'),
      ).to.deep.equal({
        type: 'rangeRef',
        columnFrom: { kind: 'position', index: 1, fixed: false },
        rowFrom: { kind: 'position', index: 1, fixed: false },
        columnTo: { kind: 'position', index: 2, fixed: false },
        rowTo: { kind: 'position', index: 5, fixed: false },
      });
    });

    it('parses a FIXED() wrapper on any RANGE_REF axis', () => {
      expect(
        parseOk('RANGE_REF(FIXED(COLUMN_FROM(1)), ROW_FROM(2), COLUMN_TO(3), FIXED(ROW_TO(4)))'),
      ).to.deep.equal({
        type: 'rangeRef',
        columnFrom: { kind: 'position', index: 1, fixed: true },
        rowFrom: { kind: 'position', index: 2, fixed: false },
        columnTo: { kind: 'position', index: 3, fixed: false },
        rowTo: { kind: 'position', index: 4, fixed: true },
      });
      expect(
        parseOk(
          'RANGE_REF(FIXED(COLUMN_FROM(1)), FIXED(ROW_FROM(1)), FIXED(COLUMN_TO(1)), FIXED(ROW_TO(4)))',
        ),
      ).to.deep.equal({
        type: 'rangeRef',
        columnFrom: { kind: 'position', index: 1, fixed: true },
        rowFrom: { kind: 'position', index: 1, fixed: true },
        columnTo: { kind: 'position', index: 1, fixed: true },
        rowTo: { kind: 'position', index: 4, fixed: true },
      });
    });

    it('is case-insensitive for RANGE_REF and its axis labels', () => {
      expect(
        parseOk('range_ref(column_from(1), row_from(2), fixed(column_to(3)), row_to(4))'),
      ).to.deep.equal({
        type: 'rangeRef',
        columnFrom: { kind: 'position', index: 1, fixed: false },
        rowFrom: { kind: 'position', index: 2, fixed: false },
        columnTo: { kind: 'position', index: 3, fixed: true },
        rowTo: { kind: 'position', index: 4, fixed: false },
      });
    });

    it('validates the label of every RANGE_REF axis slot', () => {
      // Wrong label in a slot.
      expect(parseError('RANGE_REF(ROW_FROM(1), ROW_FROM(1), COLUMN_TO(2), ROW_TO(3))')).to.equal(
        'Expected COLUMN_FROM(index), COLUMN_FROM(ANCHOR(delta)) or FIXED(COLUMN_FROM(index)).',
      );
      expect(
        parseError('RANGE_REF(COLUMN_FROM(1), COLUMN_TO(1), COLUMN_TO(2), ROW_TO(3))'),
      ).to.equal('Expected ROW_FROM(index), ROW_FROM(ANCHOR(delta)) or FIXED(ROW_FROM(index)).');
      expect(parseError('RANGE_REF(COLUMN_FROM(1), ROW_FROM(1), ROW_TO(2), ROW_TO(3))')).to.equal(
        'Expected COLUMN_TO(index), COLUMN_TO(ANCHOR(delta)) or FIXED(COLUMN_TO(index)).',
      );
      expect(
        parseError('RANGE_REF(COLUMN_FROM(1), ROW_FROM(1), COLUMN_TO(2), COLUMN_TO(3))'),
      ).to.equal('Expected ROW_TO(index), ROW_TO(ANCHOR(delta)) or FIXED(ROW_TO(index)).');
      // A missing trailing slot is reported at the separator that must precede it.
      expect(parseError('RANGE_REF(COLUMN_FROM(1), ROW_FROM(1), COLUMN_TO(2))')).to.equal(
        'Expected ",".',
      );
      // An empty slot reports the expectation for that slot.
      expect(parseError('RANGE_REF(COLUMN_FROM(1), ROW_FROM(1), COLUMN_TO(2), )')).to.equal(
        'Expected ROW_TO(index), ROW_TO(ANCHOR(delta)) or FIXED(ROW_TO(index)).',
      );
      // The label is also validated inside a FIXED() wrapper.
      expect(
        parseError('RANGE_REF(FIXED(ROW_FROM(1)), ROW_FROM(1), COLUMN_TO(2), ROW_TO(3))'),
      ).to.equal(
        'Expected COLUMN_FROM(index), COLUMN_FROM(ANCHOR(delta)) or FIXED(COLUMN_FROM(index)).',
      );
    });

    it('validates RANGE_REF position literals', () => {
      expect(
        parseError('RANGE_REF(COLUMN_FROM("a"), ROW_FROM(1), COLUMN_TO(2), ROW_TO(3))'),
      ).to.equal('COLUMN_FROM() expects a number literal.');
      expect(
        parseError('RANGE_REF(COLUMN_FROM(1), ROW_FROM(0), COLUMN_TO(2), ROW_TO(3))'),
      ).to.equal('ROW_FROM() expects a positive integer (1-based position).');
      expect(
        parseError('RANGE_REF(COLUMN_FROM(1), ROW_FROM(1), COLUMN_TO(1.5), ROW_TO(3))'),
      ).to.equal('COLUMN_TO() expects a positive integer (1-based position).');
      expect(
        parseError('RANGE_REF(COLUMN_FROM(1), ROW_FROM(1), COLUMN_TO(2), ROW_TO(-3))'),
      ).to.equal('ROW_TO() expects a number literal.');
    });

    it('parses ANCHOR axes with signed and zero deltas', () => {
      expect(
        parseOk(
          'RANGE_REF(COLUMN_FROM(ANCHOR(-2)), ROW_FROM(ANCHOR(0)), COLUMN_TO(ANCHOR(-2)), ROW_TO(ANCHOR(3)))',
        ),
      ).to.deep.equal({
        type: 'rangeRef',
        columnFrom: { kind: 'anchor', delta: -2 },
        rowFrom: { kind: 'anchor', delta: 0 },
        columnTo: { kind: 'anchor', delta: -2 },
        rowTo: { kind: 'anchor', delta: 3 },
      });
    });

    it('parses mixed ANCHOR, positional and FIXED axes in one window', () => {
      expect(
        parseOk(
          'RANGE_REF(FIXED(COLUMN_FROM(1)), FIXED(ROW_FROM(1)), COLUMN_TO(2), ROW_TO(ANCHOR(0)))',
        ),
      ).to.deep.equal({
        type: 'rangeRef',
        columnFrom: { kind: 'position', index: 1, fixed: true },
        rowFrom: { kind: 'position', index: 1, fixed: true },
        columnTo: { kind: 'position', index: 2, fixed: false },
        rowTo: { kind: 'anchor', delta: 0 },
      });
    });

    it('is case-insensitive for ANCHOR', () => {
      expect(
        parseOk('range_ref(column_from(anchor(-1)), row_from(1), column_to(1), row_to(1))'),
      ).to.deep.equal({
        type: 'rangeRef',
        columnFrom: { kind: 'anchor', delta: -1 },
        rowFrom: { kind: 'position', index: 1, fixed: false },
        columnTo: { kind: 'position', index: 1, fixed: false },
        rowTo: { kind: 'position', index: 1, fixed: false },
      });
    });

    it('rejects FIXED() around an ANCHOR axis', () => {
      expect(
        parseError(
          'RANGE_REF(FIXED(COLUMN_FROM(ANCHOR(1))), ROW_FROM(1), COLUMN_TO(2), ROW_TO(3))',
        ),
      ).to.equal(
        'FIXED() cannot contain ANCHOR(): an anchor-relative axis always moves with the formula.',
      );
    });

    it('rejects non-integer ANCHOR deltas', () => {
      expect(
        parseError('RANGE_REF(COLUMN_FROM(ANCHOR(1.5)), ROW_FROM(1), COLUMN_TO(2), ROW_TO(3))'),
      ).to.equal('ANCHOR() expects an integer offset.');
      expect(
        parseError('RANGE_REF(COLUMN_FROM(ANCHOR("a")), ROW_FROM(1), COLUMN_TO(2), ROW_TO(3))'),
      ).to.equal('ANCHOR() expects an integer offset.');
    });

    it('rejects ANCHOR outside RANGE_REF', () => {
      expect(parseError('ANCHOR(1)')).to.equal('"ANCHOR" can only be used inside RANGE_REF().');
    });

    it('parses COLUMN_VALUES', () => {
      expect(parseOk('SUM(COLUMN_VALUES("price"))')).to.deep.equal({
        type: 'functionCall',
        name: 'SUM',
        args: [{ type: 'columnValues', field: 'price' }],
      });
    });

    it('enforces literal-only arguments (computed refs are parse errors)', () => {
      expect(parseError('REF(COLUMN(price & "x"), ROW("a"))')).to.equal(
        'COLUMN() expects a string literal.',
      );
      expect(parseError('REF(COLUMN("a"), ROW_POSITION("x"))')).to.equal(
        'ROW_POSITION() expects a number literal.',
      );
      // A computed position is consumed up to the literal, then rejected.
      expect(parseError('REF(COLUMN("a"), ROW_POSITION(1 + 1))')).to.equal('Expected ")".');
    });

    it('rejects non-positive or fractional positions', () => {
      expect(parseError('REF(COLUMN("a"), ROW_POSITION(0))')).to.equal(
        'ROW_POSITION() expects a positive integer (1-based position).',
      );
      expect(parseError('REF(COLUMN_POSITION(1.5), ROW("a"))')).to.equal(
        'COLUMN_POSITION() expects a positive integer (1-based position).',
      );
    });

    it('rejects selector forms at expression level', () => {
      expect(parseError('COLUMN("a")')).to.equal('"COLUMN" can only be used inside REF().');
      expect(parseError('ROW("a")')).to.equal('"ROW" can only be used inside REF().');
      expect(parseError('COLUMN_POSITION(1)')).to.equal(
        '"COLUMN_POSITION" can only be used inside REF().',
      );
      expect(parseError('ROW_POSITION(1)')).to.equal(
        '"ROW_POSITION" can only be used inside REF().',
      );
    });

    it('rejects RANGE_REF axis forms at expression level', () => {
      expect(parseError('COLUMN_FROM(1)')).to.equal(
        '"COLUMN_FROM" can only be used inside RANGE_REF().',
      );
      expect(parseError('ROW_FROM(1)')).to.equal('"ROW_FROM" can only be used inside RANGE_REF().');
      expect(parseError('COLUMN_TO(1)')).to.equal(
        '"COLUMN_TO" can only be used inside RANGE_REF().',
      );
      expect(parseError('ROW_TO(1)')).to.equal('"ROW_TO" can only be used inside RANGE_REF().');
      expect(parseError('FIXED(COLUMN_FROM(1))')).to.equal(
        '"FIXED" can only be used inside RANGE_REF().',
      );
    });

    it('parses the removed RANGE() grammar as an ordinary function call', () => {
      // `RANGE` is no longer reserved: the name resolves (and fails) at
      // validation/evaluation time as an unknown function, not at parse time.
      expect(parseOk('RANGE(1, 2)')).to.deep.equal({
        type: 'functionCall',
        name: 'RANGE',
        args: [
          { type: 'numberLiteral', value: 1 },
          { type: 'numberLiteral', value: 2 },
        ],
      });
      expect(parseOk('range')).to.deep.equal({ type: 'fieldRef', field: 'range' });
    });

    it('treats reserved names without parentheses as field refs', () => {
      expect(parseOk('REF')).to.deep.equal({ type: 'fieldRef', field: 'REF' });
    });
  });

  describe('errors', () => {
    it('rejects an empty formula', () => {
      expect(parseError('')).to.equal('The formula is empty.');
      expect(parseError('  ')).to.equal('The formula is empty.');
    });

    it('rejects trailing tokens', () => {
      expect(parseError('1 2')).to.equal('Unexpected "2" after the expression.');
    });

    it('rejects an incomplete expression', () => {
      expect(parseError('1 +')).to.equal('Unexpected end of formula.');
    });

    it('rejects an unclosed parenthesis', () => {
      expect(parseError('(1 + 2')).to.equal('Expected ")".');
    });

    it('rejects a missing function argument', () => {
      expect(parseError('SUM(1,)')).to.equal('Unexpected ")".');
    });

    it('surfaces tokenizer errors', () => {
      expect(parseError('1 + @')).to.equal('Unexpected character "@".');
    });

    it('rejects out-of-range number literals', () => {
      expect(parseError('1e999')).to.equal('The number literal is out of range.');
      expect(parseError(`${'9'.repeat(400)}`)).to.equal('The number literal is out of range.');
    });

    it('keeps boundary number literals', () => {
      expect(parseOk('1e308')).to.deep.equal({ type: 'numberLiteral', value: 1e308 });
    });

    it('rejects deeply nested formulas instead of overflowing the stack', () => {
      const nested = `${'('.repeat(4000)}1${')'.repeat(4000)}`;
      expect(parseError(nested)).to.equal('The formula is too deeply nested.');
    });

    it('rejects overly long operator chains instead of overflowing the evaluator', () => {
      // Parses iteratively, but the resulting left-deep AST would overflow
      // the recursive evaluator/serializer — rejected via the height bound.
      const chain = `1${' + 1'.repeat(4000)}`;
      expect(parseError(chain)).to.equal('The formula is too complex.');
    });

    it('accepts moderately deep formulas', () => {
      const nested = `${'('.repeat(100)}1${')'.repeat(100)}`;
      expect(parseOk(nested)).to.deep.equal({ type: 'numberLiteral', value: 1 });
      const chain = `1${' + 1'.repeat(100)}`;
      const { ast, error } = parseFormula(chain);
      expect(error).to.equal(null);
      expect(ast).not.to.equal(null);
    });

    it('reports the failing span', () => {
      const { error } = parseFormula('1 ~ 2');
      expect(error?.span).to.deep.equal({ start: 2, end: 3 });
    });
  });

  describe('spans', () => {
    it('covers the full expression on the root node', () => {
      const { ast } = parseFormula('1 + price');
      expect(ast?.span).to.deep.equal({ start: 0, end: 9 });
    });

    it('covers function calls including the closing parenthesis', () => {
      const { ast } = parseFormula('SUM(a, b)');
      expect(ast?.span).to.deep.equal({ start: 0, end: 9 });
    });

    it('includes the parentheses in a parenthesized expression span', () => {
      expect(parseFormula('(1 + 2) * 3').ast?.span).to.deep.equal({ start: 0, end: 11 });
      expect(parseFormula('(price)').ast?.span).to.deep.equal({ start: 0, end: 7 });
    });
  });

  describe('createFormulaParser (AST interning)', () => {
    it('returns the identical result object for identical source', () => {
      const parser = createFormulaParser();
      const first = parser.parse('price * quantity');
      const second = parser.parse('price * quantity');
      expect(second).to.equal(first);
      expect(second.ast).to.equal(first.ast as FormulaAstNode);
    });

    it('forgets cached results after clear()', () => {
      const parser = createFormulaParser();
      const first = parser.parse('1 + 1');
      parser.clear();
      expect(parser.parse('1 + 1')).not.to.equal(first);
    });
  });
});
