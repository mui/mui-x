import { describe, expect, it } from 'vitest';
import { escapeFormula, toCell, toSafeCell } from './cell';

describe('toCell', () => {
  it('passes through the types exceljs writes natively', () => {
    const date = new Date('2026-01-02T00:00:00Z');

    expect(toCell(42)).to.equal(42);
    expect(toCell(0)).to.equal(0);
    expect(toCell(true)).to.equal(true);
    expect(toCell('France')).to.equal('France');
    expect(toCell(date)).to.equal(date);
  });

  it('maps both empty values to null, so an absent value and an explicit null agree', () => {
    expect(toCell(null)).to.equal(null);
    expect(toCell(undefined)).to.equal(null);
  });

  it('stringifies anything else', () => {
    expect(toCell({ toString: () => 'custom' })).to.equal('custom');
    expect(toCell([1, 2])).to.equal('1,2');
  });
});

describe('escapeFormula', () => {
  it('prefixes text Excel would evaluate', () => {
    expect(escapeFormula('=1+1')).to.equal("'=1+1");
    expect(escapeFormula('+1')).to.equal("'+1");
    expect(escapeFormula('-1')).to.equal("'-1");
    expect(escapeFormula('@SUM')).to.equal("'@SUM");
    expect(escapeFormula('\tvalue')).to.equal("'\tvalue");
    expect(escapeFormula('\rvalue')).to.equal("'\rvalue");
  });

  it('leaves ordinary values alone', () => {
    expect(escapeFormula('France')).to.equal('France');
    expect(escapeFormula('')).to.equal('');
    expect(escapeFormula(42)).to.equal(42);
    expect(escapeFormula(null)).to.equal(null);
  });

  it('does not escape a negative number, only a string that looks like one', () => {
    expect(escapeFormula(-1)).to.equal(-1);
    expect(escapeFormula('-1')).to.equal("'-1");
  });
});

describe('toSafeCell', () => {
  it('escapes only when asked', () => {
    expect(toSafeCell('=1+1', true)).to.equal("'=1+1");
    expect(toSafeCell('=1+1', false)).to.equal('=1+1');
  });
});
