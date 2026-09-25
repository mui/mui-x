import { describe, expect, it } from 'vitest';
import { deriveComputedColumnField } from './deriveComputedColumnField';

describe('deriveComputedColumnField', () => {
  it('camelCases the words of the header name', () => {
    expect(deriveComputedColumnField('Total price', [])).to.equal('totalPrice');
    expect(deriveComputedColumnField('TOTAL PRICE (USD)', [])).to.equal('totalPriceUsd');
    expect(deriveComputedColumnField('  net-amount_v2 ', [])).to.equal('netAmountV2');
  });

  it('falls back to "computed" when the name has no letters or digits', () => {
    expect(deriveComputedColumnField('', [])).to.equal('computed');
    expect(deriveComputedColumnField('   ', [])).to.equal('computed');
    expect(deriveComputedColumnField('***', [])).to.equal('computed');
  });

  it('never starts with a digit', () => {
    expect(deriveComputedColumnField('2024 sales', [])).to.equal('_2024Sales');
  });

  it('adds a numeric suffix when the field already exists', () => {
    expect(deriveComputedColumnField('Price', ['price'])).to.equal('price2');
    expect(deriveComputedColumnField('Price', ['price', 'price2'])).to.equal('price3');
    expect(deriveComputedColumnField('', ['computed'])).to.equal('computed2');
  });
});
