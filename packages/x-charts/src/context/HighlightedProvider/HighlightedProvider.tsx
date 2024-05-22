import * as React from 'react';
import useControlled from '@mui/utils/useControlled';
import {
  HighlightedItemData,
  HighlightedContext,
  HighlightedScope,
  HighlightedState,
} from './HighlightedContext';
import { highlightedReducer } from './highlightedReducer';
import { useSeries } from '../../hooks/useSeries';
import { ChartSeriesType } from '../../models/seriesType/config';
import { SeriesId } from '../../models/seriesType/common';

export type HighlightedProviderProps = {
  children: React.ReactNode;
  highlightedItem?: HighlightedItemData;
};

export function HighlightedProvider({
  children,
  highlightedItem: highlightedItemProps,
}: HighlightedProviderProps) {
  const [highlightedItem, setHighlightedItem] = useControlled({
    controlled: highlightedItemProps,
    default: null,
    name: 'HighlightedProvider',
    state: 'highlightedItem',
  });

  const [state, dispatch] = React.useReducer(highlightedReducer, {
    options: undefined,
    highlightedItem,
    isFaded: () => false,
    isHighlighted: () => false,
  });

  const series = useSeries();
  const seriesById = React.useMemo(() => {
    const map: Map<SeriesId, Partial<HighlightedScope> | undefined> = new Map();

    Object.keys(series).forEach((seriesType) => {
      const seriesData = series[seriesType as ChartSeriesType];
      Object.keys(seriesData?.series ?? {}).forEach((seriesId) => {
        const seriesItem = seriesData?.series[seriesId];
        map.set(seriesId, seriesItem?.highlightScope);
      });
    });
    return map;
  }, [series]);

  const highlightScope = highlightedItem ? seriesById.get(highlightedItem.seriesId) ?? null : null;

  React.useEffect(() => {
    dispatch(
      highlightedItem
        ? { type: 'set-highlighted', itemData: highlightedItem }
        : { type: 'clear-highlighted' },
    );
  }, [highlightedItem]);

  React.useEffect(() => {
    dispatch(
      highlightScope ? { type: 'set-options', options: highlightScope } : { type: 'clear-options' },
    );
  }, [highlightScope]);

  const providerValue: HighlightedState = React.useMemo(
    () => ({
      ...state,
      setHighlighted: (itemData: HighlightedItemData) => setHighlightedItem(itemData),
      clearHighlighted: () => setHighlightedItem(null),
    }),
    [state, setHighlightedItem],
  );

  return (
    <HighlightedContext.Provider value={providerValue}>{children}</HighlightedContext.Provider>
  );
}
