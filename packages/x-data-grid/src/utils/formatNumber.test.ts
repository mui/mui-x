import { formatNumber } from './getGridLocalization';
import { isJSDOM } from './isJSDOM';

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
  });

  describe('should format numbers according to locale', () => {
    it('en-US (comma separator)', () => {
      expect(formatNumber(1000, 'en-US')).to.equal('1,000');
      expect(formatNumber(1000000, 'en-US')).to.equal('1,000,000');
    });

    it('ar-SD (Arabic-Indic numerals)', () => {
      expect(formatNumber(1000, 'ar-SD')).to.equal('١٬٠٠٠');
    });

    it('ca-ES (dot separator)', () => {
      expect(formatNumber(1000, 'ca-ES')).to.equal('1.000');
    });

    it('cs-CZ (non-breaking space separator)', () => {
      expect(formatNumber(1000, 'cs-CZ')).to.equal('1\u00a0000');
    });

    it('de-DE (dot separator)', () => {
      expect(formatNumber(1000, 'de-DE')).to.equal('1.000');
      expect(formatNumber(1000000, 'de-DE')).to.equal('1.000.000');
    });

    it('es-ES (no separator for thousands)', () => {
      expect(formatNumber(1000, 'es-ES')).to.equal('1000');
    });

    it('fr-FR (narrow no-break space separator)', () => {
      expect(formatNumber(1000, 'fr-FR')).to.equal('1\u202f000');
      expect(formatNumber(1000000, 'fr-FR')).to.equal('1\u202f000\u202f000');
    });

    it('he-IL (comma separator)', () => {
      expect(formatNumber(1000, 'he-IL')).to.equal('1,000');
    });

    it('hr-HR (dot separator)', () => {
      expect(formatNumber(1000, 'hr-HR')).to.equal('1.000');
    });

    it('id-ID (dot separator)', () => {
      expect(formatNumber(1000, 'id-ID')).to.equal('1.000');
    });

    it('it-IT (no separator for thousands)', () => {
      expect(formatNumber(1000, 'it-IT')).to.equal('1000');
    });

    it('ja-JP (comma separator)', () => {
      expect(formatNumber(1000, 'ja-JP')).to.equal('1,000');
    });

    it('ko-KR (comma separator)', () => {
      expect(formatNumber(1000, 'ko-KR')).to.equal('1,000');
    });

    it('nb-NO (non-breaking space separator)', () => {
      expect(formatNumber(1000, 'nb-NO')).to.equal('1\u00a0000');
    });

    // Chromium formats nn-NO with commas instead of non-breaking spaces
    it.skipIf(!isJSDOM)('nn-NO (non-breaking space separator)', () => {
      expect(formatNumber(1000, 'nn-NO')).to.equal('1\u00a0000');
    });

    it('pl-PL (no separator for thousands)', () => {
      expect(formatNumber(1000, 'pl-PL')).to.equal('1000');
    });

    it('pt-BR (dot separator)', () => {
      expect(formatNumber(1000, 'pt-BR')).to.equal('1.000');
    });

    it('pt-PT (no separator for thousands)', () => {
      expect(formatNumber(1000, 'pt-PT')).to.equal('1000');
    });

    it('sk-SK (non-breaking space separator)', () => {
      expect(formatNumber(1000, 'sk-SK')).to.equal('1\u00a0000');
    });

    it('zh-CN (comma separator)', () => {
      expect(formatNumber(1000, 'zh-CN')).to.equal('1,000');
    });

    it('zh-HK (comma separator)', () => {
      expect(formatNumber(1000, 'zh-HK')).to.equal('1,000');
    });

    it('zh-TW (comma separator)', () => {
      expect(formatNumber(1000, 'zh-TW')).to.equal('1,000');
    });
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
