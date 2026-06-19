import { type AxisGroup } from '../models/axis';

const DEFAULT_GROUPING_CONFIG = {
  tickSize: 6,
};

export const getGroupingConfig = (
  groups: AxisGroup[],
  groupIndex: number,
  tickSize: number | undefined,
  computedGroupTickSizes?: number[],
) => {
  const config = groups[groupIndex] ?? ({} as AxisGroup);

  const defaultTickSize = tickSize ?? DEFAULT_GROUPING_CONFIG.tickSize;
  const calculatedTickSize = defaultTickSize * groupIndex * 2 + defaultTickSize;

  return {
    ...DEFAULT_GROUPING_CONFIG,
    ...config,
    tickSize: computedGroupTickSizes?.[groupIndex] ?? config.tickSize ?? calculatedTickSize,
  };
};
