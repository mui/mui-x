'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { ChartPlugin } from '../../models';
import { UseChartKeyboardNavigationSignature } from './useChartKeyboardNavigation.types';
import {
  getNextSeriesWithData,
  getPreviousSeriesWithData,
  seriesHasData,
} from './useChartKeyboardNavigation.helpers';

export const useChartKeyboardNavigation: ChartPlugin<UseChartKeyboardNavigationSignature> = ({
  params,
  store,
  svgRef,
}) => {
  const focusNextItem = useEventCallback(function focusNextItem() {
    store.update((state) => {
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
          return {
            ...state,
            keyboardNavigation: {
              ...state.keyboardNavigation,
              item: null, // No series to move the focus too.
            },
          };
        }
        type = nextSeries.type;
        seriesId = nextSeries.seriesId;
      }

      const dataLength = state.series.processedSeries[type]!.series[seriesId].data.length;

      return {
        ...state,
        keyboardNavigation: {
          ...state.keyboardNavigation,
          item: {
            type,
            seriesId,
            dataIndex: ((state.keyboardNavigation.item?.dataIndex ?? -1) + 1) % dataLength,
          },
        },
      };
    });
  });

  const focusPreviousItem = useEventCallback(function focusPreviousItem() {
    store.update((state) => {
      let { type, seriesId } = state.keyboardNavigation.item ?? {};
      if (
        type === undefined ||
        // @ts-ignore sankey is not in MIT version
        type === 'sankey' ||
        seriesId === undefined ||
        !seriesHasData(state.series.processedSeries, type, seriesId)
      ) {
        const previousSeries = getPreviousSeriesWithData(
          state.series.processedSeries,
          type,
          seriesId,
        );
        if (previousSeries === null) {
          return {
            ...state,
            keyboardNavigation: {
              ...state.keyboardNavigation,
              item: null, // No series to move the focus too.} };
            },
          };
        }
        type = previousSeries.type;
        seriesId = previousSeries.seriesId;
      }

      const dataLength = state.series.processedSeries[type]!.series[seriesId].data.length;

      return {
        ...state,
        keyboardNavigation: {
          ...state.keyboardNavigation,
          item: {
            type,
            seriesId,
            dataIndex:
              (dataLength + (state.keyboardNavigation.item?.dataIndex ?? 1) - 1) % dataLength,
          },
        },
      };
    });
  });

  const focusPreviousSeries = useEventCallback(function focusPreviousSeries() {
    let setNewSeries = false;
    store.update((state) => {
      let { type, seriesId } = state.keyboardNavigation.item ?? {};

      const previousSeries = getPreviousSeriesWithData(
        state.series.processedSeries,
        type,
        seriesId,
      );
      if (previousSeries === null) {
        return {
          ...state,
          keyboardNavigation: {
            ...state.keyboardNavigation,
            item: null, // No series to move the focus too.
          },
        };
      }
      type = previousSeries.type;
      seriesId = previousSeries.seriesId;

      const dataLength = state.series.processedSeries[type]!.series[seriesId].data.length;

      setNewSeries = true;
      return {
        ...state,
        keyboardNavigation: {
          ...state.keyboardNavigation,
          item: {
            type,
            seriesId,
            dataIndex: Math.min(dataLength - 1, state.keyboardNavigation.item?.dataIndex ?? 0),
          },
        },
      };
    });
    return setNewSeries;
  });

  const focusNextSeries = useEventCallback(function focusNextSeries() {
    let setNewSeries = false;

    store.update((state) => {
      let { type, seriesId } = state.keyboardNavigation.item ?? {};

      const nextSeries = getNextSeriesWithData(state.series.processedSeries, type, seriesId);

      if (nextSeries === null) {
        return {
          ...state,
          keyboardNavigation: {
            ...state.keyboardNavigation,
            item: null, // No series to move the focus too.
          },
        };
      }
      type = nextSeries.type;
      seriesId = nextSeries.seriesId;

      const dataLength = state.series.processedSeries[type]!.series[seriesId].data.length;

      setNewSeries = true;
      return {
        ...state,
        keyboardNavigation: {
          ...state.keyboardNavigation,
          item: {
            type,
            seriesId,
            dataIndex: Math.min(dataLength - 1, state.keyboardNavigation.item?.dataIndex ?? 0),
          },
        },
      };
    });

    return setNewSeries;
  });

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
            // prevents scrolling
            event.preventDefault();
          }

          break;
        }
        case 'ArrowUp': {
          const updatedStore = focusNextSeries();

          if (updatedStore) {
            // prevents scrolling
            event.preventDefault();
          }
          break;
        }
        default:
          break;
      }
    }

    element.addEventListener('keydown', keyboardHandler);
    element.addEventListener('blur', removeFocus);
    return () => {
      element.removeEventListener('keydown', keyboardHandler);
      element.removeEventListener('blur', removeFocus);
    };
  }, [
    svgRef,
    focusNextItem,
    focusPreviousItem,
    removeFocus,
    focusPreviousSeries,
    focusNextSeries,
    params.enableKeyboardNavigation,
  ]);

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

  return {
    instance: {},
  };
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
