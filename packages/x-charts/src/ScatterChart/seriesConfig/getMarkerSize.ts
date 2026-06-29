import type { DefaultizedScatterSeriesType } from '../../models/seriesType/scatter';
import type { ZAxisDefaultized } from '../../models/z-axis';

/**
 * Returns the marker size of a scatter item given its data index.
 * @param {number} dataIndex The index of the scatter item.
 * @returns {number} The marker size in pixels.
 */
export type ScatterSizeGetter = (dataIndex: number) => number;

/**
 * Builds a getter returning the marker size of each scatter item.
 *
 * When the size axis defines a `sizeMap`, the size is computed by mapping a value
 * through the resulting `sizeScale`. The mapped value is taken from the size axis
 * `data` when available, otherwise from the `sizeValue` of the scatter point.
 * It falls back to the series `markerSize` when no size can be computed.
 */
const getMarkerSize = (
  series: DefaultizedScatterSeriesType,
  sizeZAxis?: ZAxisDefaultized,
): ScatterSizeGetter => {
  const sizeScale = sizeZAxis?.sizeScale;

  if (!sizeScale) {
    return () => series.markerSize;
  }

  return (dataIndex: number) => {
    if (sizeZAxis?.data?.[dataIndex] !== undefined) {
      const size = sizeScale(sizeZAxis.data[dataIndex]);
      if (size != null && !Number.isNaN(size)) {
        return size;
      }
    }

    const value = series.data[dataIndex];
    if (value != null) {
      const size = sizeScale(value.sizeValue);
      if (size != null && !Number.isNaN(size)) {
        return size;
      }
    }

    return series.markerSize;
  };
};

export default getMarkerSize;
