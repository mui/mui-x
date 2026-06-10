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
});
