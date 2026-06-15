import { describe, expect, it } from 'vitest';
import {
  getFormulaCompletionContext,
  getFormulaCompletionTokens,
  rankFormulaCompletions,
  type FormulaCompletionToken,
} from './formulaCompletion';
import { createFormulaFunctionRegistry, FORMULA_BUILT_IN_FUNCTIONS } from './formulaFunctions';

describe('getFormulaCompletionTokens', () => {
  it('includes the built-in functions with metadata', () => {
    const tokens = getFormulaCompletionTokens();
    const sum = tokens.find((token) => token.label === 'SUM');
    expect(sum).toMatchObject({
      kind: 'function',
      callable: true,
      category: 'Math',
      signature: 'SUM(value1, value2, …)',
    });
    expect(sum!.description).toBeTruthy();
  });

  it('includes every built-in function', () => {
    const tokens = getFormulaCompletionTokens();
    const functionLabels = new Set(
      tokens.filter((token) => token.kind === 'function').map((token) => token.label),
    );
    for (const definition of FORMULA_BUILT_IN_FUNCTIONS) {
      expect(functionLabels.has(definition.name)).toEqual(true);
    }
  });

  it('includes the special forms as callable references', () => {
    const tokens = getFormulaCompletionTokens();
    const ref = tokens.find((token) => token.label === 'REF');
    expect(ref).toMatchObject({
      kind: 'specialForm',
      callable: true,
      signature: 'REF(column, row)',
    });
    const columnValues = tokens.find((token) => token.label === 'COLUMN_VALUES');
    expect(columnValues?.kind).toEqual('specialForm');
  });

  it('includes the boolean constants (not callable) and operators', () => {
    const tokens = getFormulaCompletionTokens();
    const trueToken = tokens.find((token) => token.label === 'TRUE');
    expect(trueToken?.kind).toEqual('constant');
    expect(trueToken?.callable).toBeUndefined();
    const operators = tokens
      .filter((token) => token.kind === 'operator')
      .map((token) => token.label);
    expect(operators).toEqual(
      expect.arrayContaining(['+', '-', '*', '/', '^', '&', '=', '<', '<=', '<>']),
    );
  });

  it('surfaces custom functions and their user-supplied metadata', () => {
    const registry = createFormulaFunctionRegistry([
      ...FORMULA_BUILT_IN_FUNCTIONS,
      {
        name: 'TAX',
        minArgs: 1,
        maxArgs: 1,
        signature: 'TAX(amount)',
        description: 'Applies the configured tax rate.',
        category: 'Custom',
        apply: () => 0,
      },
    ]);
    const tokens = getFormulaCompletionTokens(registry);
    expect(tokens.find((token) => token.label === 'TAX')).toMatchObject({
      kind: 'function',
      signature: 'TAX(amount)',
      description: 'Applies the configured tax rate.',
      category: 'Custom',
    });
  });

  it('derives a generic signature for a custom function without one', () => {
    const registry = createFormulaFunctionRegistry([
      { name: 'DOUBLE', minArgs: 1, maxArgs: 1, apply: () => 0 },
      { name: 'BETWEEN', minArgs: 2, maxArgs: 3, apply: () => 0 },
      { name: 'JOIN', minArgs: 1, maxArgs: null, apply: () => 0 },
    ]);
    const tokens = getFormulaCompletionTokens(registry);
    expect(tokens.find((token) => token.label === 'DOUBLE')?.signature).toEqual('DOUBLE(value)');
    expect(tokens.find((token) => token.label === 'BETWEEN')?.signature).toEqual(
      'BETWEEN(value1, value2, [value3])',
    );
    expect(tokens.find((token) => token.label === 'JOIN')?.signature).toEqual(
      'JOIN(value1, value2, …)',
    );
  });
});

