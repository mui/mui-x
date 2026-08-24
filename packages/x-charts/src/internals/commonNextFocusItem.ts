import { getPreviousNonEmptySeries } from './plugins/featurePlugins/useChartKeyboardNavigation/utils/getPreviousNonEmptySeries';
import { getNonEmptySeriesArray } from './plugins/featurePlugins/useChartKeyboardNavigation/utils/getNonEmptySeriesArray';
import { getMaxSeriesLength } from './plugins/featurePlugins/useChartKeyboardNavigation/utils/getMaxSeriesLength';
import type { UseChartKeyboardNavigationSignature } from './plugins/featurePlugins/useChartKeyboardNavigation';
import { getNextNonEmptySeries } from './plugins/featurePlugins/useChartKeyboardNavigation/utils/getNextNonEmptySeries';
import { findVisibleDataIndex } from './plugins/featurePlugins/useChartKeyboardNavigation/utils/findVisibleDataIndex';
import type { ChartState } from './plugins/models/chart';
import { seriesHasData } from './seriesHasData';
import type { ChartSeriesType } from '../models/seriesType/config';
import type { SeriesId } from '../models/seriesType';
import type { ProcessedSeries } from './plugins/corePlugins/useChartSeries/useChartSeries.types';
import { selectorChartSeriesProcessed } from './plugins/corePlugins/useChartSeries/useChartSeries.selectors';

type ReturnedItem<OutSeriesType extends ChartSeriesType> = {
  type: OutSeriesType;
  seriesId: SeriesId;
  dataIndex: number;
} | null;

/**
 * The item the navigators work on. Decoupled from the public `FocusedItemIdentifier` because
 * navigation is position-based: series keyed differently (e.g. `mapShape`, keyed by `name`)
 * reuse these helpers by translating to a `dataIndex` at their boundary.
 */
type WorkingItem = {
  type: Exclude<ChartSeriesType, 'sankey' | 'heatmap'>;
  seriesId: SeriesId;
  dataIndex?: number;
};

type StateParameters<SeriesType extends ChartSeriesType> = Pick<
  ChartState<[UseChartKeyboardNavigationSignature], [], SeriesType>,
  'series'
>;

function isSeriesHidden(
  processedSeries: ProcessedSeries<ChartSeriesType>,
  type: ChartSeriesType,
  seriesId: SeriesId,
): boolean {
  const seriesItem = processedSeries[type]?.series[seriesId];
  return Boolean(seriesItem && 'hidden' in seriesItem && seriesItem.hidden);
}

export function createGetNextIndexFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'> = InSeriesType,
>(
  /**
   * The set of series types compatible with this navigation action.
   */
  compatibleSeriesTypes: Set<OutSeriesType>,
  /**
   * If true, allows cycling from the last item to the first one.
   */
  allowCycles: boolean = false,
  /**
   * If true (default), series max index is defined by the current series length and not all series.
   */
  useCurrentSeriesMaxLength: boolean = true,
) {
  return function getNextIndexFocusedItem(
    currentItem: WorkingItem | null,
    state: StateParameters<InSeriesType>,
  ): ReturnedItem<OutSeriesType> {
    const processedSeries = selectorChartSeriesProcessed(
      state as ChartState<[UseChartKeyboardNavigationSignature], []>,
    );
    let seriesId = currentItem?.seriesId;
    let type = currentItem?.type;
    if (
      !type ||
      seriesId == null ||
      !seriesHasData(processedSeries, type, seriesId) ||
      isSeriesHidden(processedSeries, type, seriesId)
    ) {
      const nextSeries = getNextNonEmptySeries<OutSeriesType>(
        processedSeries,
        compatibleSeriesTypes,
        type,
        seriesId,
      );
      if (nextSeries === null) {
        return null;
      }
      type = nextSeries.type;
      seriesId = nextSeries.seriesId;
    }

    const maxLength = useCurrentSeriesMaxLength
      ? (processedSeries[type]?.series[seriesId]?.data.length ?? 0)
      : getMaxSeriesLength(processedSeries, compatibleSeriesTypes);

    let dataIndex = currentItem?.dataIndex == null ? 0 : currentItem.dataIndex + 1;
    if (allowCycles) {
      dataIndex = dataIndex % maxLength;
    } else {
      dataIndex = Math.min(maxLength - 1, dataIndex);
    }

    const visibleDataIndex = findVisibleDataIndex({
      processedSeries,
      type,
      seriesId,
      startIndex: dataIndex,
      dataLength: maxLength,
      direction: 1,
      allowCycles,
    });

    if (visibleDataIndex === null) {
      return null;
    }

    return {
      type: type as OutSeriesType,
      seriesId,
      dataIndex: visibleDataIndex,
    };
  };
}

