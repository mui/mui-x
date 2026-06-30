import type { ZAxisDefaultized } from '@mui/x-charts/internals';
import type { DefaultizedMapPointSeriesType } from '../../models/seriesType/mapPoint';

/**
 * Returns the marker area (in square pixels) of a map point given its data index.
 * @param {number} dataIndex The index of the map point in the series data.
 * @returns {number} The marker area, in square pixels.
 */
export type MapPointSizeGetter = (dataIndex: number) => number;

/**
 * Builds a getter returning the marker area of each map point.
 *
 * When the size axis defines a `sizeMap`, the area is computed by mapping a value
 * through the resulting `sizeScale`. The mapped value is taken from the size axis
 * `data` when available, otherwise from the point's `sizeValue`, then its `value`.
 * It falls back to the plot `size` when no value can be mapped.
 */
const getSize = (
  series: DefaultizedMapPointSeriesType,
  fixedSize: number,
  sizeZAxis?: ZAxisDefaultized,
): MapPointSizeGetter => {
  const sizeScale = sizeZAxis?.sizeScale;

  if (!sizeScale) {
    return () => fixedSize;
  }

  return (dataIndex: number) => {
    if (sizeZAxis?.data?.[dataIndex] !== undefined) {
      const size = sizeScale(sizeZAxis.data[dataIndex]);
      if (size != null && !Number.isNaN(size)) {
        return size;
      }
    }

    const item = series.data[dataIndex];
    if (item != null) {
      const size = sizeScale(item.sizeValue ?? item.value);
      if (size != null && !Number.isNaN(size)) {
        return size;
      }
    }

    return fixedSize;
  };
};

export default getSize;
