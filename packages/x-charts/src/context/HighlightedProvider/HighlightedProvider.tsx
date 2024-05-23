import * as React from 'react';
import PropTypes from 'prop-types';
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
  /**
   * The item currently highlighted. Turns highlighting into a controlled prop.
   */
  highlightedItem?: HighlightItemData;
  /**
   * The callback fired when the highlighted item changes.
   *
   * @param {HighlightItemData} highlightedItem  The newly highlighted item.
   */
  onHighlightChange?: (highlightedItem: HighlightItemData) => void;
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

function HighlightedProvider({
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
        onHighlightChange?.({});
        setHighlightedItem(null);
      },
    }),
    [state, setHighlightedItem, onHighlightChange],
  );

  return (
    <HighlightedContext.Provider value={providerValue}>{children}</HighlightedContext.Provider>
  );
}

HighlightedProvider.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  /**
   * The item currently highlighted. Turns highlighting into a controlled prop.
   */
  highlightedItem: PropTypes.shape({
    itemId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  /**
   * The callback fired when the highlighted item changes.
   *
   * @param {HighlightItemData} highlightedItem  The newly highlighted item.
   */
  onHighlightChange: PropTypes.func,
} as any;

export { HighlightedProvider };
