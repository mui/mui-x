import getMarkerSize from './getMarkerSize';
import { getSizeScale } from '../../internals/sizeScale';
import {
  type DefaultizedScatterSeriesType,
  type ScatterValueType,
} from '../../models/seriesType/scatter';
import { type ZAxisDefaultized } from '../../models/z-axis';

function createSeries(
  data: (ScatterValueType | null)[],
  markerSize = 4,
): DefaultizedScatterSeriesType {
  return { markerSize, data } as unknown as DefaultizedScatterSeriesType;
}

describe('getMarkerSize', () => {
  it('returns the series markerSize when no size axis is provided', () => {
    const getter = getMarkerSize(createSeries([{ x: 0, y: 0 }], 7));
    expect(getter(0)).to.equal(7);
  });

  it('returns the series markerSize when the size axis has no sizeMap', () => {
    const getter = getMarkerSize(createSeries([{ x: 0, y: 0 }], 7), { id: 'z' });
    expect(getter(0)).to.equal(7);
  });

  it('maps the size axis data through the size scale', () => {
    const sizeZAxis: ZAxisDefaultized = {
      id: 'z',
      data: [0, 10],
      sizeScale: getSizeScale({ type: 'continuous', min: 0, max: 10, size: [1, 11] }),
    };
    const getter = getMarkerSize(
      createSeries([
        { x: 0, y: 0 },
        { x: 1, y: 1 },
      ]),
      sizeZAxis,
    );
    expect(getter(0)).to.equal(1);
    expect(getter(1)).to.equal(11);
  });

  it('falls back to the point sizeValue when the axis has no data', () => {
    const sizeZAxis: ZAxisDefaultized = {
      id: 'z',
      sizeScale: getSizeScale({ type: 'continuous', min: 0, max: 10, size: [1, 11] }),
    };
    const getter = getMarkerSize(
      createSeries([
        { x: 0, y: 0, sizeValue: 0 },
        { x: 1, y: 1, sizeValue: 10 },
      ]),
      sizeZAxis,
    );
    expect(getter(0)).to.equal(1);
    expect(getter(1)).to.equal(11);
  });

  it('falls back to markerSize when the scale returns no size', () => {
    const sizeZAxis: ZAxisDefaultized = {
      id: 'z',
      sizeScale: getSizeScale({ type: 'ordinal', values: ['a'], sizes: [20] }),
    };
    const getter = getMarkerSize(
      createSeries(
        [
          { x: 0, y: 0, sizeValue: 'a' },
          { x: 1, y: 1, sizeValue: 'unknown' },
        ],
        5,
      ),
      sizeZAxis,
    );
    expect(getter(0)).to.equal(20);
    expect(getter(1)).to.equal(5);
  });

  it('falls back to markerSize for null data points', () => {
    const sizeZAxis: ZAxisDefaultized = {
      id: 'z',
      sizeScale: getSizeScale({ type: 'continuous', min: 0, max: 10, size: [1, 11] }),
    };
    const getter = getMarkerSize(createSeries([null], 5), sizeZAxis);
    expect(getter(0)).to.equal(5);
  });
});
