import type { AxisGroup, ScaleName } from '../models/axis';
import { isDateData } from './dateHelpers';
import { keyof } from './scales/scaleBand';

type ValueFilter = (value: any, index: number) => boolean;

type OrdinalAxisConfig = {
  scaleType?: ScaleName;
  data?: readonly any[];
  valueFormatter?: (value: any, context: any) => string;
  tickInterval?: 'auto' | ValueFilter | any[];
  tickLabelInterval?: 'auto' | ValueFilter;
  groups?: AxisGroup[];
};

// Keyed by the `data` array so the indexes keep the same reference, and the scale cache keeps hitting.
const indexesByData = new WeakMap<readonly unknown[], readonly number[] | null>();
const dataByIndexes = new WeakMap<readonly unknown[], readonly unknown[]>();

function hasDuplicates(data: readonly unknown[]) {
  const keys = new Set();
  for (let i = 0; i < data.length; i += 1) {
    keys.add(keyof(data[i]));
    if (keys.size <= i) {
      return true;
    }
  }
  return false;
}

function getIndexes(data: readonly unknown[]) {
  let indexes = indexesByData.get(data);
  if (indexes === undefined) {
    indexes = hasDuplicates(data) ? data.map((_, index) => index) : null;
    indexesByData.set(data, indexes);
    if (indexes) {
      dataByIndexes.set(indexes, data);
    }
  }
  return indexes;
}

/**
 * Band and point scales merge equal values, so an axis with duplicated values gets fewer bands than data points.
 * In that case, replaces `data` by its indexes, and makes the functions receiving an axis value receive the original one.
 * Date data is left untouched.
 */
export function indexDuplicatedAxisData<Axis extends OrdinalAxisConfig>(axis: Axis): Axis {
  const { data, valueFormatter, tickInterval, tickLabelInterval, groups } = axis;

  if ((axis.scaleType !== 'band' && axis.scaleType !== 'point') || !data || isDateData(data)) {
    return axis;
  }

  const indexes = getIndexes(data);
  if (!indexes) {
    return axis;
  }

  const indexed: OrdinalAxisConfig = {
    ...axis,
    data: indexes,
    valueFormatter: (index, context) => {
      // Legends format the color map values.
      const value = context.location === 'legend' ? index : data[index];
      if (!valueFormatter) {
        return context.location === 'tick' ? `${value}` : (value?.toLocaleString() ?? '');
      }
      return valueFormatter(
        value,
        'defaultTickLabel' in context ? { ...context, defaultTickLabel: `${value}` } : context,
      );
    },
  };

  if (typeof tickInterval === 'function') {
    indexed.tickInterval = (index, position) => tickInterval(data[index], position);
  } else if (Array.isArray(tickInterval)) {
    const keys = data.map(keyof);
    indexed.tickInterval = tickInterval
      .map((value) => keys.indexOf(keyof(value)))
      .filter((index) => index !== -1);
  }

  if (typeof tickLabelInterval === 'function') {
    indexed.tickLabelInterval = (index, position) => tickLabelInterval(data[index], position);
  }

  if (groups) {
    indexed.groups = groups.map((group) => ({
      ...group,
      getValue: (index, dataIndex) => group.getValue(data[index], dataIndex),
    }));
  }

  return indexed as Axis;
}

/**
 * @returns The `data` provided by the user, see `indexDuplicatedAxisData`.
 */
export function getAxisData(
  axis: { data?: readonly any[] } | undefined,
): readonly any[] | undefined {
  const data = axis?.data;
  return data && (dataByIndexes.get(data) ?? data);
}

/**
 * @returns The value provided by the user for `axis.data[dataIndex]`, see `indexDuplicatedAxisData`.
 */
export function getAxisDataValue(axis: { data?: readonly any[] } | undefined, dataIndex: number) {
  return getAxisData(axis)?.[dataIndex];
}