export function createGetPreviousIndexFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'> = InSeriesType,
>(
  /**
   * The set of series types compatible with this navigation action.
   */
  compatibleSeriesTypes: Set<OutSeriesType>,
  /**
   * If true, allows cycling from the last item to the first one.
   */
  allowCycles: boolean = false,
  /**
   * If true (default), series max index is defined by the current series length and not all series.
   */
  useCurrentSeriesMaxLength: boolean = true,
) {
  return function getPreviousIndexFocusedItem(
    currentItem: WorkingItem | null,
    state: StateParameters<InSeriesType>,
  ): ReturnedItem<OutSeriesType> {
    const processedSeries = selectorChartSeriesProcessed(
      state as ChartState<[UseChartKeyboardNavigationSignature], []>,
    );
    let seriesId = currentItem?.seriesId;
    let type = currentItem?.type;
    if (
      !type ||
      seriesId == null ||
      !seriesHasData(processedSeries, type, seriesId) ||
      isSeriesHidden(processedSeries, type, seriesId)
    ) {
      const previousSeries = getPreviousNonEmptySeries<OutSeriesType>(
        processedSeries,
        compatibleSeriesTypes,
        type,
        seriesId,
      );
      if (previousSeries === null) {
        return null;
      }
      type = previousSeries.type;
      seriesId = previousSeries.seriesId;
    }

    const maxLength = useCurrentSeriesMaxLength
      ? (processedSeries[type]?.series[seriesId]?.data.length ?? 0)
      : getMaxSeriesLength(processedSeries, compatibleSeriesTypes);

    let dataIndex = currentItem?.dataIndex == null ? maxLength - 1 : currentItem.dataIndex - 1;
    if (allowCycles) {
      dataIndex = (maxLength + dataIndex) % maxLength;
    } else {
      dataIndex = Math.max(0, dataIndex);
    }

    const visibleDataIndex = findVisibleDataIndex({
      processedSeries,
      type,
      seriesId,
      startIndex: dataIndex,
      dataLength: maxLength,
      direction: -1,
      allowCycles,
    });

    if (visibleDataIndex === null) {
      return null;
    }

    return {
      type: type as OutSeriesType,
      seriesId,
      dataIndex: visibleDataIndex,
    };
  };
}

