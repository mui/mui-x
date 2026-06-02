import { lineSampler } from './samplers/lineSampler';
import { scatterSampler } from './samplers/scatterSampler';

const LENGTH = 1000;
const drawingArea = { left: 0, top: 0, width: 200, height: 200, right: 200, bottom: 200 };
const xData = Array.from({ length: LENGTH }, (_, i) => i);

// A scale whose full pixel span equals the drawing area, so the visible fraction is 1 and the
// "show every visible point" shortcut does not trigger — keeping these tests on the LOD path.
const makeScale = (domainMax: number, pixelSpan: number) => {
  const scale = ((value: number) => (value / domainMax) * pixelSpan) as any;
  scale.domain = () => [0, domainMax];
  return scale;
};
const xScale = makeScale(LENGTH - 1, drawingArea.width);
const yScale = makeScale(LENGTH - 1, drawingArea.height);

describe('zoom-level-driven sampling', () => {
  describe('lineSampler', () => {
    const series = {
      sampling: 'lttb',
      data: Array.from({ length: LENGTH }, (_, i) => i),
      visibleStackedData: Array.from({ length: LENGTH }, (_, i) => [0, i] as [number, number]),
    } as any;

    const sampleAtLevel = (zoomLevel: number) =>
      lineSampler(series, { drawingArea, zoomLevel, xScale, yScale, xData, yData: undefined });

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

    it('renders every visible point once few enough remain in view', () => {
      // Zoom so the data spans 40x the drawing area: only ~1/40 (~25 points) is visible, which is
      // below the target, so the sampler defers to rendering everything (clipped by the plot).
      const zoomedScale = makeScale(LENGTH - 1, drawingArea.width * 40);
      const result = lineSampler(series, {
        drawingArea,
        zoomLevel: 0,
        xScale: zoomedScale,
        yScale,
        xData,
        yData: undefined,
      });
      expect(result).to.equal(null);
    });
  });

  describe('scatterSampler', () => {
    // A custom sampler (stride sampling) — also exercises the function-dispatch path.
    const everyNth = ({ length, target }: { length: number; target: number }) => {
      const step = Math.max(1, Math.ceil(length / target));
      const indices: number[] = [];
      for (let i = 0; i < length; i += step) {
        indices.push(i);
      }
      return indices;
    };
    const series = {
      sampling: everyNth,
      data: Array.from({ length: LENGTH }, (_, i) => ({ x: i, y: i, id: i })),
    } as any;

    it('keeps more points as the zoom level increases', () => {
      const level0 = scatterSampler(series, {
        drawingArea,
        zoomLevel: 0,
        xScale,
        yScale,
        xData: undefined,
        yData: undefined,
      })!.length;
      const level2 = scatterSampler(series, {
        drawingArea,
        zoomLevel: 2,
        xScale,
        yScale,
        xData: undefined,
        yData: undefined,
      })!.length;
      expect(level2).to.be.greaterThan(level0);
    });
  });
});
