'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import useEnhancedEffect from '@mui/utils/useEnhancedEffect';
import { selectorChartDefaultizedSeries } from '../../corePlugins/useChartSeries/useChartSeries.selectors';
import type { ChartPlugin } from '../../models';
import type { UseChartKeyboardNavigationSignature } from './useChartKeyboardNavigation.types';
import type { ChartSeriesType } from '../../../../models/seriesType/config';
import type { GetNextFocusedItem } from '../../models/seriesConfig/getNextFocusedItem.types';

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

      let seriesType = newFocusedItem?.type;
      if (!seriesType) {
        seriesType = (
          Object.keys(selectorChartDefaultizedSeries(store.state)) as ChartSeriesType[]
        ).find((key) => store.state.series.seriesConfig[key] !== undefined);

        if (seriesType === undefined) {
          return;
        }
      }

      const newItemGetter = store.state.series.seriesConfig[seriesType]?.getNextFocusedItem as
        | GetNextFocusedItem<typeof seriesType>
        | undefined;
      if (!newItemGetter) {
        return;
      }

      newFocusedItem = newItemGetter(newFocusedItem, event, store.state);

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
