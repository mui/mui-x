import { describe, expect, it } from 'vitest';
import { parseFormula } from './parser';
import type { FormulaNode } from './types';

describe('parseFormula', () => {
  it('parses an integer literal', () => {
    expect(parseFormula('42')).toEqual({ type: 'literal', value: 42 });
  });

  it('parses a decimal literal', () => {
    expect(parseFormula('3.14')).toEqual({ type: 'literal', value: 3.14 });
  });

  it('parses a string literal with double quotes', () => {
    expect(parseFormula('"hello"')).toEqual({ type: 'literal', value: 'hello' });
  });

  it('parses a string literal with single quotes', () => {
    expect(parseFormula("'world'")).toEqual({ type: 'literal', value: 'world' });
  });

  it('parses escaped characters in strings', () => {
    expect(parseFormula('"a\\"b"')).toEqual({ type: 'literal', value: 'a"b' });
  });

  it('parses TRUE/FALSE/NULL as literals', () => {
    expect(parseFormula('TRUE')).toEqual({ type: 'literal', value: true });
    expect(parseFormula('false')).toEqual({ type: 'literal', value: false });
    expect(parseFormula('NULL')).toEqual({ type: 'literal', value: null });
  });

  it('parses bracketed column references with spaces', () => {
    expect(parseFormula('[unit price]')).toEqual({ type: 'column', field: 'unit price' });
  });

  it('parses bare identifier as a column reference', () => {
    expect(parseFormula('revenue')).toEqual({ type: 'column', field: 'revenue' });
  });

  it('honors operator precedence: * binds tighter than +', () => {
    const node = parseFormula('1 + 2 * 3') as Extract<FormulaNode, { type: 'binary' }>;
    expect(node.type).toBe('binary');
    expect(node.op).toBe('+');
    expect((node.right as Extract<FormulaNode, { type: 'binary' }>).op).toBe('*');
  });

  it('honors comparison precedence: comparison binds looser than arithmetic', () => {
    const node = parseFormula('a + 1 > b') as Extract<FormulaNode, { type: 'binary' }>;
    expect(node.op).toBe('>');
    expect((node.left as Extract<FormulaNode, { type: 'binary' }>).op).toBe('+');
  });

  it('parses Excel-style <> as !=', () => {
    const node = parseFormula('a <> b') as Extract<FormulaNode, { type: 'binary' }>;
    expect(node.op).toBe('!=');
  });

  it('parses both = and == as equality', () => {
    const eq1 = parseFormula('a = b') as Extract<FormulaNode, { type: 'binary' }>;
    const eq2 = parseFormula('a == b') as Extract<FormulaNode, { type: 'binary' }>;
    expect(eq1.op).toBe('=');
    expect(eq2.op).toBe('=');
  });

  it('parses unary minus', () => {
    const node = parseFormula('-5') as Extract<FormulaNode, { type: 'unary' }>;
    expect(node.type).toBe('unary');
    expect(node.op).toBe('-');
    expect(node.operand).toEqual({ type: 'literal', value: 5 });
  });

  it('parses a function call with no arguments', () => {
    expect(parseFormula('COUNT()')).toEqual({ type: 'call', name: 'COUNT', args: [] });
  });

  it('parses a function call with a single column argument', () => {
    expect(parseFormula('SUM([revenue])')).toEqual({
      type: 'call',
      name: 'SUM',
      args: [{ type: 'column', field: 'revenue' }],
    });
  });

  it('parses a function call with a binary expression argument', () => {
    const node = parseFormula('SUM([price] * [qty])') as Extract<FormulaNode, { type: 'call' }>;
    expect(node.name).toBe('SUM');
    const inner = node.args[0] as Extract<FormulaNode, { type: 'binary' }>;
    expect(inner.op).toBe('*');
    expect(inner.left).toEqual({ type: 'column', field: 'price' });
    expect(inner.right).toEqual({ type: 'column', field: 'qty' });
  });

  it('parses nested function calls', () => {
    const node = parseFormula('ROUND(SUM([revenue]) / COUNT(), 2)') as Extract<
      FormulaNode,
      { type: 'call' }
    >;
    expect(node.name).toBe('ROUND');
    expect(node.args).toHaveLength(2);
    expect((node.args[0] as Extract<FormulaNode, { type: 'binary' }>).op).toBe('/');
  });

  it('parses parenthesized expressions', () => {
    const node = parseFormula('(1 + 2) * 3') as Extract<FormulaNode, { type: 'binary' }>;
    expect(node.op).toBe('*');
    expect((node.left as Extract<FormulaNode, { type: 'binary' }>).op).toBe('+');
  });

  it('uppercases function names regardless of input case', () => {
    const node = parseFormula('sumif([status] = "paid", [total])') as Extract<
      FormulaNode,
      { type: 'call' }
    >;
    expect(node.name).toBe('SUMIF');
  });

  it('throws on empty input', () => {
    expect(() => parseFormula('')).toThrow(/empty/i);
    expect(() => parseFormula('   ')).toThrow(/empty/i);
  });

  it('throws on unterminated [column]', () => {
    expect(() => parseFormula('SUM([revenue')).toThrow(/Unterminated/);
  });

  it('throws on unterminated string', () => {
    expect(() => parseFormula('"oops')).toThrow(/Unterminated/);
  });

  it('throws on unexpected characters', () => {
    expect(() => parseFormula('1 @ 2')).toThrow(/Unexpected character/);
  });

  it('throws on missing closing paren', () => {
    expect(() => parseFormula('SUM([revenue]')).toThrow(/\)/);
  });

  it('throws on trailing tokens', () => {
    expect(() => parseFormula('1 2')).toThrow(/Unexpected token/);
  });
});
