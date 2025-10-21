import { getStyleString, getStringSize, batchMeasureStrings, clearStringMeasurementCache } from './domUtils';
import { isJSDOM } from 'test/utils/skipIf';

describe('domUtils', () => {
  describe('getStyleString', () => {
    it('should convert style object to a string', () => {
      const style = {
        fontSize: 12,
        fontFamily: 'Arial',
        fontLanguageOverride: 'body',
      };

      expect(getStyleString(style)).to.eq(
        'font-size:12px;font-family:Arial;font-language-override:body;',
      );
    });
  });

  describe('getStringSize', () => {
    beforeEach(() => {
      clearStringMeasurementCache();
    });

    // Skip measurement tests in jsdom as it doesn't properly support getBoundingClientRect for SVG
    it.skipIf(isJSDOM)('should measure text width and height', () => {
      const size = getStringSize('Hello World', { fontSize: 16, fontFamily: 'Arial' });
      
      expect(size.width).to.be.greaterThan(0);
      expect(size.height).to.be.greaterThan(0);
    });

    it('should return zero dimensions for null text', () => {
      const size = getStringSize(null as any);
      
      expect(size.width).to.equal(0);
      expect(size.height).to.equal(0);
    });

    it('should return zero dimensions for undefined text', () => {
      const size = getStringSize(undefined as any);
      
      expect(size.width).to.equal(0);
      expect(size.height).to.equal(0);
    });

    it.skipIf(isJSDOM)('should cache results', () => {
      const size1 = getStringSize('Test', { fontSize: 14 });
      const size2 = getStringSize('Test', { fontSize: 14 });
      
      // Should return the same cached object
      expect(size1).to.deep.equal(size2);
    });

    it.skipIf(isJSDOM)('should handle letterSpacing style', () => {
      const sizeWithoutSpacing = getStringSize('Test', { fontSize: 16 });
      const sizeWithSpacing = getStringSize('TestSpaced', { fontSize: 16, letterSpacing: 5 });
      
      expect(sizeWithoutSpacing.width).to.be.greaterThan(0);
      expect(sizeWithSpacing.width).to.be.greaterThan(0);
    });

    it.skipIf(isJSDOM)('should convert number text to string', () => {
      const size = getStringSize(123, { fontSize: 16 });
      
      expect(size.width).to.be.greaterThan(0);
      expect(size.height).to.be.greaterThan(0);
    });
  });

  describe('batchMeasureStrings', () => {
    beforeEach(() => {
      clearStringMeasurementCache();
    });

    it.skipIf(isJSDOM)('should measure multiple strings', () => {
      const texts = ['Apple', 'Banana', 'Cherry'];
      const sizeMap = batchMeasureStrings(texts, { fontSize: 14 });
      
      expect(sizeMap.size).to.equal(3);
      expect(sizeMap.get('Apple')?.width).to.be.greaterThan(0);
      expect(sizeMap.get('Banana')?.width).to.be.greaterThan(0);
      expect(sizeMap.get('Cherry')?.width).to.be.greaterThan(0);
    });

    it.skipIf(isJSDOM)('should use cached values when available', () => {
      // Pre-populate cache
      getStringSize('Cached', { fontSize: 14 });
      
      const texts = ['Cached', 'New'];
      const sizeMap = batchMeasureStrings(texts, { fontSize: 14 });
      
      expect(sizeMap.size).to.equal(2);
      expect(sizeMap.get('Cached')?.width).to.be.greaterThan(0);
      expect(sizeMap.get('New')?.width).to.be.greaterThan(0);
    });

    it('should handle empty iterable', () => {
      const sizeMap = batchMeasureStrings([], { fontSize: 14 });
      
      expect(sizeMap.size).to.equal(0);
    });

    it.skipIf(isJSDOM)('should handle numbers in the iterable', () => {
      const texts = [1, 2, 3];
      const sizeMap = batchMeasureStrings(texts, { fontSize: 14 });
      
      expect(sizeMap.size).to.equal(3);
      expect(sizeMap.get(1)?.width).to.be.greaterThan(0);
    });
  });

  describe('clearStringMeasurementCache', () => {
    it.skipIf(isJSDOM)('should clear the cache', () => {
      // Pre-populate cache
      getStringSize('Test', { fontSize: 14 });
      
      clearStringMeasurementCache();
      
      // After clearing, measuring the same text should work
      const size = getStringSize('Test', { fontSize: 14 });
      expect(size.width).to.be.greaterThan(0);
    });
  });
});
