import * as React from 'react';
import PropTypes from 'prop-types';
import useControlled from '@mui/utils/useControlled';
import {
  HighlightItemData,
  HighlightedContext,
  HighlightScope,
  HighlightedState,
} from './HighlightedContext';
import { createIsFaded } from './createIsFaded';
import { createIsHighlighted } from './createIsHighlighted';
import { useSeries } from '../../hooks/useSeries';
import { ChartSeriesType } from '../../models/seriesType/config';
import { SeriesId } from '../../models/seriesType/common';
import { Initializable } from '../context.types';

export type HighlightedProviderProps = {
  children: React.ReactNode;
  /**
   * The item currently highlighted. Turns highlighting into a controlled prop.
   */
  highlightedItem?: HighlightItemData | null;
  /**
   * The callback fired when the highlighted item changes.
   *
   * @param {HighlightItemData | null} highlightedItem  The newly highlighted item.
   */
  onHighlightChange?: (highlightedItem: HighlightItemData | null) => void;
};

const mergeDeprecatedOptions = (options?: Partial<HighlightScope>): HighlightScope => {
  const { highlighted, faded, ...other } = options ?? {};
  return {
    highlight: highlighted,
    fade: faded,
    ...other,
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
      ? (seriesById.get(highlightedItem.seriesId) ?? undefined)
      : undefined;

  const providerValue = React.useMemo<Initializable<HighlightedState>>(() => {
    return {
      isInitialized: true,
      data: {
        highlightScope,
        highlightedItem,
        setHighlighted: (itemData) => {
          setHighlightedItem(itemData);
          onHighlightChange?.(itemData);
        },
        clearHighlighted: () => {
          setHighlightedItem(null);
          onHighlightChange?.(null);
        },
        isHighlighted: createIsHighlighted(highlightScope, highlightedItem),
        isFaded: createIsFaded(highlightScope, highlightedItem),
      },
    };
  }, [highlightedItem, highlightScope, setHighlightedItem, onHighlightChange]);

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
    dataIndex: PropTypes.number,
    seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }),
  /**
   * The callback fired when the highlighted item changes.
   *
   * @param {HighlightItemData | null} highlightedItem  The newly highlighted item.
   */
  onHighlightChange: PropTypes.func,
} as any;

export { HighlightedProvider };
