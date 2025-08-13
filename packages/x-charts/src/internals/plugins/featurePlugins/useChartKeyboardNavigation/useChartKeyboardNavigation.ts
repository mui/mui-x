'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { ChartPlugin } from '../../models';
import { UseChartKeyboardNavigationSignature } from './useChartKeyboardNavigation.types';
import { ChartSeriesType, ChartsSeriesConfig } from '../../../../models/seriesType/config';
import { SeriesId } from '../../../../models/seriesType/common';
import { ProcessedSeries } from '../../corePlugins/useChartSeries';

/**
 * Returns the next series type and id that contains some data.
 * Returns `null` if no other series have data.
 */
function getNextSeriesWithData(
  series: ProcessedSeries<keyof ChartsSeriesConfig>,
  type?: ChartSeriesType,
  seriesId?: SeriesId,
): {
  type: ChartSeriesType;
  seriesId: SeriesId;
} | null {
  const startingTypeIndex =
    type !== undefined && series[type] ? Object.keys(series).indexOf(type) : 0;
  const currentSeriesIndex =
    type !== undefined && seriesId !== undefined && series[type] && series[type].series[seriesId]
      ? series[type].seriesOrder.indexOf(seriesId)
      : -1;
  const typesAvailable = Object.keys(series) as (keyof typeof series)[];

  for (let typeGap = 0; typeGap < typesAvailable.length; typeGap += 1) {
    const typeIndex = (startingTypeIndex + typeGap) % typesAvailable.length;
    const seriesOfType = series[typesAvailable[typeIndex]]!;

    const startingSeriesIndex =
      typeGap === 0 ? (currentSeriesIndex + 1) % seriesOfType.seriesOrder.length : 0;

    for (
      let seriesIndex = startingSeriesIndex;
      seriesIndex < seriesOfType.seriesOrder.length;
      seriesIndex += 1
    ) {
      if (seriesOfType.series[seriesOfType.seriesOrder[seriesIndex]].data.length > 0) {
        return {
          type: typesAvailable[typeIndex],
          seriesId: seriesOfType.seriesOrder[seriesIndex],
        };
      }
    }
  }

  // End looping on the initial type up to the initial series
  const typeIndex = startingTypeIndex % typesAvailable.length;
  const seriesOfType = series[typesAvailable[typeIndex]]!;

  const endingSeriesIndex = currentSeriesIndex;

  for (let seriesIndex = 0; seriesIndex < endingSeriesIndex; seriesIndex += 1) {
    if (seriesOfType.series[seriesOfType.seriesOrder[seriesIndex]].data.length > 0) {
      return {
        type: typesAvailable[typeIndex],
        seriesId: seriesOfType.seriesOrder[seriesIndex],
      };
    }
  }

  return null;
}

/**
 * Returns the previous series type and id that contains some data.
 * Returns `null` if no other series have data.
 */
function getPreviousSeriesWithData(
  series: ProcessedSeries<keyof ChartsSeriesConfig>,
  type?: ChartSeriesType,
  seriesId?: SeriesId,
): {
  type: ChartSeriesType;
  seriesId: SeriesId;
} | null {
  const startingTypeIndex =
    type !== undefined && series[type] ? Object.keys(series).indexOf(type) : 0;
  const startingSeriesIndex =
    type !== undefined && seriesId !== undefined && series[type] && series[type].series[seriesId]
      ? series[type].seriesOrder.indexOf(seriesId)
      : 1;

  const typesAvailable = Object.keys(series) as (keyof typeof series)[];

  for (let typeGap = 0; typeGap < typesAvailable.length; typeGap += 1) {
    const typeIndex = (typesAvailable.length + startingTypeIndex - typeGap) % typesAvailable.length;
    const seriesOfType = series[typesAvailable[typeIndex]]!;

    for (let seriesGap = 1; seriesGap < seriesOfType.seriesOrder.length; seriesGap += 1) {
      const seriesIndex =
        (seriesOfType.seriesOrder.length + startingSeriesIndex - seriesGap) %
        seriesOfType.seriesOrder.length;

      if (seriesOfType.series[seriesOfType.seriesOrder[seriesIndex]].data.length > 0) {
        return {
          type: typesAvailable[typeIndex],
          seriesId: seriesOfType.seriesOrder[seriesIndex],
        };
      }
    }
  }

  return null;
}

