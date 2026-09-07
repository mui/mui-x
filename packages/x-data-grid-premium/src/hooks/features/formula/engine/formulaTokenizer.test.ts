import { describe, it, expect } from 'vitest';
import { tokenizeFormula } from './formulaTokenizer';
import type { FormulaToken } from './formulaTokenizer';

const tokenValues = (expression: string): Array<[FormulaToken['type'], string]> => {
  const { tokens, error } = tokenizeFormula(expression);
  expect(error).to.equal(null);
  return tokens.map((token) => [token.type, token.value]);
};

describe('formulaTokenizer', () => {
  it('tokenizes numbers', () => {
    expect(tokenValues('1 1.5 .5 12. 1e3 1.5e-3 2E+10')).to.deep.equal([
      ['number', '1'],
      ['number', '1.5'],
      ['number', '.5'],
      ['number', '12.'],
      ['number', '1e3'],
      ['number', '1.5e-3'],
      ['number', '2E+10'],
    ]);
  });

  it('rejects an exponent without digits', () => {
    const { error } = tokenizeFormula('1e');
    expect(error?.message).to.equal('Invalid number literal.');
  });

  it('tokenizes strings and unescapes ""', () => {
    expect(tokenValues('"hello" "a""b" ""')).to.deep.equal([
      ['string', 'hello'],
      ['string', 'a"b'],
      ['string', ''],
    ]);
  });

  it('rejects an unterminated string', () => {
    const { error } = tokenizeFormula('"abc');
    expect(error?.message).to.equal('Unterminated string literal.');
    expect(error?.span).to.deep.equal({ start: 0, end: 4 });
  });

  it('treats a closing quote followed by an escape pair correctly', () => {
    // `"a""` is an unterminated string: `""` escapes, then EOF.
    const { error } = tokenizeFormula('"a""');
    expect(error?.message).to.equal('Unterminated string literal.');
  });

  it('tokenizes identifiers', () => {
    expect(tokenValues('price _total SUM x1')).to.deep.equal([
      ['identifier', 'price'],
      ['identifier', '_total'],
      ['identifier', 'SUM'],
      ['identifier', 'x1'],
    ]);
  });

  it('tokenizes all operators including multi-character ones', () => {
    expect(tokenValues('+ - * / ^ & = < <= > >= <>')).to.deep.equal([
      ['operator', '+'],
      ['operator', '-'],
      ['operator', '*'],
      ['operator', '/'],
      ['operator', '^'],
      ['operator', '&'],
      ['operator', '='],
      ['operator', '<'],
      ['operator', '<='],
      ['operator', '>'],
      ['operator', '>='],
      ['operator', '<>'],
    ]);
  });

  it('tokenizes multi-character operators without spaces', () => {
    expect(tokenValues('a<=b<>c>=d')).to.deep.equal([
      ['identifier', 'a'],
      ['operator', '<='],
      ['identifier', 'b'],
      ['operator', '<>'],
      ['identifier', 'c'],
      ['operator', '>='],
      ['identifier', 'd'],
    ]);
  });

  it('tokenizes punctuation', () => {
    expect(tokenValues('SUM(a, b)')).to.deep.equal([
      ['identifier', 'SUM'],
      ['punctuation', '('],
      ['identifier', 'a'],
      ['punctuation', ','],
      ['identifier', 'b'],
      ['punctuation', ')'],
    ]);
  });

  it('skips whitespace', () => {
    expect(tokenValues(' 1\t+\n2\r ')).to.deep.equal([
      ['number', '1'],
      ['operator', '+'],
      ['number', '2'],
    ]);
  });

  it('rejects unexpected characters with their position', () => {
    const { error } = tokenizeFormula('1 + @');
    expect(error?.message).to.equal('Unexpected character "@".');
    expect(error?.span).to.deep.equal({ start: 4, end: 5 });
  });

  it('rejects the a1-dialect characters in the canonical dialect', () => {
    expect(tokenizeFormula('a:b').error?.message).to.equal('Unexpected character ":".');
    expect(tokenizeFormula('$a').error?.message).to.equal('Unexpected character "$".');
  });

  it('records spans pointing into the source', () => {
    const { tokens } = tokenizeFormula('ab + 12');
    expect(tokens[0].span).to.deep.equal({ start: 0, end: 2 });
    expect(tokens[1].span).to.deep.equal({ start: 3, end: 4 });
    expect(tokens[2].span).to.deep.equal({ start: 5, end: 7 });
  });

  it('tokenizes an empty expression to no tokens', () => {
    expect(tokenizeFormula('').tokens).to.have.length(0);
    expect(tokenizeFormula('   ').tokens).to.have.length(0);
  });

  it('keeps the tokens produced before an error', () => {
    const { tokens, error } = tokenizeFormula('1 + #');
    expect(error).not.to.equal(null);
    expect(tokens.map((token) => token.value)).to.deep.equal(['1', '+']);
  });

  describe('a1Notation option', () => {
    const a1TokenValues = (expression: string): Array<[FormulaToken['type'], string]> => {
      const { tokens, error } = tokenizeFormula(expression, { a1Notation: true });
      expect(error).to.equal(null);
      return tokens.map((token) => [token.type, token.value]);
    };

    it('reads a cell reference as one token', () => {
      expect(a1TokenValues('B5 + $A$1')).to.deep.equal([
        ['reference', 'B5'],
        ['operator', '+'],
        ['reference', '$A$1'],
      ]);
    });

    it('reads a range as one token, not two references around a colon', () => {
      expect(a1TokenValues('SUM(B5:D5)')).to.deep.equal([
        ['identifier', 'SUM'],
        ['punctuation', '('],
        ['reference', 'B5:D5'],
        ['punctuation', ')'],
      ]);
    });

    it('reads a whole-column range as one token', () => {
      expect(a1TokenValues('SUM(A:A)')).to.deep.equal([
        ['identifier', 'SUM'],
        ['punctuation', '('],
        ['reference', 'A:A'],
        ['punctuation', ')'],
      ]);
    });

    it('keeps a call an identifier, never a reference', () => {
      expect(a1TokenValues('LOG10(2)')).to.deep.equal([
        ['identifier', 'LOG10'],
        ['punctuation', '('],
        ['number', '2'],
        ['punctuation', ')'],
      ]);
    });

    it('emits a dangling range operator as punctuation', () => {
      expect(a1TokenValues('SUM(A1:')).to.deep.equal([
        ['identifier', 'SUM'],
        ['punctuation', '('],
        ['reference', 'A1'],
        ['punctuation', ':'],
      ]);
    });

    it('spans a range across the whitespace around its colon', () => {
      const { tokens } = tokenizeFormula('A1 : B2', { a1Notation: true });
      expect(tokens).to.have.length(1);
      expect(tokens[0].span).to.deep.equal({ start: 0, end: 7 });
    });

    it('leaves the canonical dialect alone', () => {
      const expression =
        'RANGE_REF(COLUMN_FROM(1), ROW_FROM(1), FIXED(COLUMN_TO(2)), ROW_TO(3)) + 2';
      expect(tokenizeFormula(expression, { a1Notation: true })).to.deep.equal(
        tokenizeFormula(expression),
      );
    });
  });

  describe('tolerant option', () => {
    it('turns an unexpected character into an `unknown` token and carries on', () => {
      const { tokens, error } = tokenizeFormula('1 + @ + 2', { tolerant: true });
      expect(error).to.equal(null);
      expect(tokens.map((token) => [token.type, token.value])).to.deep.equal([
        ['number', '1'],
        ['operator', '+'],
        ['unknown', '@'],
        ['operator', '+'],
        ['number', '2'],
      ]);
    });

    it('closes an unterminated string at the end of the input and flags it', () => {
      const { tokens, error } = tokenizeFormula('CONCAT("ab', { tolerant: true });
      expect(error).to.equal(null);
      const string = tokens[tokens.length - 1];
      expect(string.type).to.equal('string');
      expect(string.value).to.equal('ab');
      expect(string.unterminated).to.equal(true);
      expect(string.span).to.deep.equal({ start: 7, end: 10 });
    });

    it('ends a number before an exponent with no digits', () => {
      const { tokens, error } = tokenizeFormula('1e', { tolerant: true });
      expect(error).to.equal(null);
      expect(tokens.map((token) => [token.type, token.value])).to.deep.equal([
        ['number', '1'],
        ['identifier', 'e'],
      ]);
    });

    it('scans the a1 dialect past both of the canonical dialect strangers', () => {
      const { tokens, error } = tokenizeFormula('ROUND(AVERAGE($B5:D5))', {
        a1Notation: true,
        tolerant: true,
      });
      expect(error).to.equal(null);
      expect(tokens.map((token) => [token.type, token.value])).to.deep.equal([
        ['identifier', 'ROUND'],
        ['punctuation', '('],
        ['identifier', 'AVERAGE'],
        ['punctuation', '('],
        ['reference', '$B5:D5'],
        ['punctuation', ')'],
        ['punctuation', ')'],
      ]);
    });

    it('leaves valid input identical to a strict tokenization', () => {
      const expression = 'SUM(1, "a", b) * 2';
      expect(tokenizeFormula(expression, { tolerant: true })).to.deep.equal(
        tokenizeFormula(expression),
      );
    });
  });
});
