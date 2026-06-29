import { getVerticalCenterRatio, translateZoom, zoomAtPoint } from './useZoom.utils';

describe('zoomAtPoint', () => {
  const defaultOptions = {
    axisId: 'x',
    axisDirection: 'x' as const,
    minStart: 0,
    maxEnd: 100,
    minSpan: 10,
    maxSpan: 100,
    step: 5,
    panning: true,
    filterMode: 'keep' as const,
    reverse: false,
    slider: { enabled: false, preview: false, size: 0, showTooltip: 'hover' as const },
  };

  describe('with default minStart/maxEnd (0/100)', () => {
    it('should zoom in around center', () => {
      const [min, max] = zoomAtPoint(0.5, 1.5, { axisId: '1', start: 20, end: 80 }, defaultOptions);
      expect(min).to.be.closeTo(30, 0.01);
      expect(max).to.be.closeTo(70, 0.01);
    });

    it('should clamp to bounds when zooming out past limits', () => {
      const result = zoomAtPoint(0.5, 0.2, { axisId: '1', start: 30, end: 70 }, defaultOptions);
      expect(result).to.deep.equal([0, 100]);
    });
  });

  describe('with custom minStart/maxEnd', () => {
    const customOptions = { ...defaultOptions, minStart: 20, maxEnd: 80 };

    it('should respect custom minStart when zooming out hits lower bound', () => {
      // zoom={40,60}, scaleRatio=0.3, centerRatio=0.8 pushes newMinRange below 20
      const [min, max] = zoomAtPoint(0.8, 0.3, { axisId: '1', start: 40, end: 60 }, customOptions);
      expect(min).to.equal(20);
      expect(max).to.be.closeTo(80, 0.01);
    });

    it('should respect custom maxEnd when zooming out hits upper bound', () => {
      const [min, max] = zoomAtPoint(0.2, 0.3, { axisId: '1', start: 40, end: 60 }, customOptions);
      expect(min).to.be.closeTo(20, 0.01);
      expect(max).to.equal(80);
    });

    it('should clamp to [minStart, maxEnd] when zooming out past both limits', () => {
      const result = zoomAtPoint(0.5, 0.3, { axisId: '1', start: 40, end: 60 }, customOptions);
      expect(result).to.deep.equal([20, 80]);
    });

    it('should not go below custom minStart', () => {
      const [min] = zoomAtPoint(0.5, 0.1, { axisId: '1', start: 40, end: 60 }, customOptions);
      expect(min).to.be.greaterThanOrEqual(20);
    });

    it('should not go above custom maxEnd', () => {
      const [, max] = zoomAtPoint(0.5, 0.1, { axisId: '1', start: 40, end: 60 }, customOptions);
      expect(max).to.be.lessThanOrEqual(80);
    });

    it('should preserve span when zooming in within bounds', () => {
      const [min, max] = zoomAtPoint(0.5, 1.5, { axisId: '1', start: 40, end: 60 }, customOptions);
      // new span = 20 / 1.5 ≈ 13.33
      expect(max - min).to.be.closeTo(13.33, 0.01);
      // center preserved at 50
      expect((min + max) / 2).to.be.closeTo(50, 0.01);
    });
  });
});

describe('translateZoom (Y axis pan)', () => {
  const yOptions = {
    axisId: 'y',
    axisDirection: 'y' as const,
    minStart: 0,
    maxEnd: 100,
    minSpan: 10,
    maxSpan: 100,
    step: 5,
    panning: true,
    filterMode: 'keep' as const,
    reverse: false,
    slider: { enabled: false, preview: false, size: 0, showTooltip: 'hover' as const },
  };
  const drawingArea = { width: 200, height: 200 };

  // `usePanOnDrag` flips screen deltaY before calling `translateZoom`.
  // A user drag *down* therefore arrives here as a NEGATIVE `movement.y`.
  const dragDown = { x: 0, y: -50 };

  it('with reverse=false (cartesian Y), drag down shifts the view toward higher data values', () => {
    const [zoom] = translateZoom([{ axisId: 'y', start: 30, end: 60 }], dragDown, drawingArea, {
      y: yOptions,
    });
    expect(zoom.start).to.be.greaterThan(30);
    expect(zoom.end).to.be.greaterThan(60);
  });

  it('with reverse=true (ordinal Y compensated: data[0] at top), drag down shifts toward data[0]', () => {
    const [zoom] = translateZoom([{ axisId: 'y', start: 30, end: 60 }], dragDown, drawingArea, {
      y: { ...yOptions, reverse: true },
    });
    expect(zoom.start).to.be.lessThan(30);
    expect(zoom.end).to.be.lessThan(60);
  });
});

describe('getVerticalCenterRatio', () => {
  const area = { top: 0, height: 100 };

  it('with reverse=false, returns 1 at the top of the area and 0 at the bottom', () => {
    expect(getVerticalCenterRatio({ x: 0, y: 0 }, area, false)).to.equal(1);
    expect(getVerticalCenterRatio({ x: 0, y: 100 }, area, false)).to.equal(0);
  });

  it('with reverse=true, returns 0 at the top of the area and 1 at the bottom', () => {
    // Heatmap Y axis renders data[0] at top, so wheel-zooming at the top
    // must center the zoom around the start of the domain (ratio 0).
    expect(getVerticalCenterRatio({ x: 0, y: 0 }, area, true)).to.equal(0);
    expect(getVerticalCenterRatio({ x: 0, y: 100 }, area, true)).to.equal(1);
  });
});