function seriesHasData(
  series: ProcessedSeries<keyof ChartsSeriesConfig>,
  type: ChartSeriesType,
  seriesId: SeriesId,
) {
  const data = series[type]?.series[seriesId]?.data;
  return data && data.length > 0;
}
export const useChartKeyboardNavigation: ChartPlugin<UseChartKeyboardNavigationSignature> = ({
  store,
  svgRef,
}) => {
  const focusNextItem = useEventCallback(function focusNextItem() {
    store.update((state) => {
      let { type, seriesId } = state.keyboardNavigation ?? {};
      if (
        type === undefined ||
        seriesId === undefined ||
        !seriesHasData(state.series.processedSeries, type, seriesId)
      ) {
        const nextSeries = getNextSeriesWithData(state.series.processedSeries, type, seriesId);
        if (nextSeries === null) {
          return { ...state, keyboardNavigation: null }; // No series to move the focus too.
        }
        type = nextSeries.type;
        seriesId = nextSeries.seriesId;
      }

      const dataLength = state.series.processedSeries[type]!.series[seriesId].data.length;

      return {
        ...state,
        keyboardNavigation: {
          type,
          seriesId,
          dataIndex: ((state.keyboardNavigation?.dataIndex ?? -1) + 1) % dataLength,
        },
      };
    });
  });

  const focusPreviousItem = useEventCallback(function focusPreviousItem() {
    store.update((state) => {
      let { type, seriesId } = state.keyboardNavigation ?? {};
      if (
        type === undefined ||
        seriesId === undefined ||
        !seriesHasData(state.series.processedSeries, type, seriesId)
      ) {
        const previousSeries = getPreviousSeriesWithData(
          state.series.processedSeries,
          type,
          seriesId,
        );
        if (previousSeries === null) {
          return { ...state, keyboardNavigation: null }; // No series to move the focus too.
        }
        type = previousSeries.type;
        seriesId = previousSeries.seriesId;
      }

      const dataLength = state.series.processedSeries[type]!.series[seriesId].data.length;

      return {
        ...state,
        keyboardNavigation: {
          type,
          seriesId,
          dataIndex: (dataLength + (state.keyboardNavigation?.dataIndex ?? 1) - 1) % dataLength,
        },
      };
    });
  });

  const focusPreviousSeries = useEventCallback(function focusPreviousSeries() {
    let setNewSeries = false;
    store.update((state) => {
      let { type, seriesId } = state.keyboardNavigation ?? {};

      const previousSeries = getPreviousSeriesWithData(
        state.series.processedSeries,
        type,
        seriesId,
      );
      if (previousSeries === null) {
        return { ...state, keyboardNavigation: null }; // No series to move the focus too.
      }
      type = previousSeries.type;
      seriesId = previousSeries.seriesId;

      const dataLength = state.series.processedSeries[type]!.series[seriesId].data.length;

      setNewSeries = true;
      return {
        ...state,
        keyboardNavigation: {
          type,
          seriesId,
          dataIndex: Math.min(dataLength - 1, state.keyboardNavigation?.dataIndex ?? 0),
        },
      };
    });
    return setNewSeries;
  });

  const focusNextSeries = useEventCallback(function focusNextSeries() {
    let setNewSeries = false;

    store.update((state) => {
      let { type, seriesId } = state.keyboardNavigation ?? {};

      const nextSeries = getNextSeriesWithData(state.series.processedSeries, type, seriesId);

      if (nextSeries === null) {
        return { ...state, keyboardNavigation: null }; // No series to move the focus too.
      }
      type = nextSeries.type;
      seriesId = nextSeries.seriesId;

      const dataLength = state.series.processedSeries[type]!.series[seriesId].data.length;

      setNewSeries = true;
      return {
        ...state,
        keyboardNavigation: {
          type,
          seriesId,
          dataIndex: Math.min(dataLength - 1, state.keyboardNavigation?.dataIndex ?? 0),
        },
      };
    });

    return setNewSeries;
  });

  const removeFocus = useEventCallback(function removeFocus() {
    store.update((state) => {
      if (state.keyboardNavigation === null) {
        return state;
      }
      return { ...state, keyboardNavigation: null };
    });
  });

  React.useEffect(() => {
    const element = svgRef.current;
    if (!element) {
      return undefined;
    }

    function keyBoardHandler(event: KeyboardEvent) {
      switch (event.key) {
        case 'ArrowRight':
          focusNextItem();
          break;
        case 'ArrowLeft':
          focusPreviousItem();
          break;
        case 'ArrowDown': {
          const updatedStore = focusPreviousSeries();

          if (updatedStore) {
            event.preventDefault();
          }

          break;
        }
        case 'ArrowUp': {
          const updatedStore = focusNextSeries();

          if (updatedStore) {
            event.preventDefault();
          }
          break;
        }
        default:
          break;
      }
    }

    element.addEventListener('keydown', keyBoardHandler);
    element.addEventListener('focus', focusNextItem);
    element.addEventListener('blur', removeFocus);
    return () => {
      element.removeEventListener('keydown', keyBoardHandler);
      element.removeEventListener('focus', focusNextItem);
      element.removeEventListener('blur', removeFocus);
    };
  }, [svgRef, focusNextItem, focusPreviousItem, removeFocus, focusPreviousSeries, focusNextSeries]);

  return {
    instance: {},
  };
};

useChartKeyboardNavigation.getInitialState = () => ({
  keyboardNavigation: null,
});

useChartKeyboardNavigation.params = {};