describe('getFormulaCompletionContext', () => {
  it('extracts the partial token and replace span at the caret', () => {
    // expression: "SU" with caret at the end
    const context = getFormulaCompletionContext('SU', 2);
    expect(context.token).toEqual('SU');
    expect(context.replaceStart).toEqual(0);
    expect(context.replaceEnd).toEqual(2);
    expect(context.expectValue).toEqual(true);
    expect(context.expectOperator).toEqual(false);
  });

  it('replaces the whole identifier even when the caret is mid-token', () => {
    // "price" with caret after "pri"
    const context = getFormulaCompletionContext('price', 3);
    expect(context.token).toEqual('pri');
    expect(context.replaceStart).toEqual(0);
    expect(context.replaceEnd).toEqual(5);
  });

  it('reports a value position after an opening parenthesis', () => {
    const context = getFormulaCompletionContext('SUM(', 4);
    expect(context.token).toEqual('');
    expect(context.expectValue).toEqual(true);
    expect(context.expectOperator).toEqual(false);
    expect(context.functionContext).toEqual({ name: 'SUM', argIndex: 0 });
  });

  it('reports an operator position after a complete operand', () => {
    const context = getFormulaCompletionContext('price ', 6);
    expect(context.token).toEqual('');
    expect(context.expectOperator).toEqual(true);
    expect(context.expectValue).toEqual(false);
  });

  it('reports a value position after a binary operator', () => {
    const context = getFormulaCompletionContext('price + ', 8);
    expect(context.expectValue).toEqual(true);
    expect(context.expectOperator).toEqual(false);
  });

  it('counts the argument index from commas at the call depth', () => {
    const context = getFormulaCompletionContext('IF(a > 1, ', 10);
    expect(context.functionContext).toEqual({ name: 'IF', argIndex: 1 });
  });

  it('returns the innermost named call for nested calls', () => {
    // SUM(ROUND(pr|
    const expression = 'SUM(ROUND(pr';
    const context = getFormulaCompletionContext(expression, expression.length);
    expect(context.functionContext).toEqual({ name: 'ROUND', argIndex: 0 });
    expect(context.token).toEqual('pr');
  });

  it('ignores commas inside a nested grouping for the outer argument index', () => {
    // SUM((1, ... ) — grouping paren is unnamed; the comma belongs to it, not SUM
    const expression = 'SUM((a, ';
    const context = getFormulaCompletionContext(expression, expression.length);
    // Top of stack is the unnamed grouping paren; the nearest named call is SUM at arg 0.
    expect(context.functionContext).toEqual({ name: 'SUM', argIndex: 0 });
  });

  it('detects the caret inside a terminated string literal', () => {
    // FIELD("ab") with caret between the quotes
    const expression = 'FIELD("ab")';
    const context = getFormulaCompletionContext(expression, 8); // inside "ab"
    expect(context.insideString).toEqual(true);
  });

  it('detects the caret inside an unterminated string literal', () => {
    const expression = 'FIELD("ab';
    const context = getFormulaCompletionContext(expression, expression.length);
    expect(context.insideString).toEqual(true);
  });

  it('does not treat the caret right after a closing quote as inside the string', () => {
    const expression = 'FIELD("ab")';
    const context = getFormulaCompletionContext(expression, 10); // right after closing quote
    expect(context.insideString).toEqual(false);
  });

  it('clamps an out-of-range caret', () => {
    expect(() => getFormulaCompletionContext('SUM', 99)).not.toThrow();
    expect(getFormulaCompletionContext('SUM', 99).token).toEqual('SUM');
  });
});

describe('rankFormulaCompletions', () => {
  const tokens = getFormulaCompletionTokens();
  const fieldTokens: FormulaCompletionToken[] = [
    { label: 'price', insertText: 'price', kind: 'field' },
    { label: 'priceTotal', insertText: 'priceTotal', kind: 'field' },
    { label: 'quantity', insertText: 'quantity', kind: 'field' },
  ];
  const all = [...tokens, ...fieldTokens];

  it('ranks prefix matches and tiers fields/functions above special forms', () => {
    const context = getFormulaCompletionContext('SU', 2);
    const ranked = rankFormulaCompletions(all, context);
    expect(ranked[0].label).toEqual('SUM');
  });

  it('places matching fields before functions on equal prefix strength', () => {
    const context = getFormulaCompletionContext('pri', 3);
    const ranked = rankFormulaCompletions(all, context);
    expect(ranked.map((token) => token.label)).toEqual(
      expect.arrayContaining(['price', 'priceTotal']),
    );
    // Fields outrank everything else for the same prefix.
    expect(ranked[0].kind).toEqual('field');
  });

  it('suppresses operators in a value position', () => {
    const context = getFormulaCompletionContext('SUM(', 4);
    const ranked = rankFormulaCompletions(all, context);
    expect(ranked.some((token) => token.kind === 'operator')).toEqual(false);
  });

  it('returns nothing in an operator position with no typed prefix', () => {
    const context = getFormulaCompletionContext('price ', 6);
    expect(rankFormulaCompletions(all, context)).toEqual([]);
  });

  it('returns nothing inside a string literal', () => {
    const context = getFormulaCompletionContext('FIELD("pr', 9);
    expect(rankFormulaCompletions(all, context)).toEqual([]);
  });

  it('offers value tokens with an empty prefix right after a parenthesis', () => {
    const context = getFormulaCompletionContext('SUM(', 4);
    const ranked = rankFormulaCompletions(all, context);
    expect(ranked.length).toBeGreaterThan(0);
    expect(ranked.some((token) => token.kind === 'field')).toEqual(true);
  });

  it('honors the limit option', () => {
    const context = getFormulaCompletionContext('', 0);
    const ranked = rankFormulaCompletions(all, context, { limit: 3 });
    expect(ranked).toHaveLength(3);
  });

  it('is case-insensitive but prefers an exact-case prefix', () => {
    const context = getFormulaCompletionContext('su', 2);
    const ranked = rankFormulaCompletions(all, context);
    // "sum" matches SUM case-insensitively; nothing matches case-sensitively, so SUM still wins.
    expect(ranked[0].label).toEqual('SUM');
  });
});
