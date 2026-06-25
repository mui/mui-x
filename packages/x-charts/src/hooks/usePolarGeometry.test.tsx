import { renderHook } from '@mui/internal-test-utils';
import * as React from 'react';
import { usePolarGeometry } from './usePolarGeometry';
import { useDrawingArea } from './useDrawingArea';
import { useRotationAxis, useRadiusAxis } from './useAxis';
import { RadarChart } from '../RadarChart';
import { type RadarSeriesType } from '../models';
import type { D3OrdinalScale } from '../models/axis';

const mockSeries: RadarSeriesType[] = [
  {
    type: 'radar',
    id: '1',
    data: [1, 2, 3],
  },
  {
    type: 'radar',
    id: '2',
    data: [4, 5, 6],
  },
];

const metrics = ['A', 'B', 'C'];

const defaultProps = {
  series: mockSeries,
  radar: { metrics },
  height: 400,
  width: 400,
};

function makeWrapper(props: Partial<typeof defaultProps> = {}) {
  return function wrapper({ children }: { children: React.ReactElement }) {
    return (
      <RadarChart {...defaultProps} {...props}>
        {children}
      </RadarChart>
    );
  };
}

const options: any = { wrapper: makeWrapper() };

describe('usePolarGeometry', () => {
  // useDrawingArea() runs before the rotation/radius axis null-check inside
  // the hook, and it throws (via useChartsContext) when there's no
  // ChartsDataProvider/ChartsContainer ancestor at all — so the hook's own
  // `if (!rotationAxis || !radiusAxis) return null` branch is unreachable
  // outside *any* chart context. Confirmed by an actual test run.
  it('should throw when rendered outside of a charts context', () => {
    expect(() => {
      renderHook(() => usePolarGeometry());
    }).to.throw(/Could not find the Charts context/);
  });

  it('should compute the chart center from the real drawing area', () => {
    const { result } = renderHook(
      () => ({
        geometry: usePolarGeometry(),
        drawingArea: useDrawingArea(),
      }),
      options,
    );

    expect(result.current.geometry).to.not.equal(null);
    expect(result.current.geometry?.cx).to.equal(
      result.current.drawingArea.left + result.current.drawingArea.width / 2,
    );
    expect(result.current.geometry?.cy).to.equal(
      result.current.drawingArea.top + result.current.drawingArea.height / 2,
    );
  });

  it('should expose the rotation axis scale as angleScale', () => {
    const { result } = renderHook(
      () => ({
        geometry: usePolarGeometry(),
        rotationAxis: useRotationAxis(),
      }),
      options,
    );

    expect(result.current.geometry?.angleScale).to.equal(result.current.rotationAxis?.scale);
  });

  it('should expose the radius axis scale as radiusScale', () => {
    const { result } = renderHook(
      () => ({
        geometry: usePolarGeometry(),
        radiusAxis: useRadiusAxis(),
      }),
      options,
    );

    expect(result.current.geometry?.radiusScale).to.equal(result.current.radiusAxis?.scale);
  });

  it('should return undefined from angleScale for a metric that does not exist', () => {
    const { result } = renderHook(() => usePolarGeometry(), options);

    expect(
      (result.current?.angleScale as D3OrdinalScale | undefined)?.('not-a-real-metric'),
    ).to.equal(undefined);
  });

  it('should evenly space consecutive metric angles by 2*PI / number of metrics', () => {
    const { result } = renderHook(() => usePolarGeometry(), options);
    const step = (2 * Math.PI) / metrics.length;

    const angles = metrics.map((metric) =>
      (result.current?.angleScale as D3OrdinalScale | undefined)?.(metric),
    );
    expect(angles.every((angle) => typeof angle === 'number')).to.equal(true);

    for (let i = 1; i < angles.length; i += 1) {
      expect(angles[i]! - angles[i - 1]!).to.be.closeTo(step, 1e-6);
    }
  });

  // The rotation axis places metrics as points around the circle (vertices),
  // not as bands with width, so its scale is a point scale where
  // bandwidth() is 0 by definition — confirmed by an actual test run.
  it('should report a bandwidth of 0, since metrics sit on a point scale', () => {
    const { result } = renderHook(() => usePolarGeometry(), options);

    expect(result.current?.bandwidth).to.equal(0);
  });

  it('should produce a smaller angular step as the number of metrics grows', () => {
    const fewOptions: any = { wrapper: makeWrapper({ radar: { metrics: ['A', 'B', 'C'] } }) };
    const manyOptions: any = {
      wrapper: makeWrapper({ radar: { metrics: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'] } }),
    };

    const { result: fewResult } = renderHook(() => usePolarGeometry(), fewOptions);
    const { result: manyResult } = renderHook(() => usePolarGeometry(), manyOptions);

    const fewAngleScale = fewResult.current!.angleScale as D3OrdinalScale;
    const manyAngleScale = manyResult.current!.angleScale as D3OrdinalScale;
    const fewStep = fewAngleScale('B')! - fewAngleScale('A')!;
    const manyStep = manyAngleScale('B')! - manyAngleScale('A')!;

    expect(manyStep).to.be.below(fewStep);
  });

  it('should still resolve a valid geometry with a single metric', () => {
    const singleMetricOptions: any = {
      wrapper: makeWrapper({
        series: [
          { type: 'radar', id: '1', data: [1] },
          { type: 'radar', id: '2', data: [4] },
        ],
        radar: { metrics: ['A'] },
      }),
    };

    const { result } = renderHook(() => usePolarGeometry(), singleMetricOptions);

    expect(result.current).to.not.equal(null);
    expect(result.current?.bandwidth).to.equal(0);
  });

  // point() is a pure trig function defined directly in the hook, so these
  // assertions hold regardless of the surrounding chart context/margins.
  describe('point()', () => {
    it('should map angle 0 to straight up from the center: [0, -radius]', () => {
      const { result } = renderHook(() => usePolarGeometry(), options);
      const [x, y] = result.current!.point(100, 0);

      expect(x).to.be.closeTo(0, 1e-6);
      expect(y).to.be.closeTo(-100, 1e-6);
    });

    it('should map angle PI/2 to the right: [radius, 0]', () => {
      const { result } = renderHook(() => usePolarGeometry(), options);
      const [x, y] = result.current!.point(100, Math.PI / 2);

      expect(x).to.be.closeTo(100, 1e-6);
      expect(y).to.be.closeTo(0, 1e-6);
    });

    it('should map angle PI to straight down: [0, radius]', () => {
      const { result } = renderHook(() => usePolarGeometry(), options);
      const [x, y] = result.current!.point(100, Math.PI);

      expect(x).to.be.closeTo(0, 1e-6);
      expect(y).to.be.closeTo(100, 1e-6);
    });

    it('should map angle 3*PI/2 to the left: [-radius, 0]', () => {
      const { result } = renderHook(() => usePolarGeometry(), options);
      const [x, y] = result.current!.point(100, (3 * Math.PI) / 2);

      expect(x).to.be.closeTo(-100, 1e-6);
      expect(y).to.be.closeTo(0, 1e-6);
    });

    it('should collapse to the origin when radius is 0, for any angle', () => {
      const { result } = renderHook(() => usePolarGeometry(), options);
      const [x, y] = result.current!.point(0, Math.PI / 5);

      expect(x).to.be.closeTo(0, 1e-6);
      expect(y).to.be.closeTo(0, 1e-6);
    });

    it('should mirror through the origin for a negative radius', () => {
      const { result } = renderHook(() => usePolarGeometry(), options);
      const positive = result.current!.point(50, Math.PI / 4);
      const negative = result.current!.point(-50, Math.PI / 4);

      expect(negative[0]).to.be.closeTo(-positive[0], 1e-6);
      expect(negative[1]).to.be.closeTo(-positive[1], 1e-6);
    });

    it('should be periodic: angle + 2*PI lands on the same point', () => {
      const { result } = renderHook(() => usePolarGeometry(), options);
      const base = result.current!.point(100, Math.PI / 6);
      const wrapped = result.current!.point(100, Math.PI / 6 + 2 * Math.PI);

      expect(wrapped[0]).to.be.closeTo(base[0], 1e-6);
      expect(wrapped[1]).to.be.closeTo(base[1], 1e-6);
    });
  });

  describe('with a non-square chart', () => {
    it('should recompute the center relative to the actual drawing area', () => {
      const customOptions: any = { wrapper: makeWrapper({ width: 600, height: 300 }) };

      const { result } = renderHook(
        () => ({
          geometry: usePolarGeometry(),
          drawingArea: useDrawingArea(),
        }),
        customOptions,
      );

      expect(result.current.geometry?.cx).to.equal(
        result.current.drawingArea.left + result.current.drawingArea.width / 2,
      );
      expect(result.current.geometry?.cy).to.equal(
        result.current.drawingArea.top + result.current.drawingArea.height / 2,
      );
    });
  });
});