export function createGetFirstIndexFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'> = InSeriesType,
>(
  /**
   * The set of series types compatible with this navigation action.
   */
  compatibleSeriesTypes: Set<OutSeriesType>,
  /**
   * If true, series max index is defined by the current series length and not all series.
   */
  useCurrentSeriesMaxLength: boolean = false,
) {
  return function getFirstIndexFocusedItem(
    currentItem: WorkingItem | null,
    state: StateParameters<InSeriesType>,
  ): ReturnedItem<OutSeriesType> {
    const processedSeries = selectorChartSeriesProcessed(
      state as ChartState<[UseChartKeyboardNavigationSignature], []>,
    );
    let seriesId = currentItem?.seriesId;
    let type = currentItem?.type;
    if (
      !type ||
      seriesId == null ||
      !seriesHasData(processedSeries, type, seriesId) ||
      isSeriesHidden(processedSeries, type, seriesId)
    ) {
      const nextSeries = getNextNonEmptySeries<OutSeriesType>(
        processedSeries,
        compatibleSeriesTypes,
        type,
        seriesId,
      );
      if (nextSeries === null) {
        return null;
      }
      type = nextSeries.type;
      seriesId = nextSeries.seriesId;
    }

    const maxLength = useCurrentSeriesMaxLength
      ? (processedSeries[type]?.series[seriesId]?.data.length ?? 0)
      : getMaxSeriesLength(processedSeries, compatibleSeriesTypes);

    const visibleDataIndex = findVisibleDataIndex({
      processedSeries,
      type,
      seriesId,
      startIndex: 0,
      dataLength: maxLength,
      direction: 1,
      allowCycles: false,
    });

    if (visibleDataIndex === null) {
      return null;
    }

    return {
      type: type as OutSeriesType,
      seriesId,
      dataIndex: visibleDataIndex,
    };
  };
}

export function createGetLastIndexFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'> = InSeriesType,
>(
  /**
   * The set of series types compatible with this navigation action.
   */
  compatibleSeriesTypes: Set<OutSeriesType>,
  /**
   * If true, series max index is defined by the current series length and not all series.
   */
  useCurrentSeriesMaxLength: boolean = false,
) {
  return function getLastIndexFocusedItem(
    currentItem: WorkingItem | null,
    state: StateParameters<InSeriesType>,
  ): ReturnedItem<OutSeriesType> {
    const processedSeries = selectorChartSeriesProcessed(
      state as ChartState<[UseChartKeyboardNavigationSignature], []>,
    );
    let seriesId = currentItem?.seriesId;
    let type = currentItem?.type;
    if (
      !type ||
      seriesId == null ||
      !seriesHasData(processedSeries, type, seriesId) ||
      isSeriesHidden(processedSeries, type, seriesId)
    ) {
      const previousSeries = getPreviousNonEmptySeries<OutSeriesType>(
        processedSeries,
        compatibleSeriesTypes,
        type,
        seriesId,
      );
      if (previousSeries === null) {
        return null;
      }
      type = previousSeries.type;
      seriesId = previousSeries.seriesId;
    }

    const maxLength = useCurrentSeriesMaxLength
      ? (processedSeries[type]?.series[seriesId]?.data.length ?? 0)
      : getMaxSeriesLength(processedSeries, compatibleSeriesTypes);

    const visibleDataIndex = findVisibleDataIndex({
      processedSeries,
      type,
      seriesId,
      startIndex: maxLength - 1,
      dataLength: maxLength,
      direction: -1,
      allowCycles: false,
    });

    if (visibleDataIndex === null) {
      return null;
    }

    return {
      type: type as OutSeriesType,
      seriesId,
      dataIndex: visibleDataIndex,
    };
  };
}

export function createGetNextSeriesFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'> = InSeriesType,
>(
  /**
   * The set of series types compatible with this navigation action.
   */
  compatibleSeriesTypes: Set<OutSeriesType>,
) {
  return function getNextSeriesFocusedItem(
    currentItem: WorkingItem | null,
    state: StateParameters<InSeriesType>,
  ): ReturnedItem<OutSeriesType> {
    const processedSeries = selectorChartSeriesProcessed(
      state as ChartState<[UseChartKeyboardNavigationSignature], []>,
    );
    let seriesId = currentItem?.seriesId;
    let type = currentItem?.type;

    const nextSeries = getNextNonEmptySeries<OutSeriesType>(
      processedSeries,
      compatibleSeriesTypes,
      type,
      seriesId,
    );

    if (nextSeries === null) {
      return null; // No series to move the focus to.
    }
    type = nextSeries.type;
    seriesId = nextSeries.seriesId;

    const data = processedSeries[type as OutSeriesType]!.series[seriesId].data;
    const startIndex =
      currentItem?.dataIndex == null ? 0 : Math.min(currentItem.dataIndex, data.length - 1);
    const visibleDataIndex = findVisibleDataIndex({
      processedSeries,
      type,
      seriesId,
      startIndex,
      dataLength: data.length,
      direction: 1,
      allowCycles: true,
    });

    if (visibleDataIndex === null) {
      return null;
    }

    return {
      type: type as OutSeriesType,
      seriesId,
      dataIndex: visibleDataIndex,
    };
  };
}

