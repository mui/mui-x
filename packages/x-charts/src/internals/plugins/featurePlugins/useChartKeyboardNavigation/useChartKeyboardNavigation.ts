'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { type ChartPlugin, type ChartState } from '../../models';
import { type UseChartKeyboardNavigationSignature } from './useChartKeyboardNavigation.types';
import {
  getNextSeriesWithData,
  getPreviousSeriesWithData,
  seriesHasData,
} from './useChartKeyboardNavigation.helpers';
import { selectorChartSeriesProcessed } from '../../corePlugins/useChartSeries/useChartSeries.selectors';

function getNextIndexFocusedItem(state: ChartState<[UseChartKeyboardNavigationSignature], []>) {
  const processedSeries = selectorChartSeriesProcessed(state);
  let { type, seriesId } = state.keyboardNavigation.item ?? {};
  if (
    type === undefined ||
    // @ts-expect-error sankey is not in MIT version
    type === 'sankey' ||
    seriesId === undefined ||
    !seriesHasData(processedSeries, type, seriesId)
  ) {
    const nextSeries = getNextSeriesWithData(processedSeries, type, seriesId);
    if (nextSeries === null) {
      return null;
    }
    type = nextSeries.type;
    seriesId = nextSeries.seriesId;
  }

  const dataLength = processedSeries[type]!.series[seriesId].data.length;
  return {
    type,
    seriesId,
    dataIndex: ((state.keyboardNavigation.item?.dataIndex ?? -1) + 1) % dataLength,
  };
}

function getPreviousIndexFocusedItem(state: ChartState<[UseChartKeyboardNavigationSignature], []>) {
  const processedSeries = selectorChartSeriesProcessed(state);
  let { type, seriesId } = state.keyboardNavigation.item ?? {};
  if (
    type === undefined ||
    // @ts-expect-error sankey is not in MIT version
    type === 'sankey' ||
    seriesId === undefined ||
    !seriesHasData(processedSeries, type, seriesId)
  ) {
    const previousSeries = getPreviousSeriesWithData(processedSeries, type, seriesId);
    if (previousSeries === null) {
      return null;
    }
    type = previousSeries.type;
    seriesId = previousSeries.seriesId;
  }

  const dataLength = processedSeries[type]!.series[seriesId].data.length;
  return {
    type,
    seriesId,
    dataIndex: (dataLength + (state.keyboardNavigation.item?.dataIndex ?? 1) - 1) % dataLength,
  };
}

function getNextSeriesFocusedItem(state: ChartState<[UseChartKeyboardNavigationSignature], []>) {
  const processedSeries = selectorChartSeriesProcessed(state);
  let { type, seriesId } = state.keyboardNavigation.item ?? {};

  const nextSeries = getNextSeriesWithData(processedSeries, type, seriesId);

  if (nextSeries === null) {
    return null; // No series to move the focus to.
  }
  type = nextSeries.type;
  seriesId = nextSeries.seriesId;

  const dataLength = processedSeries[type]!.series[seriesId].data.length;

  return {
    type,
    seriesId,
    dataIndex: Math.min(dataLength - 1, state.keyboardNavigation.item?.dataIndex ?? 0),
  };
}

function getPreviousSeriesFocusedItem(
  state: ChartState<[UseChartKeyboardNavigationSignature], []>,
) {
  const processedSeries = selectorChartSeriesProcessed(state);
  let { type, seriesId } = state.keyboardNavigation.item ?? {};

  const previousSeries = getPreviousSeriesWithData(processedSeries, type, seriesId);
  if (previousSeries === null) {
    return null; // No series to move the focus to.
  }
  type = previousSeries.type;
  seriesId = previousSeries.seriesId;

  const dataLength = processedSeries[type]!.series[seriesId].data.length;

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
    if (store.state.keyboardNavigation.item !== null) {
      store.set('keyboardNavigation', {
        ...store.state.keyboardNavigation,
        item: null,
      });
    }
  });

  React.useEffect(() => {
    const element = svgRef.current;

    if (!element || !params.enableKeyboardNavigation) {
      return undefined;
    }

    function keyboardHandler(event: KeyboardEvent) {
      let newFocusedItem = store.state.keyboardNavigation.item;
      switch (event.key) {
        case 'ArrowRight':
          newFocusedItem = getNextIndexFocusedItem(store.state);
          break;
        case 'ArrowLeft':
          newFocusedItem = getPreviousIndexFocusedItem(store.state);
          break;
        case 'ArrowDown': {
          newFocusedItem = getPreviousSeriesFocusedItem(store.state);
          break;
        }
        case 'ArrowUp': {
          newFocusedItem = getNextSeriesFocusedItem(store.state);
          break;
        }
        default:
          break;
      }

      if (newFocusedItem !== store.state.keyboardNavigation.item) {
        event.preventDefault();

        store.update({
          ...(store.state.highlight && {
            highlight: { ...store.state.highlight, lastUpdate: 'keyboard' },
          }),
          ...(store.state.interaction && {
            interaction: { ...store.state.interaction, lastUpdate: 'keyboard' },
          }),
          keyboardNavigation: {
            ...store.state.keyboardNavigation,
            item: newFocusedItem,
          },
        });
      }
    }

    element.addEventListener('keydown', keyboardHandler);
    element.addEventListener('blur', removeFocus);
    return () => {
      element.removeEventListener('keydown', keyboardHandler);
      element.removeEventListener('blur', removeFocus);
    };
  }, [svgRef, removeFocus, params.enableKeyboardNavigation, store]);

  useEnhancedEffect(() => {
    if (
      store.state.keyboardNavigation.enableKeyboardNavigation !== params.enableKeyboardNavigation
    ) {
      store.set('keyboardNavigation', {
        ...store.state.keyboardNavigation,
        enableKeyboardNavigation: !!params.enableKeyboardNavigation,
      });
    }
  }, [store, params.enableKeyboardNavigation]);

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
