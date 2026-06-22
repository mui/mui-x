import { resolveColorProcessor } from './resolveColorProcessor';
import { getColorScale } from './colorScale';

describe('resolveColorProcessor', () => {
  const series = {
    color: 'seriesColor',
    data: [10, 20, 30],
  } as const;

  describe('color scale priority', () => {
    it('applies the value color scale with priority over the category color scale', () => {
      const getColor = resolveColorProcessor({
        series,
        valueColorScale: (value) => `value-${value}`,
        categoryColorScale: (value) => `category-${value}`,
        categoryValues: ['a', 'b', 'c'],
      });

      expect(getColor(0)).to.equal('value-10');
      expect(getColor(1)).to.equal('value-20');
    });

    it('applies the category color scale when no value color scale is provided', () => {
      const getColor = resolveColorProcessor({
        series,
        categoryColorScale: (value) => `category-${value}`,
        categoryValues: ['a', 'b', 'c'],
      });

      expect(getColor(0)).to.equal('category-a');
      expect(getColor(2)).to.equal('category-c');
    });

    it('applies the series color when no color scale is provided', () => {
      const getColor = resolveColorProcessor({ series });

      expect(getColor(0)).to.equal('seriesColor');
    });

    it('returns the series color when no data index is provided', () => {
      const getColor = resolveColorProcessor({
        series,
        valueColorScale: (value) => `value-${value}`,
      });

      expect(getColor(undefined)).to.equal('seriesColor');
    });
  });

  describe('unknownColor not defined', () => {
    it('falls back on the series color for the value color scale', () => {
      const valueColorScale = getColorScale({
        type: 'ordinal',
        values: [10, 20],
        colors: ['ten', 'twenty'],
      }) as (value: number) => string | null;

      const getColor = resolveColorProcessor({ series, valueColorScale });

      expect(getColor(0)).to.equal('ten');
      // Value 30 (3rd data point) is not part of the scale values and `unknownColor` is not defined.
      expect(getColor(2)).to.equal('seriesColor');
    });

    it('falls back on the series color for the category color scale', () => {
      const categoryColorScale = getColorScale({
        type: 'ordinal',
        values: ['a', 'b'],
        colors: ['colorA', 'colorB'],
      }) as (value: string) => string | null;

      const getColor = resolveColorProcessor({
        series,
        categoryColorScale,
        categoryValues: ['a', 'b', 'c'],
      });

      expect(getColor(0)).to.equal('colorA');
      // 'c' is not part of the scale values and `unknownColor` is not defined.
      expect(getColor(2)).to.equal('seriesColor');
    });
  });

  describe('unknownColor defined', () => {
    it('falls back on the series color for null values of the value color scale', () => {
      const valueColorScale = getColorScale({
        type: 'ordinal',
        values: [10, 20],
        colors: ['ten', 'twenty'],
        unknownColor: 'unknownColor',
      }) as (value: number) => string | null;

      const getColor = resolveColorProcessor({
        series: { color: 'seriesColor', data: [10, null] },
        valueColorScale,
      });

      expect(getColor(0)).to.equal('ten');
      // The data value is null so it falls back to `unknownColor`.
      expect(getColor(1)).to.equal('unknownColor');
    });

    it('falls back on the series color for null values of the category color scale', () => {
      const categoryColorScale = getColorScale({
        type: 'ordinal',
        values: ['a', 'b'],
        colors: ['colorA', 'colorB'],
        unknownColor: 'unknownColor',
      }) as (value: string | null) => string | null;

      const getColor = resolveColorProcessor({
        series: { color: 'seriesColor', data: [10, 20] },
        categoryColorScale,
        categoryValues: ['a', null],
      });

      expect(getColor(0)).to.equal('colorA');
      // The category value is null so it falls back to `unknownColor`.
      expect(getColor(1)).to.equal('unknownColor');
    });
  });
});
