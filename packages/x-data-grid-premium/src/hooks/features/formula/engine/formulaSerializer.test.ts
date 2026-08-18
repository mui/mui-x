import { parseFormula } from './formulaParser';
import { serializeFormulaAst } from './formulaSerializer';
import type { FormulaAstNode } from './formulaAst';

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

const expectSerialized = (expression: string, expected: string) => {
  expect(serializeFormulaAst(parseOk(expression))).to.equal(expected);
};

/**
 * parse -> serialize -> parse yields a structurally identical AST.
 */
const expectRoundTrip = (expression: string) => {
  const ast = parseOk(expression);
  const serialized = serializeFormulaAst(ast);
  const reparsed = parseOk(serialized);
  expect(stripSpans(reparsed)).to.deep.equal(stripSpans(ast));
  // Serialization is stable: a second round produces the identical string.
  expect(serializeFormulaAst(reparsed)).to.equal(serialized);
};

describe('formulaSerializer', () => {
  it('serializes literals', () => {
    expectSerialized('1.5', '1.5');
    expectSerialized('"a""b"', '"a""b"');
    expectSerialized('true', 'TRUE');
  });

  it('serializes operators with minimal parentheses', () => {
    expectSerialized('1 + 2 * 3', '1 + 2 * 3');
    expectSerialized('(1 + 2) * 3', '(1 + 2) * 3');
    expectSerialized('1 * 2 + 3', '1 * 2 + 3');
  });

  it('re-derives parentheses for right-nested same-precedence operands', () => {
    expectSerialized('1 - (2 - 3)', '1 - (2 - 3)');
    // Left-nested needs none.
    expectSerialized('1 - 2 - 3', '1 - 2 - 3');
  });

  it('parenthesizes compound unary operands', () => {
    expectSerialized('-(1 + 2)', '-(1 + 2)');
    expectSerialized('-(-1)', '-(-1)');
    expectSerialized('-price', '-price');
  });

  it('preserves the unary-vs-power shape', () => {
    expectSerialized('-2 ^ 2', '-2 ^ 2');
    expectSerialized('2 ^ -2', '2 ^ -2');
  });

  it('serializes field refs bare when possible', () => {
    expectSerialized('price', 'price');
    expectSerialized('FIELD("price")', 'price');
  });

  it('serializes field refs through FIELD() when not bare-safe', () => {
    expectSerialized('FIELD("unit price")', 'FIELD("unit price")');
    expectSerialized('FIELD("TRUE")', 'FIELD("TRUE")');
    expectSerialized('FIELD("a""b")', 'FIELD("a""b")');
  });

  it('serializes special forms canonically', () => {
    expectSerialized(
      'ref(column("total"), row("order-1"))',
      'REF(COLUMN("total"), ROW("order-1"))',
    );
    expectSerialized('REF(COLUMN("a"), ROW(42))', 'REF(COLUMN("a"), ROW(42))');
    expectSerialized('REF(COLUMN("a"), ROW(-1))', 'REF(COLUMN("a"), ROW(-1))');
    expectSerialized(
      'REF(COLUMN_POSITION(2), ROW_POSITION(1))',
      'REF(COLUMN_POSITION(2), ROW_POSITION(1))',
    );
    expectSerialized(
      'range_ref(column_from(1), row_from(1), column_to(2), row_to(3))',
      'RANGE_REF(COLUMN_FROM(1), ROW_FROM(1), COLUMN_TO(2), ROW_TO(3))',
    );
    expectSerialized('COLUMN_VALUES("price")', 'COLUMN_VALUES("price")');
  });

  it('serializes a FIXED() axis back through FIXED()', () => {
    expectSerialized(
      'RANGE_REF(FIXED(COLUMN_FROM(1)), FIXED(ROW_FROM(1)), FIXED(COLUMN_TO(1)), ROW_TO(4))',
      'RANGE_REF(FIXED(COLUMN_FROM(1)), FIXED(ROW_FROM(1)), FIXED(COLUMN_TO(1)), ROW_TO(4))',
    );
    expectSerialized(
      'RANGE_REF(COLUMN_FROM(2), FIXED(ROW_FROM(3)), COLUMN_TO(4), FIXED(ROW_TO(5)))',
      'RANGE_REF(COLUMN_FROM(2), FIXED(ROW_FROM(3)), COLUMN_TO(4), FIXED(ROW_TO(5)))',
    );
  });

  it('serializes ANCHOR axes back through ANCHOR(), signs included', () => {
    expectSerialized(
      'RANGE_REF(COLUMN_FROM(ANCHOR(-2)), ROW_FROM(ANCHOR(0)), COLUMN_TO(ANCHOR(-2)), ROW_TO(ANCHOR(3)))',
      'RANGE_REF(COLUMN_FROM(ANCHOR(-2)), ROW_FROM(ANCHOR(0)), COLUMN_TO(ANCHOR(-2)), ROW_TO(ANCHOR(3)))',
    );
    expectSerialized(
      'range_ref(fixed(column_from(1)), fixed(row_from(1)), column_to(anchor(-1)), row_to(anchor(0)))',
      'RANGE_REF(FIXED(COLUMN_FROM(1)), FIXED(ROW_FROM(1)), COLUMN_TO(ANCHOR(-1)), ROW_TO(ANCHOR(0)))',
    );
  });

  it('serializes function calls with uppercase names and ", " separators', () => {
    expectSerialized('sum(a,b , 1)', 'SUM(a, b, 1)');
    expectSerialized('FOO()', 'FOO()');
  });

  it('round-trips a corpus of expressions', () => {
    const corpus = [
      '1 + 2 * 3 - 4 / 5',
      '-2 ^ 2 ^ 3',
      '(1 + 2) * (3 - 4)',
      '"a" & "b" & price',
      'price * quantity >= 100',
      'IF(price > 100, "high", "low")',
      'IF(AND(a, OR(b, c)), SUM(d, e, 1.5), CONCAT("x", "y"))',
      'FIELD("unit price") * 2',
      'REF(COLUMN("total"), ROW("order-1")) + REF(COLUMN_POSITION(1), ROW_POSITION(2))',
      'REF(COLUMN("a"), ROW(-1))',
      'SUM(RANGE_REF(COLUMN_FROM(1), ROW_FROM(1), COLUMN_TO(2), ROW_TO(5)))',
      'SUM(RANGE_REF(FIXED(COLUMN_FROM(1)), ROW_FROM(2), COLUMN_TO(3), FIXED(ROW_TO(4))))',
      'SUM(RANGE_REF(COLUMN_FROM(ANCHOR(-3)), ROW_FROM(ANCHOR(-4)), COLUMN_TO(ANCHOR(0)), ROW_TO(ANCHOR(-1))))',
      'SUM(COLUMN_VALUES("price"), 1, two, "three")',
      '1e308 * 5e-324',
      'a = b',
      'a <> b',
      '1 - (2 - 3) - 4',
      'NOT(ISBLANK(note))',
    ];
    corpus.forEach(expectRoundTrip);
  });
});
