'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { ChartPlugin, ChartState } from '../../models';
import { UseChartKeyboardNavigationSignature } from './useChartKeyboardNavigation.types';
import {
  getNextSeriesWithData,
  getPreviousSeriesWithData,
  seriesHasData,
} from './useChartKeyboardNavigation.helpers';

function getNextIndexFocusedItem(state: ChartState<[UseChartKeyboardNavigationSignature], []>) {
  let { type, seriesId } = state.keyboardNavigation.item ?? {};
  if (
    type === undefined ||
    // @ts-ignore sankey is not in MIT version
    type === 'sankey' ||
    seriesId === undefined ||
    !seriesHasData(state.series.processedSeries, type, seriesId)
  ) {
    const nextSeries = getNextSeriesWithData(state.series.processedSeries, type, seriesId);
    if (nextSeries === null) {
      return null;
    }
    type = nextSeries.type;
    seriesId = nextSeries.seriesId;
  }

  const dataLength = state.series.processedSeries[type]!.series[seriesId].data.length;
  return {
    type,
    seriesId,
    dataIndex: ((state.keyboardNavigation.item?.dataIndex ?? -1) + 1) % dataLength,
  };
}

function getPreviousIndexFocusedItem(state: ChartState<[UseChartKeyboardNavigationSignature], []>) {
  let { type, seriesId } = state.keyboardNavigation.item ?? {};
  if (
    type === undefined ||
    // @ts-ignore sankey is not in MIT version
    type === 'sankey' ||
    seriesId === undefined ||
    !seriesHasData(state.series.processedSeries, type, seriesId)
  ) {
    const previousSeries = getPreviousSeriesWithData(state.series.processedSeries, type, seriesId);
    if (previousSeries === null) {
      return null;
    }
    type = previousSeries.type;
    seriesId = previousSeries.seriesId;
  }

  const dataLength = state.series.processedSeries[type]!.series[seriesId].data.length;
  return {
    type,
    seriesId,
    dataIndex: (dataLength + (state.keyboardNavigation.item?.dataIndex ?? 1) - 1) % dataLength,
  };
}

function getNextSeriesFocusedItem(state: ChartState<[UseChartKeyboardNavigationSignature], []>) {
  let { type, seriesId } = state.keyboardNavigation.item ?? {};

  const nextSeries = getNextSeriesWithData(state.series.processedSeries, type, seriesId);

  if (nextSeries === null) {
    return null; // No series to move the focus to.
  }
  type = nextSeries.type;
  seriesId = nextSeries.seriesId;

  const dataLength = state.series.processedSeries[type]!.series[seriesId].data.length;

  return {
    type,
    seriesId,
    dataIndex: Math.min(dataLength - 1, state.keyboardNavigation.item?.dataIndex ?? 0),
  };
}

function getPreviousSeriesFocusedItem(
  state: ChartState<[UseChartKeyboardNavigationSignature], []>,
) {
  let { type, seriesId } = state.keyboardNavigation.item ?? {};

  const previousSeries = getPreviousSeriesWithData(state.series.processedSeries, type, seriesId);
  if (previousSeries === null) {
    return null; // No series to move the focus to.
  }
  type = previousSeries.type;
  seriesId = previousSeries.seriesId;

  const dataLength = state.series.processedSeries[type]!.series[seriesId].data.length;

  return {
    type,
    seriesId,
    dataIndex: Math.min(dataLength - 1, state.keyboardNavigation.item?.dataIndex ?? 0),
  };
}

export const useChartKeyboardNavigation: ChartPlugin<UseChartKeyboardNavigationSignature> = ({
  params,
  store,
  svgRef,
}) => {
  const removeFocus = useEventCallback(function removeFocus() {
    store.update((state) => {
      if (state.keyboardNavigation.item === null) {
        return state;
      }
      return {
        ...state,
        keyboardNavigation: {
          ...state.keyboardNavigation,
          item: null,
        },
      };
    });
  });

  React.useEffect(() => {
    const element = svgRef.current;

    if (!element || !params.enableKeyboardNavigation) {
      return undefined;
    }

    function keyboardHandler(event: KeyboardEvent) {
      store.update((prevState) => {
        let newFocusedItem = prevState.keyboardNavigation.item;

        switch (event.key) {
          case 'ArrowRight':
            newFocusedItem = getNextIndexFocusedItem(prevState);
            break;
          case 'ArrowLeft':
            newFocusedItem = getPreviousIndexFocusedItem(prevState);
            break;
          case 'ArrowDown': {
            newFocusedItem = getPreviousSeriesFocusedItem(prevState);
            break;
          }
          case 'ArrowUp': {
            newFocusedItem = getNextSeriesFocusedItem(prevState);
            break;
          }
          default:
            break;
        }

        if (newFocusedItem !== prevState.keyboardNavigation.item) {
          event.preventDefault();
          return {
            ...prevState,
            ...(prevState.interaction && {
              interaction: { ...prevState.interaction, lastUpdate: 'keyboard' },
            }),
            keyboardNavigation: {
              ...prevState.keyboardNavigation,
              item: newFocusedItem,
            },
          };
        }

        return prevState;
      });
    }

    element.addEventListener('keydown', keyboardHandler);
    element.addEventListener('blur', removeFocus);
    return () => {
      element.removeEventListener('keydown', keyboardHandler);
      element.removeEventListener('blur', removeFocus);
    };
  }, [svgRef, removeFocus, params.enableKeyboardNavigation, store]);

  useEnhancedEffect(
    () =>
      store.update((prev) =>
        prev.keyboardNavigation.enableKeyboardNavigation === params.enableKeyboardNavigation
          ? prev
          : {
              ...prev,
              keyboardNavigation: {
                ...prev.keyboardNavigation,
                enableKeyboardNavigation: !!params.enableKeyboardNavigation,
              },
            },
      ),

    [store, params.enableKeyboardNavigation],
  );

  return {};
};

useChartKeyboardNavigation.getInitialState = (params) => ({
  keyboardNavigation: {
    item: null,
    enableKeyboardNavigation: !!params.enableKeyboardNavigation,
  },
});

useChartKeyboardNavigation.params = {
  enableKeyboardNavigation: true,
};
