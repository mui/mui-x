import { AxisConfig } from '../../models';
import { ExtremumGettersConfig } from '../PluginProvider';
import { FormattedSeries } from '../SeriesProvider';
import { getAxisExtremum } from './getAxisExtremum';

/**
 * Applies the zoom into the scale range.
 * It changes the screen coordinates that the scale covers.
 * Not the data that is displayed.
 *
 * @param scaleRange the original range in real screen coordinates.
 * @param zoomRange the zoom range in percentage.
 * @returns zoomed range in real screen coordinates.
 */
export const zoomScaleRange = (
  scaleRange: [number, number] | number[],
  zoomRange: [number, number] | number[],
) => {
  const rangeGap = scaleRange[1] - scaleRange[0];
  const zoomGap = zoomRange[1] - zoomRange[0];

  // If current zoom show the scale between p1 and p2 percents
  // The range should be extended by adding [0, p1] and [p2, 100] segments
  const min = scaleRange[0] - (zoomRange[0] * rangeGap) / zoomGap;
  const max = scaleRange[1] + ((100 - zoomRange[1]) * rangeGap) / zoomGap;

  return [min, max];
};

const zoomExtremums = (
  extremums: [number, number] | number[],
  zoomRange: [number, number],
): [number, number] => {
  const extremumsGap = extremums[1] - extremums[0];

  const minZoomed = extremums[0] + (zoomRange[0] / 100) * extremumsGap;
  const maxZoomed = extremums[1] - ((100 - zoomRange[1]) / 100) * extremumsGap;

  return [minZoomed, maxZoomed];
};

export const applyZoomFilter = ({
  axis,
  getters,
  isDefaultAxis,
  formattedSeries,
  zoomRange,
  zoomOption,
}: {
  axis: AxisConfig;
  getters: ExtremumGettersConfig;
  isDefaultAxis: boolean;
  formattedSeries: FormattedSeries;
  zoomRange: [number, number];
  zoomOption?: { filterMode: 'keep' | 'discard' | 'empty' };
}) => {
  const [minData, maxData] = getAxisExtremum(axis, getters, isDefaultAxis, formattedSeries);
  const data = axis.data ?? [];

  if (!zoomOption || zoomOption.filterMode === 'keep' || minData === null || maxData === null) {
    return { minData, maxData, data, minFiltered: minData, maxFiltered: maxData };
  }

  const [minZoomed, maxZoomed] = zoomExtremums([minData, maxData], zoomRange);
  console.table({ data: [minData, maxData], zoomRange, zoomed: [minZoomed, maxZoomed] });

  // TODO: gotta create a getter/filterer like ExtremumGettersConfig for this kind of rule
  const filteredData = data.filter((value) => {
    const isDateAndOutOfBounds =
      value instanceof Date && (value.getTime() <= minZoomed || value.getTime() >= maxZoomed);
    const isOutOfBounds = typeof value === 'number' && (value <= minZoomed || value >= maxZoomed);

    if (isDateAndOutOfBounds || isOutOfBounds) {
      return false;
    }

    return true;
  });

  const [minFiltered, maxFiltered] = getAxisExtremum(
    { ...axis, data: filteredData },
    getters,
    isDefaultAxis,
    formattedSeries,
  );

  return { minData, maxData, data, minFiltered, maxFiltered };
};
