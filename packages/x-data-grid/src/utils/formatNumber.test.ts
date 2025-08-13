import { formatNumber } from './getGridLocalization';

describe('formatNumber', () => {
  it('should format numbers with thousands separators', () => {
    expect(formatNumber(1000)).to.equal('1,000');
    expect(formatNumber(10000)).to.equal('10,000');
    expect(formatNumber(1000000)).to.equal('1,000,000');
  });

  it('should handle string numbers', () => {
    expect(formatNumber('1000')).to.equal('1,000');
    expect(formatNumber('10000')).to.equal('10,000');
  });

  it('should return original value for non-numeric strings', () => {
    expect(formatNumber('invalid')).to.equal('invalid');
    expect(formatNumber('abc123')).to.equal('abc123');
  });

  it('should handle edge cases', () => {
    expect(formatNumber(0)).to.equal('0');
    expect(formatNumber(-1000)).to.equal('-1,000');
    expect(formatNumber(NaN)).to.equal('NaN');
    expect(formatNumber(Infinity)).to.equal('Infinity');
    expect(formatNumber(-Infinity)).to.equal('-Infinity');
  });

  it('should handle decimal numbers', () => {
    expect(formatNumber(1234.56)).to.equal('1,234.56');
    expect(formatNumber(1000.999)).to.equal('1,000.999');
  });

  it('should handle very large numbers', () => {
    expect(formatNumber(1e15)).to.equal('1,000,000,000,000,000');
    expect(formatNumber(999999999999999)).to.equal('1,000,000,000,000,000'); // Note: JS precision limit
  });

  describe('when Intl is not available', () => {
    let originalIntl: typeof Intl;

    beforeEach(() => {
      originalIntl = globalThis.Intl;
      // @ts-ignore
      delete globalThis.Intl;
    });

    afterEach(() => {
      globalThis.Intl = originalIntl;
    });

    it('should fallback to string representation', () => {
      expect(formatNumber(1000)).to.equal('1000');
      expect(formatNumber(10000)).to.equal('10000');
    });
  });

  describe('when Intl.NumberFormat throws', () => {
    let originalNumberFormat: typeof Intl.NumberFormat;

    beforeEach(() => {
      originalNumberFormat = Intl.NumberFormat;
      // @ts-ignore
      Intl.NumberFormat = () => {
        throw new Error('NumberFormat error');
      };
    });

    afterEach(() => {
      Intl.NumberFormat = originalNumberFormat;
    });

    it('should fallback to string representation', () => {
      expect(formatNumber(1000)).to.equal('1000');
      expect(formatNumber(10000)).to.equal('10000');
    });
  });
});
