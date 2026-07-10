import { scaleBand } from '@mui/x-charts-vendor/d3-scale';
import { getSampledBandHighlight } from './getSampledBandHighlight';

describe('getSampledBandHighlight', () => {
  describe('bucketSize = 1 (no sampling)', () => {
    it('returns single-band width for a string axis', () => {
      const data = ['A', 'B', 'C', 'D'];
      const scale = scaleBand(data, [0, 100]).padding(0.1);
      const step = scale.step();

      const { bandStart, bandSize } = getSampledBandHighlight({
        scale: scale as any,
        value: 'B',
        dataIndex: 1,
        data,
        bucketSize: 1,
      });

      expect(bandSize).toBeCloseTo(step);
      expect(bandStart).toBeCloseTo(scale('B')! - (step - scale.bandwidth()) / 2);
    });
  });

  describe('bucketSize > 1 (sampled)', () => {
    it('widens the highlight to cover the full bucket', () => {
      const data = ['A', 'B', 'C', 'D'];
      const scale = scaleBand(data, [0, 100]).padding(0.1);
      const step = scale.step();

      // bucket 0 = [A, B], hovering B (index 1)
      const { bandStart, bandSize } = getSampledBandHighlight({
        scale: scale as any,
        value: 'B',
        dataIndex: 1,
        data,
        bucketSize: 2,
      });

      expect(bandStart).toBeCloseTo(scale('A')! - (step - scale.bandwidth()) / 2);
      expect(bandSize).toBeCloseTo(2 * step);
    });

    it('clamps the last bucket to the end of data', () => {
      const data = ['A', 'B', 'C'];
      const scale = scaleBand(data, [0, 100]).padding(0.1);
      const step = scale.step();

      // bucketSize 2: bucket 1 = [C] only (odd-length data)
      const { bandStart, bandSize } = getSampledBandHighlight({
        scale: scale as any,
        value: 'C',
        dataIndex: 2,
        data,
        bucketSize: 2,
      });

      expect(bandStart).toBeCloseTo(scale('C')! - (step - scale.bandwidth()) / 2);
      expect(bandSize).toBeCloseTo(step);
    });

    // Regression: Date-keyed axes produced new Date() instances on each pointer event,
    // so reference-equality indexOf always returned -1, collapsing the highlight to
    // a single band instead of the full bucket width.
    it('correctly resolves the bucket for a Date-keyed axis when value is a different reference', () => {
      const dates = [
        new Date('2024-01-01'),
        new Date('2024-02-01'),
        new Date('2024-03-01'),
        new Date('2024-04-01'),
      ];
      const scale = scaleBand(dates, [0, 100]).padding(0.1);
      const step = scale.step();

      // Simulate a new Date instance with the same value (different reference)
      const pointerValue = new Date('2024-02-01');
      expect(dates[1] === pointerValue).toBe(false); // confirm different reference

      const { bandStart, bandSize } = getSampledBandHighlight({
        scale: scale as any,
        value: pointerValue,
        dataIndex: undefined, // no pre-resolved index — forces the fallback path
        data: dates,
        bucketSize: 2,
      });

      // bucket 0 = [Jan, Feb]; highlight should span 2 bands
      expect(bandSize).toBeCloseTo(2 * step);
      expect(bandStart).toBeCloseTo(scale(dates[0])! - (step - scale.bandwidth()) / 2);
    });
  });
});