export function createGetPreviousSeriesFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'> = InSeriesType,
>(
  /**
   * The set of series types compatible with this navigation action.
   */
  compatibleSeriesTypes: Set<OutSeriesType>,
) {
  return function getPreviousSeriesFocusedItem(
    currentItem: WorkingItem | null,
    state: StateParameters<InSeriesType>,
  ): ReturnedItem<OutSeriesType> {
    const processedSeries = selectorChartSeriesProcessed(
      state as ChartState<[UseChartKeyboardNavigationSignature], []>,
    );
    let seriesId = currentItem?.seriesId;
    let type = currentItem?.type;

    const previousSeries = getPreviousNonEmptySeries<OutSeriesType>(
      processedSeries,
      compatibleSeriesTypes,
      type,
      seriesId,
    );
    if (previousSeries === null) {
      return null; // No series to move the focus to.
    }
    type = previousSeries.type;
    seriesId = previousSeries.seriesId;

    const data = processedSeries[type as OutSeriesType]!.series[seriesId].data;
    const startIndex =
      currentItem?.dataIndex == null
        ? data.length - 1
        : Math.min(currentItem.dataIndex, data.length - 1);
    const visibleDataIndex = findVisibleDataIndex({
      processedSeries,
      type,
      seriesId,
      startIndex,
      dataLength: data.length,
      direction: -1,
      allowCycles: true,
    });

    if (visibleDataIndex === null) {
      return null;
    }

    return {
      type: type as OutSeriesType,
      seriesId,
      dataIndex: visibleDataIndex,
    };
  };
}

export function createGetFirstSeriesFirstIndexFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'> = InSeriesType,
>(
  /**
   * The set of series types compatible with this navigation action.
   */
  compatibleSeriesTypes: Set<OutSeriesType>,
  /**
   * If true, series max index is defined by the current series length and not all series.
   */
  useCurrentSeriesMaxLength: boolean = false,
) {
  return function getFirstSeriesFirstIndexFocusedItem(
    _currentItem: WorkingItem | null,
    state: StateParameters<InSeriesType>,
  ): ReturnedItem<OutSeriesType> {
    const processedSeries = selectorChartSeriesProcessed(
      state as ChartState<[UseChartKeyboardNavigationSignature], []>,
    );
    const firstSeries = getNonEmptySeriesArray(processedSeries, compatibleSeriesTypes)[0];
    if (firstSeries === undefined) {
      return null;
    }
    const { type, seriesId } = firstSeries;

    const maxLength = useCurrentSeriesMaxLength
      ? (processedSeries[type]?.series[seriesId]?.data.length ?? 0)
      : getMaxSeriesLength(processedSeries, compatibleSeriesTypes);

    const visibleDataIndex = findVisibleDataIndex({
      processedSeries,
      type,
      seriesId,
      startIndex: 0,
      dataLength: maxLength,
      direction: 1,
      allowCycles: false,
    });

    if (visibleDataIndex === null) {
      return null;
    }

    return {
      type,
      seriesId,
      dataIndex: visibleDataIndex,
    };
  };
}

export function createGetLastSeriesLastIndexFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'> = InSeriesType,
>(
  /**
   * The set of series types compatible with this navigation action.
   */
  compatibleSeriesTypes: Set<OutSeriesType>,
  /**
   * If true, series max index is defined by the current series length and not all series.
   */
  useCurrentSeriesMaxLength: boolean = false,
) {
  return function getLastSeriesLastIndexFocusedItem(
    _currentItem: WorkingItem | null,
    state: StateParameters<InSeriesType>,
  ): ReturnedItem<OutSeriesType> {
    const processedSeries = selectorChartSeriesProcessed(
      state as ChartState<[UseChartKeyboardNavigationSignature], []>,
    );
    const nonEmptySeries = getNonEmptySeriesArray(processedSeries, compatibleSeriesTypes);
    const lastSeries = nonEmptySeries[nonEmptySeries.length - 1];
    if (lastSeries === undefined) {
      return null;
    }
    const { type, seriesId } = lastSeries;

    const maxLength = useCurrentSeriesMaxLength
      ? (processedSeries[type]?.series[seriesId]?.data.length ?? 0)
      : getMaxSeriesLength(processedSeries, compatibleSeriesTypes);

    const visibleDataIndex = findVisibleDataIndex({
      processedSeries,
      type,
      seriesId,
      startIndex: maxLength - 1,
      dataLength: maxLength,
      direction: -1,
      allowCycles: false,
    });

    if (visibleDataIndex === null) {
      return null;
    }

    return {
      type,
      seriesId,
      dataIndex: visibleDataIndex,
    };
  };
}

export function createGetFirstSeriesFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'> = InSeriesType,
>(
  /**
   * The set of series types compatible with this navigation action.
   */
  compatibleSeriesTypes: Set<OutSeriesType>,
) {
  return function getFirstSeriesFocusedItem(
    currentItem: WorkingItem | null,
    state: StateParameters<InSeriesType>,
  ): ReturnedItem<OutSeriesType> {
    const processedSeries = selectorChartSeriesProcessed(
      state as ChartState<[UseChartKeyboardNavigationSignature], []>,
    );
    const firstSeries = getNonEmptySeriesArray(processedSeries, compatibleSeriesTypes)[0];
    if (firstSeries === undefined) {
      return null;
    }
    const { type, seriesId } = firstSeries;

    const data = processedSeries[type]!.series[seriesId].data;
    const startIndex =
      currentItem?.dataIndex == null ? 0 : Math.min(currentItem.dataIndex, data.length - 1);
    const visibleDataIndex = findVisibleDataIndex({
      processedSeries,
      type,
      seriesId,
      startIndex,
      dataLength: data.length,
      direction: 1,
      allowCycles: true,
    });

    if (visibleDataIndex === null) {
      return null;
    }

    return {
      type,
      seriesId,
      dataIndex: visibleDataIndex,
    };
  };
}

export function createGetLastSeriesFocusedItem<
  InSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'>,
  OutSeriesType extends Exclude<ChartSeriesType, 'sankey' | 'heatmap'> = InSeriesType,
>(
  /**
   * The set of series types compatible with this navigation action.
   */
  compatibleSeriesTypes: Set<OutSeriesType>,
) {
  return function getLastSeriesFocusedItem(
    currentItem: WorkingItem | null,
    state: StateParameters<InSeriesType>,
  ): ReturnedItem<OutSeriesType> {
    const processedSeries = selectorChartSeriesProcessed(
      state as ChartState<[UseChartKeyboardNavigationSignature], []>,
    );
    const nonEmptySeries = getNonEmptySeriesArray(processedSeries, compatibleSeriesTypes);
    const lastSeries = nonEmptySeries[nonEmptySeries.length - 1];
    if (lastSeries === undefined) {
      return null;
    }
    const { type, seriesId } = lastSeries;

    const data = processedSeries[type]!.series[seriesId].data;
    const startIndex =
      currentItem?.dataIndex == null
        ? data.length - 1
        : Math.min(currentItem.dataIndex, data.length - 1);
    const visibleDataIndex = findVisibleDataIndex({
      processedSeries,
      type,
      seriesId,
      startIndex,
      dataLength: data.length,
      direction: -1,
      allowCycles: true,
    });

    if (visibleDataIndex === null) {
      return null;
    }

    return {
      type,
      seriesId,
      dataIndex: visibleDataIndex,
    };
  };
}
