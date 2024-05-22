import * as React from 'react';
import useControlled from '@mui/utils/useControlled';
import {
  HighlightItemData,
  HighlightedContext,
  HighlightScope,
  HighlightedState,
  DeprecatedHighlightScope,
} from './HighlightedContext';
import { highlightedReducer } from './highlightedReducer';
import { useSeries } from '../../hooks/useSeries';
import { ChartSeriesType } from '../../models/seriesType/config';
import { SeriesId } from '../../models/seriesType/common';

export type HighlightedProviderProps = {
  children: React.ReactNode;
  highlightedItem?: HighlightItemData | null;
  onHighlightChange?: (highlightedItem: HighlightItemData | null) => void;
};

const mergeDeprecatedOptions = (
  options?: Partial<HighlightScope> | Partial<DeprecatedHighlightScope>,
): HighlightScope => {
  // @ts-expect-error deprecated behavior.
  const { highlighted, faded, ...rest } = options ?? {};
  return {
    highlight: highlighted === 'series' ? 'same-series' : highlighted,
    fade: faded === 'series' ? 'same-series' : faded,
    ...rest,
  };
};

export function HighlightedProvider({
  children,
  highlightedItem: highlightedItemProps,
  onHighlightChange,
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
    const map: Map<SeriesId, Partial<HighlightScope> | undefined> = new Map();

    Object.keys(series).forEach((seriesType) => {
      const seriesData = series[seriesType as ChartSeriesType];
      Object.keys(seriesData?.series ?? {}).forEach((seriesId) => {
        const seriesItem = seriesData?.series[seriesId];
        map.set(seriesId, mergeDeprecatedOptions(seriesItem?.highlightScope));
      });
    });
    return map;
  }, [series]);

  const highlightScope =
    highlightedItem && highlightedItem.seriesId
      ? seriesById.get(highlightedItem.seriesId) ?? null
      : null;

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
      setHighlighted: (itemData: HighlightItemData) => {
        onHighlightChange?.(itemData);
        setHighlightedItem(itemData);
      },
      clearHighlighted: () => {
        onHighlightChange?.(null);
        setHighlightedItem(null);
      },
    }),
    [state, setHighlightedItem, onHighlightChange],
  );

  return (
    <HighlightedContext.Provider value={providerValue}>{children}</HighlightedContext.Provider>
  );
}
