import { ZoomFilterMode } from './Cartesian.types';

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
  extremums: [number, number],
  zoomRange: [number, number],
): [number, number] => {
  const extremumsGap = extremums[1] - extremums[0];

  const minZoomed = extremums[0] + (zoomRange[0] / 100) * extremumsGap;
  const maxZoomed = extremums[1] - ((100 - zoomRange[1]) / 100) * extremumsGap;

  return [minZoomed, maxZoomed];
};

export const applyZoomFilter = ({
  extremums,
  zoomRange,
  filterMode,
}: {
  extremums: [number | null | Date, number | null | Date] | (number | null | Date)[];
  zoomRange: [number, number];
  filterMode: ZoomFilterMode;
}) => {
  const minExtremum = extremums[0];
  const maxExtremum = extremums[1];

  if (minExtremum instanceof Date || maxExtremum instanceof Date) {
    throw new Error('Date values are not supported in zoom filtering.');
  }

  if (filterMode === 'keep' || minExtremum === null || maxExtremum === null) {
    return { min: minExtremum ?? -Infinity, max: maxExtremum ?? Infinity };
  }

  const [filteredMin, filteredMax] = zoomExtremums([minExtremum, maxExtremum], zoomRange);
  return { min: filteredMin, max: filteredMax };
};
