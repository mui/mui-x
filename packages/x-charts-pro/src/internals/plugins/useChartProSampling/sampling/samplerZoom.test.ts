import { lineSampler } from './samplers/lineSampler';
import { scatterSampler } from './samplers/scatterSampler';

const LENGTH = 1000;
const drawingArea = { left: 0, top: 0, width: 200, height: 200, right: 200, bottom: 200 };
const xData = Array.from({ length: LENGTH }, (_, i) => i);

describe('zoom-level-driven sampling', () => {
  describe('lineSampler', () => {
    const series = {
      sampling: 'lttb',
      data: Array.from({ length: LENGTH }, (_, i) => i),
      visibleStackedData: Array.from({ length: LENGTH }, (_, i) => [0, i] as [number, number]),
    } as any;

    const sampleAtLevel = (zoomLevel: number) =>
      lineSampler(series, { drawingArea, zoomLevel, xData, yData: undefined });

    it('samples the whole series, preserving first and last index', () => {
      const result = sampleAtLevel(0);
      expect(result).not.to.equal(null);
      expect(result![0]).to.equal(0);
      expect(result![result!.length - 1]).to.equal(LENGTH - 1);
    });

    it('keeps more points as the zoom level increases, in discrete steps', () => {
      const level0 = sampleAtLevel(0)!.length;
      const level1 = sampleAtLevel(1)!.length;
      const level3 = sampleAtLevel(3)!.length;
      expect(level1).to.be.greaterThan(level0);
      expect(level3).to.be.greaterThan(level1);
      // The target doubles each level, so level 1 keeps roughly twice as many as level 0.
      expect(level1).to.equal(level0 * 2);
    });

    it('does not depend on a live scale (no flicker source)', () => {
      // Sampling the same series at the same level twice yields identical indices.
      expect(sampleAtLevel(2)).to.deep.equal(sampleAtLevel(2));
    });

    it('stops sampling once the zoom level grows the target past the series length', () => {
      // A high enough level makes the target exceed the series length, so there is nothing to drop
      // and the sampler defers to rendering everything (clipped by the plot).
      expect(sampleAtLevel(20)).to.equal(null);
    });
  });

  describe('scatterSampler', () => {
    // A custom sampler (stride sampling) — also exercises the function-dispatch path.
    const everyNth = ({ length, target }: { length: number; target: number }) => {
      const step = Math.max(1, Math.ceil(length / target));
      const indices = new Set<number>();
      for (let i = 0; i < length; i += step) {
        indices.add(i);
      }
      return [...indices];
    };
    // Scatter targets the 2D cell count, which grows fast with zoom, so use a larger series to keep
    // it from saturating to the full length at the levels under test.
    const SCATTER_LENGTH = 100_000;
    const series = {
      sampling: everyNth,
      data: Array.from({ length: SCATTER_LENGTH }, (_, i) => ({ x: i, y: i, id: i })),
    } as any;

    it('keeps more points as the zoom level increases', () => {
      const level0 = scatterSampler(series, {
        drawingArea,
        zoomLevel: 0,
        xData: undefined,
        yData: undefined,
      })!.length;
      const level2 = scatterSampler(series, {
        drawingArea,
        zoomLevel: 2,
        xData: undefined,
        yData: undefined,
      })!.length;
      expect(level2).to.be.greaterThan(level0);
    });
  });
});
